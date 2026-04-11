import puppeteer from "puppeteer";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

const CSV_PATH = "/Users/kinngdann/Desktop/Leads/total.csv";
const PICTURES_DIR = "/Users/kinngdann/Desktop/Leads/pictures";
const OUTPUT_DIR = "/Users/kinngdann/Desktop/posters";
const PUBLIC_PICS_DIR = path.join(process.cwd(), "public/poster-pics");

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_PICS_DIR, { recursive: true });

  const picFiles = fs.readdirSync(PICTURES_DIR);
  for (const f of picFiles) {
    fs.copyFileSync(path.join(PICTURES_DIR, f), path.join(PUBLIC_PICS_DIR, f));
  }

  const csv = fs.readFileSync(CSV_PATH, "utf-8").replace(/^\uFEFF/, "");
  const records: Record<string, string>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const demo = records.slice(0, 3);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 2 });

  for (const row of demo) {
    const id = String(row.ID).padStart(3, "0");
    const parts = row.Child.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");
    const m = row.Age.trim().match(/^(\d+)\s*(years?|months?)/i);
    const age = m ? m[1] : row.Age;
    const ageUnit = m ? (m[2].toLowerCase().startsWith("y") ? "yrs" : "mths") : "";
    const picFile = picFiles.find((f) => path.parse(f).name === id);
    const gender = (row.Gender ?? "").toLowerCase().startsWith("m") ? "male" : "female";
    const params = new URLSearchParams({
      id, firstName, lastName, age, ageUnit, gender,
      ...(picFile ? { pic: picFile } : {}),
    });

    console.log(`Generating: ${row.Child} (ID: ${id})`);

    await page.goto(`http://localhost:3009/campaign-poster?${params}`, {
      waitUntil: "networkidle0",
      timeout: 15000,
    });
    await page.evaluate(() => document.fonts.ready);

    const poster = await page.$("#poster");
    if (!poster) throw new Error(`No #poster element for ID ${id} — is the dev server running?`);

    const out = path.join(OUTPUT_DIR, `${id}.jpg`);
    await poster.screenshot({ path: out, type: "jpeg", quality: 95 });
    console.log(`  ✅ Saved: ${out}`);
  }

  await browser.close();
  fs.rmSync(PUBLIC_PICS_DIR, { recursive: true, force: true });
  console.log("\nDone.");
}

main().catch((err) => { console.error(err); process.exit(1); });
