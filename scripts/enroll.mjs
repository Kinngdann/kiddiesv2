#!/usr/bin/env node
/**
 * Bulk contestant enroller
 *
 * Usage:
 *   node scripts/enroll.mjs <path-to-csv> [photos-dir]
 *
 * - photos-dir defaults to the same directory as the CSV
 * - Photo files must be named {ID}.jpeg (e.g. 001.jpeg)
 * - API target can be overridden with API_URL env var
 *
 * CSV columns expected (in any order):
 *   ID, WhatsApp, Child, Age, Parent, Phone, Gender (optional — male/female)
 */

import fs from "fs";
import path from "path";

const API_URL = process.env.API_URL?.replace(/\/$/, "") || "http://localhost:3009";

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCSV(content) {
  const lines = content.trim().split(/\r?\n/);
  const headers = splitLine(lines[0]).map((h) => h.trim());
  return lines.slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const fields = splitLine(line);
      return Object.fromEntries(headers.map((h, i) => [h, (fields[i] ?? "").trim()]));
    });
}

function splitLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === "," && !inQuotes) { fields.push(cur); cur = ""; continue; }
    cur += ch;
  }
  fields.push(cur);
  return fields;
}



// ── Find photo file (try common extensions) ───────────────────────────────────

const PHOTO_EXTS = [".jpeg", ".jpg", ".png", ".webp"];

function findPhoto(dir, id) {
  for (const ext of PHOTO_EXTS) {
    const p = path.join(dir, id + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

// ── Register one contestant ───────────────────────────────────────────────────

async function enroll(row, photosDir) {
  const { ID, Child, Age, Parent, Phone, WhatsApp, Gender } = row;

  const nameParts = Child.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName  = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName",  lastName);
  formData.append("age",       Age);
  formData.append("parent",    Parent);
  formData.append("phone",     Phone);
  formData.append("whatsapp",  WhatsApp);
  formData.append("gender",    Gender ?? "");

  const photoPath = findPhoto(photosDir, ID);
  if (photoPath) {
    const bytes = fs.readFileSync(photoPath);
    const ext   = path.extname(photoPath).slice(1);
    const blob  = new Blob([bytes], { type: `image/${ext === "jpg" ? "jpeg" : ext}` });
    formData.append("picture", blob, path.basename(photoPath));
  } else {
    console.warn(`  ⚠  No photo found for ${ID} — enrolling without picture`);
  }

  const res  = await fetch(`${API_URL}/api/contestant`, { method: "POST", body: formData });
  const json = await res.json();

  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json; // { name, id }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: node scripts/enroll.mjs <path-to-csv> [photos-dir]");
    process.exit(1);
  }

  const photosDir = process.argv[3] ?? path.dirname(path.resolve(csvPath));
  const rows      = parseCSV(fs.readFileSync(csvPath, "utf8"));

  console.log(`\nEnrolling ${rows.length} contestant(s) → ${API_URL}\n`);

  let passed = 0;
  let failed = 0;

  for (const row of rows) {
    const label = `[${row.ID}] ${row.Child}`;
    try {
      const result = await enroll(row, photosDir);
      console.log(`  ✓  ${label}  →  Contestant ID: ${result.id}`);
      passed++;
    } catch (err) {
      console.error(`  ✗  ${label}  →  ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone — ${passed} enrolled, ${failed} failed.\n`);
}

main().catch((err) => { console.error(err); process.exit(1); });
