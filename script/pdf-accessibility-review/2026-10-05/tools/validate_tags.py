#!/usr/bin/env python3
"""Read-only checks of tagged-PDF structure. Imported by audit.py.

This is a targeted engineering validator, not a PDF/UA or WCAG certification.
It checks content-to-structure and reverse mappings, including Form XObjects.
Manual reading order, appropriate artifact use, figure descriptions, and table
semantics still need human review. Temporary mutool normalization prevents stale
incremental-update objects from misleading pypdf; source files are never changed.

References:
https://pdf-issues.pdfa.org/32000-2-2020/clause14.html
https://www.w3.org/TR/WCAG20-TECHS/pdf.html
"""

import collections
import re

from pypdf import PdfReader
from pypdf.generic import ArrayObject, ContentStream, DictionaryObject, IndirectObject, NullObject


STANDARD_ROLES = set("Document Part Art Sect Div BlockQuote Caption TOC TOCI Index NonStruct Private P H H1 H2 H3 H4 H5 H6 L LI Lbl LBody Table TR TH TD THead TBody TFoot Span Quote Note Reference BibEntry Code Link Annot Ruby RB RT RP Warichu WT WP Figure Formula Form DocumentFragment Aside Em Strong Title FENote Sub Artifact".split())
TEXT_OPS = {b"Tj", b"TJ", b"'", b'"'}
PAINT_OPS = {b"S", b"s", b"f", b"F", b"f*", b"B", b"B*", b"b", b"b*", b"sh"}


def obj(value):
    return value.get_object() if hasattr(value, "get_object") else value


def ident(value):
    if isinstance(value, IndirectObject):
        return f"{value.idnum}:{value.generation}"
    reference = getattr(value, "indirect_reference", None)
    if reference is not None:
        return ident(reference)
    return f"direct:{id(value)}"


def items(value):
    value = obj(value)
    if value is None or isinstance(value, NullObject):
        return []
    return list(value) if isinstance(value, (list, ArrayObject)) else [value]


def raw_get(dictionary, name, default=None):
    if isinstance(dictionary, DictionaryObject) and name in dictionary:
        return dictionary.raw_get(name)
    return default



class Validator:
    def __init__(self, reader):
        self.reader = reader
        self.catalog = reader.trailer["/Root"]
        self.issues = []
        self.issue_counts = collections.Counter()
        self.roles = collections.Counter()
        self.elements = {}
        self.content_refs = {}
        self.object_refs = {}
        self.parent_tree = {}
        self.containers = {}
        self.seen_mcid = collections.defaultdict(set)
        self.struct_seen = set()
        self.form_calls = collections.Counter()
        self.pages = []
        self.headings = []
        self.figure_descriptions = []
        self.page_numbers = {ident(p): i + 1 for i, p in enumerate(reader.pages)}
        self.stream_labels = {ident(p): f"page {i + 1}" for i, p in enumerate(reader.pages)}

    def issue(self, severity, code, message, **details):
        self.issue_counts[f"{severity}:{code}"] += 1
        if sum(1 for x in self.issues if x["code"] == code) < 30:
            self.issues.append({"severity": severity, "code": code, "message": message, **details})

    def role(self, node):
        role = str(node.get("/S", "")).lstrip("/")
        visited = set()
        while role not in STANDARD_ROLES and role not in visited:
            visited.add(role)
            mapped = self.role_map.get("/" + role)
            if mapped is None:
                break
            role = str(mapped).lstrip("/")
        return role

    def load_number_tree(self, value, visited=None):
        visited = visited or set()
        key = ident(value)
        if key in visited:
            self.issue("error", "parent_tree_cycle", "ParentTree number tree has a cycle.")
            return
        visited.add(key)
        value = obj(value)
        if not isinstance(value, dict):
            self.issue("error", "invalid_parent_tree", "ParentTree node is not a dictionary.")
            return
        nums = obj(value.get("/Nums", []))
        if len(nums) % 2:
            self.issue("error", "invalid_parent_tree", "ParentTree Nums array has an odd length.")
        for i in range(0, len(nums) - 1, 2):
            index = int(nums[i])
            if index in self.parent_tree:
                self.issue("error", "duplicate_parent_tree_key", "ParentTree contains a repeated numeric key.", key=index)
            self.parent_tree[index] = nums[i + 1]
        for child in items(value.get("/Kids")):
            self.load_number_tree(child, visited)

    def content_reference(self, container_ref, mcid, owner_ref, page_ref):
        if container_ref is None:
            self.issue("error", "mcid_missing_page", "Structure content item has no page or stream reference.", mcid=mcid)
            return
        key = (ident(container_ref), mcid)
        if key in self.content_refs:
            self.issue("error", "duplicate_structure_mcid", "More than one structure-tree item references the same MCID.", container=key[0], mcid=mcid)
        self.content_refs[key] = ident(owner_ref)
        self.containers[key[0]] = obj(container_ref)

    def walk(self, reference, parent_ref, inherited_page=None, ancestors=()):
        value = obj(reference)
        if isinstance(value, (int, float)):
            self.content_reference(inherited_page, int(value), parent_ref, inherited_page)
            return
        if not isinstance(value, dict):
            self.issue("error", "invalid_structure_child", "Structure child is neither an element nor a content reference.")
            return
        kind = str(value.get("/Type", ""))
        page_ref = raw_get(value, "/Pg", inherited_page)
        if kind == "/MCR" or "/MCID" in value:
            container_ref = raw_get(value, "/Stm", page_ref)
            self.content_reference(container_ref, int(value["/MCID"]), parent_ref, page_ref)
            return
        if kind == "/OBJR":
            target = raw_get(value, "/Obj")
            if target is None:
                self.issue("error", "objr_missing_object", "OBJR lacks its Obj reference.")
            else:
                self.object_refs.setdefault(ident(target), []).append(ident(parent_ref))
            return
        key = ident(reference)
        if key in self.struct_seen:
            self.issue("error", "duplicate_structure_element", "A structure element occurs multiple times or forms a cycle.", element=key)
            return
        self.struct_seen.add(key)
        role = self.role(value)
        self.roles[role] += 1
        self.elements[key] = {"role": role, "value": value, "ancestors": ancestors}
        if role not in STANDARD_ROLES:
            self.issue("error", "unmapped_structure_role", "A custom role has no standard RoleMap target.", role=role, element=key)
        if role == "Note" and not value.get("/ID"):
            self.issue("error", "note_missing_id", "Note needs an ID for PDF/UA identification.", element=key)
        if ident(raw_get(value, "/P")) != ident(parent_ref):
            self.issue("error", "wrong_structure_parent", "Structure element P does not point to its containing parent.", element=key)
        if re.fullmatch(r"H[1-6]", role):
            self.headings.append({"level": int(role[1:]), "element": key, "page": self.page_numbers.get(ident(page_ref))})
        if role in ("Figure", "Formula"):
            alt = str(value.get("/Alt", "")).strip()
            actual = str(value.get("/ActualText", "")).strip()
            self.figure_descriptions.append({"element": key, "role": role, "page": self.page_numbers.get(ident(page_ref)), "alt": alt, "actual_text": actual})
            if not alt and not actual:
                self.issue("error", "missing_alternative_text", "Figure or Formula has neither Alt nor ActualText.", element=key, role=role)
            elif alt and re.search(r"(?:\.(?:png|jpe?g|gif|svg|pdf)$|^placeholder\b|^TODO\b|^description pending\b)", alt, re.I):
                self.issue("warning", "suspicious_alternative_text", "Alternative text looks like a filename or placeholder.", element=key, alt=alt)
        for child in items(raw_get(value, "/K")):
            self.walk(child, reference, page_ref, ancestors + (key,))

    def owner_for_context(self, context):
        for entry in reversed(context):
            if entry[0] == "mcid":
                owner = self.content_refs.get((entry[1], entry[2]))
                if owner:
                    return owner
            elif entry[0] == "object":
                return entry[1]
        return None

    def covered(self, context):
        if any(entry[0] == "artifact" for entry in context):
            return "artifact"
        return "tagged" if self.owner_for_context(context) else "untagged"

    def scan_stream(self, stream, container, resources, page_number, stats, inherited=(), form_path=()):
        cid = ident(container)
        self.containers[cid] = obj(container)
        scope_seen = set()
        stack = []
        try:
            operations = ContentStream(stream, self.reader).operations
        except Exception as exc:
            self.issue("error", "content_parse_failed", str(exc), page=page_number, container=cid)
            return
        for operands, operator in operations:
            if operator in (b"BMC", b"BDC"):
                tag = str(operands[0]) if operands else ""
                if tag == "/Artifact":
                    stack.append(("artifact",))
                    continue
                properties = operands[1] if operator == b"BDC" and len(operands) > 1 else {}
                if isinstance(properties, str):
                    properties = obj(resources.get("/Properties", {})).get(properties, {})
                properties = obj(properties)
                if isinstance(properties, dict) and "/MCID" in properties:
                    mcid = int(properties["/MCID"])
                    if mcid in scope_seen:
                        self.issue("error", "duplicate_content_mcid", "A content stream defines an MCID more than once.", page=page_number, container=cid, mcid=mcid)
                    scope_seen.add(mcid)
                    self.seen_mcid[cid].add(mcid)
                    if (cid, mcid) not in self.content_refs:
                        self.issue("error", "orphan_content_mcid", "Marked content has no matching structure-tree content reference.", page=page_number, container=cid, mcid=mcid)
                    stack.append(("mcid", cid, mcid))
                else:
                    stack.append(("other",))
                continue
            if operator == b"EMC":
                if stack:
                    stack.pop()
                else:
                    self.issue("error", "unbalanced_marked_content", "EMC appears without a matching BMC or BDC.", page=page_number, container=cid)
                continue
            context = inherited + tuple(stack)
            coverage = self.covered(context)
            if operator in TEXT_OPS:
                # Empty strings and numeric TJ kerning entries do not paint text.
                values = operands[0] if operator == b"TJ" else operands[-1:]
                if any(isinstance(x, (str, bytes)) and len(x) > 0 for x in values):
                    stats[f"text_operations_{coverage}"] += 1
            elif operator in PAINT_OPS:
                stats[f"vector_operations_{coverage}"] += 1
            elif operator == b"INLINE IMAGE":
                stats[f"image_operations_{coverage}"] += 1
                self.check_image_owner(context, page_number, "inline image")
            elif operator == b"Do":
                xobjects = obj(resources.get("/XObject", {}))
                target_ref = raw_get(xobjects, operands[0])
                target = obj(target_ref)
                if not isinstance(target, dict):
                    self.issue("error", "missing_xobject", "Do operator references a missing XObject.", page=page_number, name=str(operands[0]))
                    continue
                object_owners = self.object_refs.get(ident(target_ref), [])
                object_context = context + (("object", object_owners[0]),) if object_owners else context
                if str(target.get("/Subtype")) == "/Image":
                    stats[f"image_operations_{self.covered(object_context)}"] += 1
                    self.check_image_owner(object_context, page_number, str(operands[0]))
                elif str(target.get("/Subtype")) == "/Form":
                    fkey = ident(target_ref)
                    if fkey in form_path:
                        self.issue("error", "recursive_form", "Form XObjects call each other recursively.", page=page_number, object=fkey)
                        continue
                    self.form_calls[fkey] += 1
                    self.stream_labels[fkey] = f"form {fkey} on page {page_number}"
                    self.scan_stream(target, target_ref, obj(target.get("/Resources", resources)), page_number, stats, object_context, form_path + (fkey,))
        if stack:
            self.issue("error", "unbalanced_marked_content", "Content ends with unclosed BMC or BDC sequences.", page=page_number, container=cid, open_sequences=len(stack))

    def check_image_owner(self, context, page_number, name):
        if self.covered(context) != "tagged":
            return
        owner = self.owner_for_context(context)
        record = self.elements.get(owner)
        chain = [owner] + list(reversed(record["ancestors"])) if record else []
        if not any(self.elements.get(x, {}).get("role") in ("Figure", "Formula") for x in chain):
            self.issue("warning", "image_outside_figure", "A tagged image has no Figure or Formula ancestor; review its semantics.", page=page_number, image=name, owner=owner)

    def check_parent_mappings(self):
        used_keys = {}
        for cid, container in self.containers.items():
            mcids = self.seen_mcid.get(cid, set()) | {m for c, m in self.content_refs if c == cid}
            if not mcids:
                continue
            parent_key = container.get("/StructParents")
            if parent_key is None:
                self.issue("error", "missing_structparents", "A stream with structural MCIDs lacks StructParents.", container=cid)
                continue
            parent_key = int(parent_key)
            if parent_key in used_keys and used_keys[parent_key] != cid:
                self.issue("error", "shared_structparents_key", "Different content containers use the same StructParents key.", key=parent_key, containers=[used_keys[parent_key], cid])
            used_keys[parent_key] = cid
            array = obj(self.parent_tree.get(parent_key))
            if not isinstance(array, (list, ArrayObject)):
                self.issue("error", "missing_parent_array", "StructParents has no corresponding ParentTree array.", container=cid, key=parent_key)
                continue
            for mcid in sorted(mcids):
                expected = self.content_refs.get((cid, mcid))
                actual = ident(array[mcid]) if 0 <= mcid < len(array) and not isinstance(obj(array[mcid]), NullObject) else None
                if actual != expected or expected is None:
                    self.issue("error", "parent_tree_mismatch", "ParentTree MCID slot does not match the owning structure element.", container=cid, mcid=mcid, expected=expected, actual=actual)
                if mcid not in self.seen_mcid.get(cid, set()):
                    self.issue("error", "missing_content_mcid", "Structure tree references an MCID absent from the content stream.", container=cid, mcid=mcid)
            for mcid, value in enumerate(array):
                if not isinstance(obj(value), NullObject) and (cid, mcid) not in self.content_refs:
                    self.issue("error", "extra_parent_tree_slot", "ParentTree points to an MCID absent from the structure tree.", container=cid, mcid=mcid)
        for fkey, count in self.form_calls.items():
            if count > 1 and self.seen_mcid.get(fkey):
                self.issue("warning", "reused_tagged_form", "A Form XObject with its own MCIDs is drawn more than once; review the semantic parent and reading order.", object=fkey, invocations=count)

    def check_links(self, page, number, stats):
        for reference in items(raw_get(page, "/Annots")):
            annotation = obj(reference)
            if str(annotation.get("/Subtype")) != "/Link":
                continue
            stats["link_annotations"] += 1
            owners = self.object_refs.get(ident(reference), [])
            if len(owners) != 1:
                self.issue("error", "link_objr_count", "Link annotation must be referenced by exactly one structure OBJR.", page=number, annotation=ident(reference), count=len(owners))
                continue
            owner = owners[0]
            if self.elements.get(owner, {}).get("role") != "Link":
                self.issue("error", "link_wrong_owner", "A Link annotation's OBJR belongs to a non-Link structure element.", page=number, annotation=ident(reference), owner=owner)
            parent_key = annotation.get("/StructParent")
            actual = ident(self.parent_tree.get(int(parent_key))) if parent_key is not None else None
            if actual != owner:
                self.issue("error", "link_parent_tree_mismatch", "Link annotation's StructParent does not map back to its Link element.", page=number, annotation=ident(reference))
            if not str(annotation.get("/Contents", "")).strip():
                self.issue("warning", "link_missing_contents", "Link annotation lacks Contents text; review whether its linked text gives an accessible name.", page=number, annotation=ident(reference))
        if stats["link_annotations"] and str(page.get("/Tabs", "")) != "/S":
            self.issue("warning", "page_tab_order", "Page containing links does not set Tabs to S (structure order).", page=number)

    def check_table_structure(self):
        for key, record in self.elements.items():
            role, node = record["role"], record["value"]
            child_roles = []
            for child in items(raw_get(node, "/K")):
                child_record = self.elements.get(ident(child))
                if child_record:
                    child_roles.append(child_record["role"])
            allowed = {
                "Table": {"TR", "THead", "TBody", "TFoot", "Caption"},
                "TR": {"TH", "TD"},
                "THead": {"TR"}, "TBody": {"TR"}, "TFoot": {"TR"},
            }.get(role)
            if allowed is not None:
                invalid = [child for child in child_roles if child not in allowed]
                if invalid:
                    self.issue("error", "invalid_table_structure", "Table container has incompatible immediate structure children.", element=key, role=role, child_roles=invalid)
                if role == "TR" and not any(child in ("TH", "TD") for child in child_roles):
                    self.issue("error", "empty_table_row", "Table row contains no TH or TD cells.", element=key)
            if role in ("TH", "TD"):
                parent_role = self.elements.get(ident(raw_get(node, "/P")), {}).get("role")
                if parent_role != "TR":
                    self.issue("error", "cell_outside_row", "Table cell is not an immediate child of a TR element.", element=key, role=role, parent_role=parent_role)
            if role == "TH":
                attributes = [obj(a) for a in items(raw_get(node, "/A"))]
                if not any(isinstance(a, dict) and a.get("/Scope") in ("/Row", "/Column", "/Both") for a in attributes):
                    self.issue("warning", "table_header_scope", "TH cell has no explicit row/column Scope; review header associations and any class attributes.", element=key)

    def check_figure_descriptions(self):
        seen = {}
        for figure in self.figure_descriptions:
            alternative = re.sub(r"\s+", " ", figure["alt"]).strip()
            if alternative:
                key = (figure["page"], alternative)
                if key in seen:
                    self.issue("warning", "repeated_figure_alternative", "Multiple figures on the same page repeat the same alternative; check figure/caption association and decorative layers.", page=figure["page"], elements=[seen[key], figure["element"]], alt=alternative)
                seen[key] = figure["element"]
            if figure["role"] == "Figure" and re.match(r"Table\s+\d+[.:]?\s", alternative):
                self.issue("warning", "table_tagged_as_figure", "Figure alternative begins with a table caption; verify that the actual table data and header relationships are available to assistive technology.", page=figure["page"], element=figure["element"])

    def validate(self):
        marked = obj(self.catalog.get("/MarkInfo", {})).get("/Marked", False)
        if not bool(getattr(marked, "value", marked)):
            self.issue("error", "not_marked", "Catalog MarkInfo/Marked is not true.")
        if not str(self.catalog.get("/Lang", "")).strip():
            self.issue("error", "missing_document_language", "Catalog lacks its document language.")
        title = str((self.reader.metadata or {}).get("/Title", "")).strip()
        if not title:
            self.issue("warning", "missing_document_title", "Document information dictionary lacks Title.")
        root_ref = raw_get(self.catalog, "/StructTreeRoot")
        root = obj(root_ref)
        self.role_map = obj(root.get("/RoleMap", {})) if isinstance(root, dict) else {}
        if not isinstance(root, dict):
            self.issue("error", "missing_structure_tree", "Catalog lacks a StructTreeRoot dictionary.")
        else:
            if root.get("/ParentTree") is None:
                self.issue("error", "missing_parent_tree", "Structure tree has no ParentTree.")
            else:
                self.load_number_tree(raw_get(root, "/ParentTree"))
            for child in items(raw_get(root, "/K")):
                self.walk(child, root_ref)
            next_key = root.get("/ParentTreeNextKey")
            if next_key is not None and self.parent_tree and int(next_key) <= max(self.parent_tree):
                self.issue("error", "parent_tree_next_key", "ParentTreeNextKey is not larger than all existing keys.")
        if not self.elements:
            self.issue("error", "empty_structure_tree", "No semantic structure elements were found.")
        if not any(role in self.roles for role in ("H", "H1", "H2", "H3", "H4", "H5", "H6")):
            self.issue("warning", "no_headings", "No heading tags were found; review whether the paper's title and sections are tagged correctly.")
        previous = 0
        for heading in self.headings:
            if heading["level"] > previous + 1:
                self.issue("warning", "heading_level_jump", "Heading level skips a level in structure order.", previous=previous, **heading)
            previous = heading["level"]
        for number, page in enumerate(self.reader.pages, 1):
            stats = collections.Counter()
            if page.get_contents() is not None:
                self.scan_stream(page.get_contents(), page, obj(page.get("/Resources", {})), number, stats)
            self.check_links(page, number, stats)
            if stats["text_operations_untagged"]:
                self.issue("error", "untagged_text", "Text-show operations are neither semantic content nor artifacts.", page=number, operations=stats["text_operations_untagged"])
            if stats["image_operations_untagged"]:
                self.issue("error", "untagged_images", "Image operations are neither semantic content nor artifacts.", page=number, operations=stats["image_operations_untagged"])
            if stats["vector_operations_untagged"]:
                self.issue("warning", "untagged_vector_graphics", "Vector paint operations are untagged; determine whether meaningful graphics or decorative artifacts.", page=number, operations=stats["vector_operations_untagged"])
            if not stats["text_operations_tagged"] and (stats["text_operations_untagged"] or stats["text_operations_artifact"]):
                self.issue("warning", "page_has_no_semantic_text", "Page has no semantic text; verify that its text consists only of page numbers, running headers, or other artifacts. Uncovered text remains a separate error.", page=number, artifact_operations=stats["text_operations_artifact"], uncovered_operations=stats["text_operations_untagged"])
            self.pages.append({"page": number, **dict(stats)})
        self.check_parent_mappings()
        self.check_table_structure()
        self.check_figure_descriptions()
        return {
            "page_count": len(self.reader.pages), "language": str(self.catalog.get("/Lang", "")),
            "title": title, "structure_elements": len(self.elements), "roles": dict(self.roles),
            "structure_content_references": len(self.content_refs), "parent_tree_entries": len(self.parent_tree),
            "form_xobjects_visited": len(self.form_calls), "pages": self.pages,
            "headings": self.headings, "figure_descriptions": self.figure_descriptions,
            "issue_counts": dict(self.issue_counts), "issues": self.issues,
            "checks_passed": not any(k.startswith("error:") for k in self.issue_counts),
            "manual_review_required": ["Logical reading order, especially columns and sidebars", "Heading and paragraph boundaries", "Meaningful alternatives for figures and formulas", "Correct table cell/header relationships", "Appropriate artifact classification", "Screen-reader behavior and link navigation"],
        }
