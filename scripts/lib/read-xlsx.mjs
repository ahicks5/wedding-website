// ============================================
// Dependency-free .xlsx reader
// ============================================
// Reads a single sheet out of an .xlsx file with zero npm dependencies, using
// Node's built-in zlib to inflate the ZIP entries and light regex parsing of
// the (very regular) OOXML produced for this guest-list workbook.
//
// Scope is intentionally narrow: it handles shared strings, inline strings,
// plain numbers/booleans, blank-cell gaps, and common XML entities — which is
// everything Wedding_Guests_RSVP_Clean.xlsx contains. If a future Excel re-save
// introduces something exotic and parsing breaks, swap this module for SheetJS
// (`npm i xlsx`) — readRowObjects() is the only surface the importer depends on.
// ============================================

import { readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";

const SPREADSHEET_NS_MAIN = "main";

// --- ZIP container ---------------------------------------------------------

// Parse a .zip (the .xlsx container) into a map of { entryName -> Buffer }.
// We read the End Of Central Directory record, then each central-directory
// entry, so compressed/uncompressed sizes are always accurate (local headers
// can defer sizes to a data descriptor, which we'd otherwise have to handle).
function unzip(buf) {
  const EOCD_SIG = 0x06054b50;
  const CEN_SIG = 0x02014b50;

  // Find the EOCD by scanning backwards (it's near the end, after any comment).
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("Not a valid .xlsx (no ZIP end record found)");

  const total = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);

  const files = {};
  for (let n = 0; n < total; n++) {
    if (buf.readUInt32LE(off) !== CEN_SIG) {
      throw new Error("Corrupt ZIP central directory");
    }
    const method = buf.readUInt16LE(off + 10);
    const compSize = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const localOff = buf.readUInt32LE(off + 42);
    const name = buf.toString("utf8", off + 46, off + 46 + nameLen);

    // Locate the data: skip the local header (30 bytes) + its name/extra fields.
    const lhNameLen = buf.readUInt16LE(localOff + 26);
    const lhExtraLen = buf.readUInt16LE(localOff + 28);
    const dataStart = localOff + 30 + lhNameLen + lhExtraLen;
    const raw = buf.subarray(dataStart, dataStart + compSize);

    files[name] = method === 0 ? Buffer.from(raw) : inflateRawSync(raw);
    off += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

// --- XML helpers -----------------------------------------------------------

function decodeEntities(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, "&"); // last, so we don't double-decode
}

// Collect the concatenated <t> text inside an <si> or <is> element.
function textOf(xmlChunk) {
  let out = "";
  const re = /<t[^>]*>([\s\S]*?)<\/t>|<t[^>]*\/>/g;
  let m;
  while ((m = re.exec(xmlChunk))) out += m[1] ? decodeEntities(m[1]) : "";
  return out;
}

function sharedStrings(files) {
  const xml = files["xl/sharedStrings.xml"];
  if (!xml) return [];
  const text = xml.toString("utf8");
  const out = [];
  const re = /<si[^>]*>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = re.exec(text))) out.push(textOf(m[1]));
  return out;
}

// Map sheet display name -> worksheet XML path, via workbook.xml + its rels.
function sheetPathByName(files) {
  const wb = files["xl/workbook.xml"].toString("utf8");
  const rels = files["xl/_rels/workbook.xml.rels"].toString("utf8");

  // Parse each <Relationship> independently of attribute order (writers differ:
  // openpyxl emits Target before Id, Excel emits Id first).
  const relMap = {};
  let m;
  const relRe = /<Relationship\b[^>]*\/?>/g;
  while ((m = relRe.exec(rels))) {
    const tag = m[0];
    const id = /Id="([^"]+)"/.exec(tag)?.[1];
    const target = /Target="([^"]+)"/.exec(tag)?.[1];
    if (id && target) relMap[id] = target;
  }

  const byName = {};
  const sheetRe = /<sheet[^>]*\/?>/g;
  while ((m = sheetRe.exec(wb))) {
    const tag = m[0];
    const name = /name="([^"]*)"/.exec(tag)?.[1];
    const rid = /r:id="([^"]*)"/.exec(tag)?.[1];
    if (name && rid && relMap[rid]) {
      const target = relMap[rid].replace(/^\//, "").replace(/^xl\//, "");
      byName[name] = "xl/" + target;
    }
  }
  return byName;
}

// Convert a cell reference's column letters (e.g. "AB12") to a 0-based index.
function colIndex(ref) {
  const letters = ref.replace(/[0-9]/g, "");
  let n = 0;
  for (const ch of letters) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

// --- Public API ------------------------------------------------------------

// Read a worksheet into an array of cell-string rows (blank cells -> "").
export function readSheetMatrix(path, sheetName) {
  const files = unzip(readFileSync(path));
  const ss = sharedStrings(files);
  const paths = sheetPathByName(files);
  const sheetPath = paths[sheetName];
  if (!sheetPath || !files[sheetPath]) {
    throw new Error(
      `Sheet "${sheetName}" not found. Available: ${Object.keys(paths).join(", ")}`
    );
  }

  const xml = files[sheetPath].toString("utf8");
  const rows = [];
  const rowRe = /<row[^>]*>([\s\S]*?)<\/row>/g;
  let rm;
  while ((rm = rowRe.exec(xml))) {
    const cells = {};
    let maxCol = -1;
    const cellRe = /<c\s+([^>]*?)(\/>|>([\s\S]*?)<\/c>)/g;
    let cm;
    while ((cm = cellRe.exec(rm[1]))) {
      const attrs = cm[1];
      const inner = cm[3] ?? "";
      const ref = /r="([^"]+)"/.exec(attrs)?.[1];
      const type = /t="([^"]+)"/.exec(attrs)?.[1];
      const idx = ref ? colIndex(ref) : maxCol + 1;

      let value = "";
      if (type === "s") {
        const v = /<v>([\s\S]*?)<\/v>/.exec(inner);
        if (v) value = ss[Number(v[1])] ?? "";
      } else if (type === "inlineStr") {
        value = textOf(inner);
      } else {
        const v = /<v>([\s\S]*?)<\/v>/.exec(inner);
        if (v) value = decodeEntities(v[1]);
      }

      cells[idx] = value;
      if (idx > maxCol) maxCol = idx;
    }
    const row = [];
    for (let i = 0; i <= maxCol; i++) row.push(cells[i] ?? "");
    rows.push(row);
  }
  return rows;
}

// Read a worksheet as an array of objects keyed by the header row (row 1).
// Trailing blank cells are padded so every object has every header key.
export function readRowObjects(path, sheetName) {
  const matrix = readSheetMatrix(path, sheetName);
  if (matrix.length === 0) return { headers: [], rows: [] };
  const headers = matrix[0].map((h) => String(h).trim());
  const rows = matrix.slice(1).map((cells) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (cells[i] ?? "").toString().trim();
    });
    return obj;
  });
  return { headers, rows };
}
