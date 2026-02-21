import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

function slugPart(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function isBlank(value) {
  return value == null || (typeof value === "string" && value.trim() === "");
}

function toRelativeUrl(urlValue) {
  if (typeof urlValue !== "string") return null;
  const cleanUrl = urlValue.trim().split("?")[0].split("#")[0];
  if (!cleanUrl) return null;

  if (cleanUrl.startsWith("/")) return cleanUrl;

  try {
    return new URL(cleanUrl).pathname || null;
  } catch {
    return cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
  }
}

function toImagesRelativePath(urlValue) {
  const relative = toRelativeUrl(urlValue);
  if (!relative) return null;
  const filename = relative.split("/").filter(Boolean).pop();
  if (!filename) return null;
  return `images/people/${filename}`;
}

function extractAssetRelativeUrl(value) {
  if (typeof value === "string") {
    return toImagesRelativePath(value);
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const candidate = value?.data?.url ?? value?.url;
    return toImagesRelativePath(candidate);
  }

  if (!Array.isArray(value)) return null;

  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const candidate = item?.data?.url ?? item?.url;
    const relative = toImagesRelativePath(candidate);
    if (relative) return relative;
  }

  return null;
}

function sourceEntity(record) {
  if (record?.data && typeof record.data === "object" && !Array.isArray(record.data)) {
    return record.data;
  }
  if (record && typeof record === "object" && !Array.isArray(record)) {
    return record;
  }
  return {};
}

function sourceMeta(record) {
  const data = sourceEntity(record);
  return {
    rawId: record?.id ?? null,
    documentId: data?.documentId ?? null,
  };
}

function removeMetadataFields(entity) {
  delete entity.createdAt;
  delete entity.updatedAt;
  delete entity.publishedAt;
  delete entity.locale;
  delete entity.documentId;
}

function uniqueId(base, usedIds) {
  let id = base || "item";
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${base}_${suffix}`;
    suffix += 1;
  }
  usedIds.add(id);
  return id;
}

function membershipRank(record) {
  const membership = sourceEntity(record)?.membership;
  const rankByMembership = {
    lead: 0,
    "member-postdoc": 1,
    member: 2,
    alum: 3,
    collaborator: 5,
  };
  return rankByMembership[membership] ?? 4;
}

function makePersonBaseId(entity, index) {
  const given = slugPart(entity.given_name);
  const family = slugPart(entity.family_name);
  if (given && family) return `${given}_${family}`;
  if (given) return `${given}_${index + 1}`;
  if (family) return `${family}_${index + 1}`;
  return `person_${index + 1}`;
}

function normalizePeople(records) {
  const sorted = [...records].sort((a, b) => membershipRank(a) - membershipRank(b));
  const usedIds = new Set();
  const idByRawId = new Map();
  const idByDocumentId = new Map();

  const people = sorted.map((record, index) => {
    const entity = { ...sourceEntity(record) };
    const meta = sourceMeta(record);

    removeMetadataFields(entity);

    if (entity.membership === "collaborator") delete entity.membership;
    if (entity.middle_name == null) delete entity.middle_name;
    if (isBlank(entity.homepage)) delete entity.homepage;
    if (entity.short_bio == null) delete entity.short_bio;
    if (entity.long_bio == null) delete entity.long_bio;
    if (entity.color == null) delete entity.color;
    if (entity.use_local_homepage === false) delete entity.use_local_homepage;

    if (Array.isArray(entity.links)) {
      entity.links = entity.links
        .map((link) => {
          if (!link || typeof link !== "object" || Array.isArray(link)) return link;
          const { id: _ignore, ...rest } = link;
          return rest;
        })
        .filter((link) => link != null);
    }

    if (Array.isArray(entity.links) && entity.links.length === 0) delete entity.links;

    delete entity.localizations;
    delete entity.clusters;

    const headshotUrl = extractAssetRelativeUrl(entity.headshot);
    if (headshotUrl) {
      entity.headshot = headshotUrl;
    } else {
      delete entity.headshot;
    }

    const focusedHeadshotUrl = extractAssetRelativeUrl(entity.focused_headshot);
    if (focusedHeadshotUrl) {
      entity.focused_headshot = focusedHeadshotUrl;
    } else {
      delete entity.focused_headshot;
    }

    const id = uniqueId(makePersonBaseId(entity, index), usedIds);
    if (meta.rawId != null) idByRawId.set(String(meta.rawId), id);
    if (meta.documentId != null) idByDocumentId.set(String(meta.documentId), id);

    return { id, ...entity };
  });

  return { people, idByRawId, idByDocumentId };
}

function makeVenueBaseId(entity, index) {
  const shortName = slugPart(entity.short_name);
  const fullName = slugPart(entity.full_name);
  const year = String(entity.year ?? "").trim();

  if (shortName && year) return `${shortName}_${year}`;
  if (fullName && year) return `${fullName}_${year}`;
  if (shortName) return shortName;
  if (fullName) return fullName;
  return `venue_${index + 1}`;
}

function sortVenues(a, b) {
  const yearA = Number.isFinite(Number(a?.year)) ? Number(a.year) : -Infinity;
  const yearB = Number.isFinite(Number(b?.year)) ? Number(b.year) : -Infinity;
  if (yearA !== yearB) return yearB - yearA;

  const nameA = String(a?.short_name ?? a?.full_name ?? a?.id ?? "");
  const nameB = String(b?.short_name ?? b?.full_name ?? b?.id ?? "");
  return nameA.localeCompare(nameB);
}

function normalizeVenues(records) {
  const usedIds = new Set();
  const idByRawId = new Map();
  const idByDocumentId = new Map();
  const yearById = new Map();

  const venues = records.map((record, index) => {
    const entity = { ...sourceEntity(record) };
    const meta = sourceMeta(record);

    removeMetadataFields(entity);

    if (isBlank(entity.short_name)) delete entity.short_name;
    if (isBlank(entity.full_name)) delete entity.full_name;
    if (isBlank(entity.location)) delete entity.location;
    if (isBlank(entity.homepage)) delete entity.homepage;
    if (isBlank(entity.conference_start)) delete entity.conference_start;
    if (isBlank(entity.conference_end)) delete entity.conference_end;
    if (isBlank(entity.name_year)) delete entity.name_year;
    delete entity.localizations;

    const id = uniqueId(makeVenueBaseId(entity, index), usedIds);
    if (meta.rawId != null) idByRawId.set(String(meta.rawId), id);
    if (meta.documentId != null) idByDocumentId.set(String(meta.documentId), id);
    if (Number.isFinite(Number(entity.year))) {
      yearById.set(id, Number(entity.year));
    }

    return { id, ...entity };
  });

  venues.sort(sortVenues);
  return { venues, idByRawId, idByDocumentId, yearById };
}

function makeClusterBaseId(entity, index) {
  const title = slugPart(entity.title);
  if (title) return title;
  return `cluster_${index + 1}`;
}

function normalizeClusters(records, peopleIds) {
  const usedIds = new Set();
  const idByRawId = new Map();
  const idByDocumentId = new Map();

  const clusters = records.map((record, index) => {
    const entity = { ...sourceEntity(record) };
    const meta = sourceMeta(record);

    removeMetadataFields(entity);
    if (isBlank(entity.description)) delete entity.description;
    const authorIds = mapLinkedArrayToIds(entity.authors, peopleIds.idByRawId, peopleIds.idByDocumentId);
    delete entity.authors;
    delete entity.publications;
    delete entity.localizations;

    if (authorIds.length > 0) {
      entity.authors = authorIds;
    }

    const id = uniqueId(makeClusterBaseId(entity, index), usedIds);
    if (meta.rawId != null) idByRawId.set(String(meta.rawId), id);
    if (meta.documentId != null) idByDocumentId.set(String(meta.documentId), id);

    return { id, ...entity };
  });

  clusters.sort((a, b) => String(a?.title ?? a?.id ?? "").localeCompare(String(b?.title ?? b?.id ?? "")));
  return { clusters, idByRawId, idByDocumentId };
}

function resolveLinkedId(linked, byRawId, byDocumentId) {
  if (!linked || typeof linked !== "object") return null;
  const rawId = linked?.id;
  if (rawId != null && byRawId.has(String(rawId))) {
    return byRawId.get(String(rawId));
  }
  const docId = linked?.data?.documentId;
  if (docId != null && byDocumentId.has(String(docId))) {
    return byDocumentId.get(String(docId));
  }
  return null;
}

function mapLinkedArrayToIds(items, byRawId, byDocumentId) {
  if (!Array.isArray(items)) return [];
  const out = [];
  for (const item of items) {
    const id = resolveLinkedId(item, byRawId, byDocumentId);
    if (id) out.push(id);
  }
  return [...new Set(out)];
}

function mapLinkedPdfFilenames(items) {
  const values = Array.isArray(items) ? items : [items];

  const out = [];
  for (const item of values) {
    if (item == null) continue;

    let filename = null;

    if (typeof item === "string" && item.trim() !== "") {
      const cleanPath = item.split("?")[0].split("#")[0];
      filename = cleanPath.substring(cleanPath.lastIndexOf("/") + 1);
    }

    const data = item?.data;
    if (!filename && data && typeof data === "object" && typeof data.url === "string" && data.url.trim() !== "") {
      const cleanUrl = data.url.split("?")[0].split("#")[0];
      filename = cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
    }
    if (!filename && data && typeof data === "object" && typeof data.name === "string" && data.name.trim() !== "") {
      filename = data.name.trim();
    }
    if (filename) out.push(`pdfs/${filename}`);
  }

  return [...new Set(out)];
}

function publicationYear(entity, venueYearById) {
  const venueObjYear = Number(entity?.venue?.year);
  if (Number.isFinite(venueObjYear)) return venueObjYear;

  if (typeof entity?.venue === "string" && venueYearById?.has(entity.venue)) {
    return venueYearById.get(entity.venue);
  }

  const fromNameYear = String(entity?.name_year ?? "").match(/(19|20)\d{2}/);
  if (fromNameYear) return Number(fromNameYear[0]);

  return null;
}

function makePublicationBaseId(entity, index, venueYearById) {
  const title = slugPart(entity.title);
  const year = publicationYear(entity, venueYearById);

  if (title && year) return `${title}_${year}`;
  if (title) return title;
  return `publication_${index + 1}`;
}

function sortPublications(a, b, venueYearById) {
  const yearA = publicationYear(a, venueYearById) ?? -Infinity;
  const yearB = publicationYear(b, venueYearById) ?? -Infinity;
  if (yearA !== yearB) return yearB - yearA;

  const titleA = String(a?.title ?? a?.id ?? "");
  const titleB = String(b?.title ?? b?.id ?? "");
  return titleA.localeCompare(titleB);
}

function makeBlogpostBaseId(entity, index) {
  const title = slugPart(entity.title);
  const created = String(entity.created ?? "").trim();
  if (title && created) return `${title}_${created}`;
  if (title) return title;
  return `blogpost_${index + 1}`;
}

function selectPreferredBlogpostRecord(records) {
  if (records.length === 1) return records[0];
  const published = records.find((record) => {
    const entity = sourceEntity(record);
    return !isBlank(entity.publishedAt);
  });
  return published ?? records[0];
}

function normalizeBlogposts(records, peopleIds) {
  const grouped = new Map();
  for (const record of records) {
    const meta = sourceMeta(record);
    const key =
      meta.documentId != null && String(meta.documentId).trim() !== ""
        ? `doc:${String(meta.documentId)}`
        : `raw:${String(meta.rawId ?? "")}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(record);
  }

  const deduped = [...grouped.values()].map(selectPreferredBlogpostRecord);

  const usedIds = new Set();
  const blogposts = deduped.map((record, index) => {
    const entity = { ...sourceEntity(record) };

    removeMetadataFields(entity);
    delete entity.localizations;

    const authorIds = mapLinkedArrayToIds(entity.authors, peopleIds.idByRawId, peopleIds.idByDocumentId);
    delete entity.authors;
    if (authorIds.length > 0) entity.authors = authorIds;

    if (isBlank(entity.content)) delete entity.content;
    if (isBlank(entity.google_doc)) delete entity.google_doc;
    if (isBlank(entity.edited)) delete entity.edited;
    if (isBlank(entity.created)) delete entity.created;

    const id = uniqueId(makeBlogpostBaseId(entity, index), usedIds);
    return { id, ...entity };
  });

  blogposts.sort((a, b) => String(b?.created ?? "").localeCompare(String(a?.created ?? "")));
  return blogposts;
}

function selectPreferredNewsitemRecord(records) {
  if (records.length === 1) return records[0];
  const published = records.find((record) => {
    const entity = sourceEntity(record);
    return !isBlank(entity.publishedAt);
  });
  return published ?? records[0];
}

function normalizeNewsitems(records, peopleIds, publicationIds) {
  const grouped = new Map();
  for (const record of records) {
    const meta = sourceMeta(record);
    const key =
      meta.documentId != null && String(meta.documentId).trim() !== ""
        ? `doc:${String(meta.documentId)}`
        : `raw:${String(meta.rawId ?? "")}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(record);
  }

  const deduped = [...grouped.values()].map(selectPreferredNewsitemRecord);

  const newsitems = deduped.map((record) => {
    const entity = { ...sourceEntity(record) };

    removeMetadataFields(entity);
    delete entity.localizations;

    const relevantPeopleIds = mapLinkedArrayToIds(
      entity.relevant_people,
      peopleIds.idByRawId,
      peopleIds.idByDocumentId
    );
    const relevantPublicationIds = mapLinkedArrayToIds(
      entity.relevant_publications,
      publicationIds.idByRawId,
      publicationIds.idByDocumentId
    );

    delete entity.relevant_people;
    delete entity.relevant_publications;

    if (relevantPeopleIds.length > 0) entity.relevant_people = relevantPeopleIds;
    if (relevantPublicationIds.length > 0) entity.relevant_publications = relevantPublicationIds;

    if (isBlank(entity.description)) delete entity.description;
    if (isBlank(entity.date)) delete entity.date;

    return entity;
  });

  newsitems.sort((a, b) => String(b?.date ?? "").localeCompare(String(a?.date ?? "")));
  return newsitems;
}

function normalizePublications(records, peopleIds, venueIds, _clusterIds) {
  const usedIds = new Set();
  const venueYearById = venueIds.yearById ?? new Map();
  const idByRawId = new Map();
  const idByDocumentId = new Map();

  const publications = records.map((record, index) => {
    const entity = { ...sourceEntity(record) };
    const meta = sourceMeta(record);

    removeMetadataFields(entity);

    if (typeof entity.title === "string") {
      entity.title = entity.title.trim();
    }

    if (entity.abstract == null) delete entity.abstract;
    if (isBlank(entity.short_description)) delete entity.short_description;
    if (entity.award === "none") delete entity.award;
    if (isBlank(entity.award_description)) delete entity.award_description;
    if (isBlank(entity.pub_details)) delete entity.pub_details;
    if (entity.submission_status === "accepted") delete entity.submission_status;
    if (isBlank(entity.submission_status)) delete entity.submission_status;
    if (Array.isArray(entity.youtube_videos) && entity.youtube_videos.length === 0) {
      delete entity.youtube_videos;
    }

    const authorIds = mapLinkedArrayToIds(entity.authors, peopleIds.idByRawId, peopleIds.idByDocumentId);
    const studentAuthorIds = mapLinkedArrayToIds(
      entity.student_authors,
      peopleIds.idByRawId,
      peopleIds.idByDocumentId
    );
    const venueId = resolveLinkedId(entity.venue, venueIds.idByRawId, venueIds.idByDocumentId);
    const pdfFilenames = mapLinkedPdfFilenames(entity.pdf);

    delete entity.authors;
    delete entity.student_authors;
    delete entity.venue;
    delete entity.clusters;
    delete entity.localizations;
    delete entity.pdf;

    if (authorIds.length > 0) entity.authors = authorIds;
    if (studentAuthorIds.length > 0) entity.student_authors = studentAuthorIds;
    if (venueId) entity.venue = venueId;
    if (pdfFilenames.length === 1) entity.pdf = pdfFilenames[0];
    if (pdfFilenames.length > 1) entity.pdf = pdfFilenames;

    const id = uniqueId(makePublicationBaseId(entity, index, venueYearById), usedIds);
    if (meta.rawId != null) idByRawId.set(String(meta.rawId), id);
    if (meta.documentId != null) idByDocumentId.set(String(meta.documentId), id);
    return { id, ...entity };
  });

  publications.sort((a, b) => sortPublications(a, b, venueYearById));
  return { publications, idByRawId, idByDocumentId };
}

function attachClusterPublicationRefs(clusters, publications) {
  const byClusterId = new Map();

  for (const pub of publications) {
    if (!Array.isArray(pub?.clusters)) continue;
    for (const clusterId of pub.clusters) {
      if (!byClusterId.has(clusterId)) byClusterId.set(clusterId, []);
      byClusterId.get(clusterId).push(pub.id);
    }
  }

  for (const cluster of clusters) {
    const refs = byClusterId.get(cluster.id) ?? [];
    if (refs.length > 0) {
      cluster.publications = refs;
    } else {
      delete cluster.publications;
    }
  }
}

function loadYamlArray(filePath, label) {
  const raw = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(raw);
  if (!Array.isArray(data)) {
    console.error(`Expected YAML top-level array in ${label}: ${filePath}`);
    process.exit(1);
  }
  return data;
}

function dumpYaml(filePath, value) {
  const out = yaml.dump(value, {
    noRefs: true,
    lineWidth: 120,
    quotingType: '"',
  });
  fs.writeFileSync(filePath, out, "utf8");
}

function main() {
  const inputDir = process.argv[2] ?? "export/yaml_out";
  const outputDir = process.argv[3] ?? "export/normalized";

  const peopleIn = path.join(inputDir, "api__author_author.yaml");
  const venuesIn = path.join(inputDir, "api__venue_venue.yaml");
  const clustersIn = path.join(inputDir, "api__cluster_cluster.yaml");
  const publicationsIn = path.join(inputDir, "api__publication_publication.yaml");
  const blogpostsIn = path.join(inputDir, "api__blogpost_blogpost.yaml");
  const newsitemsIn = path.join(inputDir, "api__newsitem_newsitem.yaml");

  fs.mkdirSync(outputDir, { recursive: true });

  const peopleRaw = loadYamlArray(peopleIn, "people input");
  const venuesRaw = loadYamlArray(venuesIn, "venues input");
  const clustersRaw = loadYamlArray(clustersIn, "clusters input");
  const publicationsRaw = loadYamlArray(publicationsIn, "publications input");
  const blogpostsRaw = loadYamlArray(blogpostsIn, "blogposts input");
  const newsitemsRaw = loadYamlArray(newsitemsIn, "newsitems input");

  const peopleNorm = normalizePeople(peopleRaw);
  const venuesNorm = normalizeVenues(venuesRaw);
  const clustersNorm = normalizeClusters(clustersRaw, peopleNorm);
  const publicationsNorm = normalizePublications(publicationsRaw, peopleNorm, venuesNorm, clustersNorm);
  const blogpostsNorm = normalizeBlogposts(blogpostsRaw, peopleNorm);
  const newsitemsNorm = normalizeNewsitems(newsitemsRaw, peopleNorm, publicationsNorm);
  attachClusterPublicationRefs(clustersNorm.clusters, publicationsNorm.publications);

  const peopleOut = path.join(outputDir, "people.yaml");
  const venuesOut = path.join(outputDir, "venues.yaml");
  const clustersOut = path.join(outputDir, "clusters.yaml");
  const publicationsOut = path.join(outputDir, "publications.yaml");
  const blogpostsOut = path.join(outputDir, "blog.yaml");
  const newsitemsOut = path.join(outputDir, "news.yaml");

  dumpYaml(peopleOut, peopleNorm.people);
  dumpYaml(venuesOut, venuesNorm.venues);
  dumpYaml(clustersOut, clustersNorm.clusters);
  dumpYaml(publicationsOut, publicationsNorm.publications);
  dumpYaml(blogpostsOut, blogpostsNorm);
  dumpYaml(newsitemsOut, newsitemsNorm);

  console.log(`Wrote ${peopleNorm.people.length} people to ${peopleOut}`);
  console.log(`Wrote ${venuesNorm.venues.length} venues to ${venuesOut}`);
  console.log(`Wrote ${clustersNorm.clusters.length} clusters to ${clustersOut}`);
  console.log(`Wrote ${publicationsNorm.publications.length} publications to ${publicationsOut}`);
  console.log(`Wrote ${blogpostsNorm.length} blogposts to ${blogpostsOut}`);
  console.log(`Wrote ${newsitemsNorm.length} newsitems to ${newsitemsOut}`);
}

main();
