/**
 * Generates a JPEG campaign poster for every contestant in the CSV.
 *
 * Prerequisites:
 *   - Dev server running on http://localhost:3009  (pnpm dev)
 *
 * Usage:
 *   pnpm tsx scripts/generate-posters.ts
 */

import puppeteer from "puppeteer";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

const CSV_PATH = "/Users/kinngdann/Desktop/Leads/total.csv";
const PICTURES_DIR = "/Users/kinngdann/Desktop/Leads/pictures";
const OUTPUT_DIR = "/Users/kinngdann/Desktop/posters";
const PUBLIC_PICS_DIR = path.join(process.cwd(), "public/poster-pics");
const BASE_URL = "http://localhost:3009";

// ── helpers ──────────────────────────────────────────────────────────────────

function parseAge(raw: string): { age: string; ageUnit: string } {
  const m = raw.trim().match(/^(\d+)\s*(years?|months?)/i);
  if (!m) return { age: raw.trim(), ageUnit: "" };
  const unit = m[2].toLowerCase().startsWith("y") ? "yrs" : "mths";
  return { age: m[1], ageUnit: unit };
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Create output dirs
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_PICS_DIR, { recursive: true });

  // 2. Copy contestant pictures to public so Next.js can serve them
  const picFiles = fs.readdirSync(PICTURES_DIR);
  for (const f of picFiles) {
    fs.copyFileSync(
      path.join(PICTURES_DIR, f),
      path.join(PUBLIC_PICS_DIR, f)
    );
  }
  console.log(`Copied ${picFiles.length} pictures to public/poster-pics\n`);

  // 3. Parse CSV (handles BOM from Excel exports)
  const csvContent = fs.readFileSync(CSV_PATH, "utf-8").replace(/^\uFEFF/, "");
  const records: Record<string, string>[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // 4. Launch Puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 2 });

  let ok = 0, skipped = 0;

  for (const row of records) {
    const id = String(row.ID ?? "").padStart(3, "0");
    const { firstName, lastName } = splitName(row.Child ?? "");
    const { age, ageUnit } = parseAge(row.Age ?? "");

    // Find matching picture file (e.g. 001.jpeg)
    const picFile = picFiles.find((f) => path.parse(f).name === id);

    const gender = (row.Gender ?? "").toLowerCase().startsWith("m") ? "male" : "female";
    const params = new URLSearchParams({
      id,
      firstName,
      lastName,
      age,
      ageUnit,
      gender,
      ...(picFile ? { pic: picFile } : {}),
    });

    try {
      await page.goto(`${BASE_URL}/campaign-poster?${params}`, {
        waitUntil: "networkidle0",
        timeout: 15000,
      });
      await page.evaluate(() => document.fonts.ready);

      const poster = await page.$("#poster");
      if (!poster) {
        console.warn(`  ⚠ No #poster element found for ID ${id} — skipping`);
        skipped++;
        continue;
      }

      const outputPath = path.join(OUTPUT_DIR, `${id}.jpg`);
      await poster.screenshot({ path: outputPath, type: "jpeg", quality: 95 });

      console.log(`  ✓ ${id}  ${firstName} ${lastName}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${id} failed:`, err);
      skipped++;
    }
  }

  await browser.close();

  // 5. Clean up temporary public pictures
  fs.rmSync(PUBLIC_PICS_DIR, { recursive: true, force: true });

  console.log(`\n✅ Done — ${ok} posters saved to ${OUTPUT_DIR}`);
  if (skipped) console.log(`   ${skipped} skipped (check warnings above)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
