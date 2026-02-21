import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

function safeFileName(s) {
  return String(s)
    .trim()
    .replace(/[\/\\?%*:|"<>]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 180);
}

function typeToBaseName(typeName) {
  if (!typeName) return "unknown_type";
  return safeFileName(typeName)
    .replace(/::/g, "__")
    .replace(/\./g, "_");
}

function toYamlObject(rec) {
  return rec?.value ?? rec;
}

function parseJsonl(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      out.push(JSON.parse(line));
    } catch (e) {
      console.warn(`Skipping line ${i + 1} in ${filePath}: invalid JSON`);
    }
  }

  return out;
}

function makeEntityKey(typeName, ref) {
  return `${typeName}::${String(ref)}`;
}

function sideIsMany(relation, sideName, sideObj) {
  if (sideObj?.pos != null) return true;

  switch (relation) {
    case "manyToOne":
      return sideName === "right";
    case "oneToMany":
      return sideName === "left";
    case "manyToMany":
      return true;
    case "oneToOne":
      return false;
    case "morphToMany":
      return true;
    default:
      return true;
  }
}

function buildEntityIndexes(entities) {
  const byId = new Map();
  const byDocumentId = new Map();

  for (const entity of entities) {
    const typeName = entity?.type;
    if (!typeName) continue;

    if (entity?.id != null) {
      byId.set(makeEntityKey(typeName, entity.id), entity);
    }

    const documentId = entity?.data?.documentId;
    if (documentId != null) {
      byDocumentId.set(makeEntityKey(typeName, documentId), entity);
    }
  }

  return { byId, byDocumentId };
}

function resolveEntity(indexes, typeName, ref) {
  if (!typeName || ref == null) return null;
  return (
    indexes.byId.get(makeEntityKey(typeName, ref)) ??
    indexes.byDocumentId.get(makeEntityKey(typeName, ref)) ??
    null
  );
}

function attachLinkedEntities(entities, links) {
  const output = entities.map((entity) => ({
    ...entity,
    data: entity?.data && typeof entity.data === "object" ? { ...entity.data } : {},
  }));
  const snapshots = entities.map((entity) => JSON.parse(JSON.stringify(entity)));

  const outputIndexes = buildEntityIndexes(output);
  const snapshotIndexes = buildEntityIndexes(snapshots);

  const arrayFields = new Map(); // hostKey -> { host, field, items: [] }
  const scalarFields = new Map(); // hostKey -> { host, field, value }
  let unresolvedCount = 0;
  let linkedCount = 0;

  function collect(from, to, relation, sideName) {
    if (!from?.field) return;

    const host = resolveEntity(outputIndexes, from.type, from.ref);
    const target = resolveEntity(snapshotIndexes, to?.type, to?.ref);
    if (!host || !target) {
      unresolvedCount += 1;
      return;
    }

    if (!host.data || typeof host.data !== "object") {
      host.data = {};
    }

    const field = from.field;
    const hostKey = `${makeEntityKey(from.type, from.ref)}::${field}`;
    const many = sideIsMany(relation, sideName, from);

    linkedCount += 1;

    if (many) {
      if (!arrayFields.has(hostKey)) {
        arrayFields.set(hostKey, { host, field, items: [] });
      }
      arrayFields.get(hostKey).items.push({
        pos: from?.pos != null ? Number(from.pos) : Number.POSITIVE_INFINITY,
        order: linkedCount,
        target,
      });
    } else {
      scalarFields.set(hostKey, { host, field, value: target });
    }
  }

  for (const link of links) {
    collect(link?.left, link?.right, link?.relation, "left");
    collect(link?.right, link?.left, link?.relation, "right");
  }

  for (const { host, field, items } of arrayFields.values()) {
    items.sort((a, b) => a.pos - b.pos || a.order - b.order);

    const seen = new Set();
    const merged = [];
    for (const item of items) {
      const key = makeEntityKey(item.target?.type, item.target?.id ?? item.target?.data?.documentId ?? item.order);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item.target);
    }
    host.data[field] = merged;
  }

  for (const { host, field, value } of scalarFields.values()) {
    if (arrayFields.has(`${makeEntityKey(host.type, host.id)}::${field}`)) {
      continue;
    }
    host.data[field] = value;
  }

  return { output, unresolvedCount, linkedCount };
}

function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const exportDir = path.resolve(scriptDir, "..", "strapi-export");
  const entitiesPath = path.join(exportDir, "entities", "entities_00001.jsonl");
  const linksPath = path.join(exportDir, "links", "links_00001.jsonl");
  const outDir = process.argv[2] ?? path.join(exportDir, "yaml_out");

  fs.mkdirSync(outDir, { recursive: true });

  const entities = parseJsonl(entitiesPath).map(toYamlObject);
  const links = parseJsonl(linksPath);
  const { output: hydratedEntities, unresolvedCount, linkedCount } = attachLinkedEntities(entities, links);
  const grouped = new Map(); // type -> records[]
  const all = [];

  for (const obj of hydratedEntities) {
    const typeName = obj?.type ?? "unknown_type";

    if (!grouped.has(typeName)) {
      grouped.set(typeName, []);
    }

    grouped.get(typeName).push(obj);
    all.push(obj);
  }

  const written = [];

  for (const [typeName, records] of grouped.entries()) {
    const fileName = `${typeToBaseName(typeName)}.yaml`;
    const outPath = path.join(outDir, fileName);
    const doc = yaml.dump(records, {
      noRefs: true,
      lineWidth: 120,
      quotingType: '"',
    });

    fs.writeFileSync(outPath, doc, "utf8");
    written.push({ type: typeName, file: fileName, count: records.length });
  }

  // Combined file (optional but handy)
  const combinedPath = path.join(outDir, "all.yaml");
  fs.writeFileSync(
    combinedPath,
    yaml.dump(all, { noRefs: true, lineWidth: 120, quotingType: '"' }),
    "utf8"
  );

  console.log(`Wrote ${written.length} type-grouped YAML files to ${outDir}`);
  for (const item of written) {
    console.log(`- ${item.file}: ${item.count} records (type=${item.type})`);
  }
  console.log(`Resolved ${linkedCount - unresolvedCount} links (${unresolvedCount} unresolved references skipped)`);
  console.log(`Also wrote combined: ${combinedPath}`);
}

main();
