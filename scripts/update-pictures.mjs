#!/usr/bin/env node
/**
 * Bulk contestant picture updater
 *
 * Usage:
 *   node scripts/update-pictures.mjs <photos-dir> [csv-path]
 *
 * Mode A — directory scan (no CSV):
 *   Photo files must be named {ID}.jpeg/jpg/png/webp (e.g. 001.jpeg).
 *   Every photo found in <photos-dir> is uploaded for the matching contestant ID.
 *
 * Mode B — CSV mapping:
 *   CSV must have columns: ID, Photo  (Photo is the filename inside photos-dir)
 *
 * API target can be overridden with API_URL env var.
 *   e.g.  API_URL=https://kidscrown.net node scripts/update-pictures.mjs ./photos
 */

import fs from "fs";
import path from "path";

// const API_URL = process.env.API_URL?.replace(/\/$/, "") || "http://localhost:3009";
const API_URL = "https://leadritehub.com" || "http://localhost:3009";

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCSV(content) {
  const lines = content.trim().split(/\r?\n/);
  const headers = splitLine(lines[0]).map((h) => h.trim());
  return lines
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const fields = splitLine(line);
      return Object.fromEntries(
        headers.map((h, i) => [h, (fields[i] ?? "").trim()]),
      );
    });
}

function splitLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      fields.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  fields.push(cur);
  return fields;
}

// ── Discover photos in a directory ───────────────────────────────────────────

const PHOTO_EXTS = new Set([".jpeg", ".jpg", ".png", ".webp"]);

function scanPhotos(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => PHOTO_EXTS.has(path.extname(f).toLowerCase()))
    .map((f) => ({ id: path.parse(f).name, file: path.join(dir, f) }));
}

// ── Update one contestant's picture ──────────────────────────────────────────

async function updatePicture(contestantId, photoPath) {
  const bytes = fs.readFileSync(photoPath);
  const ext = path.extname(photoPath).slice(1).toLowerCase();
  const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
  const blob = new Blob([bytes], { type: mime });

  const formData = new FormData();
  formData.append("contestantId", contestantId);
  formData.append("picture", blob, path.basename(photoPath));

  const res = await fetch(`${API_URL}/api/contestant`, {
    method: "PUT",
    body: formData,
  });
  const json = await res.json();

  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const photosDir = process.argv[2];
  if (!photosDir) {
    console.error(
      "Usage: node scripts/update-pictures.mjs <photos-dir> [csv-path]\n" +
        "  photos-dir  directory containing photo files\n" +
        "  csv-path    optional CSV with columns: ID, Photo",
    );
    process.exit(1);
  }

  if (!fs.existsSync(photosDir)) {
    console.error(`Photos directory not found: ${photosDir}`);
    process.exit(1);
  }

  const csvPath = process.argv[3];

  let entries; // [{ id, file }]

  if (csvPath) {
    // Mode B: CSV mapping
    const rows = parseCSV(fs.readFileSync(csvPath, "utf8"));
    entries = rows.map((row) => ({
      id: row.ID?.trim(),
      file: path.join(photosDir, row.Photo?.trim()),
    }));
  } else {
    // Mode A: directory scan — filenames are contestant IDs
    entries = scanPhotos(photosDir);
  }

  if (entries.length === 0) {
    console.error("No photos to process.");
    process.exit(1);
  }

  console.log(`\nUpdating ${entries.length} picture(s) → ${API_URL}\n`);

  let passed = 0;
  let failed = 0;

  for (const { id, file } of entries) {
    const label = `[${id}]  ${path.basename(file)}`;
    if (!fs.existsSync(file)) {
      console.error(`  ✗  ${label}  →  file not found`);
      failed++;
      continue;
    }
    try {
      await updatePicture(id, file);
      console.log(`  ✓  ${label}`);
      passed++;
    } catch (err) {
      console.error(`  ✗  ${label}  →  ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone — ${passed} updated, ${failed} failed.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
