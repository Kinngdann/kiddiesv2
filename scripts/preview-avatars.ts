import puppeteer from "puppeteer";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import * as path from "path";

const CSV_PATH = "/Users/kinngdann/Desktop/Leads/total.csv";
const PICTURES_DIR = "/Users/kinngdann/Desktop/Leads/pictures";
const OUTPUT_DIR = "/Users/kinngdann/Desktop/posters/avatar-preview";
const PUBLIC_PICS_DIR = path.join(process.cwd(), "public/poster-pics");

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_PICS_DIR, { recursive: true });

  const picFiles = fs.readdirSync(PICTURES_DIR);
  for (const f of picFiles) {
    fs.copyFileSync(path.join(PICTURES_DIR, f), path.join(PUBLIC_PICS_DIR, f));
  }

  const csv = fs.readFileSync(CSV_PATH, "utf-8").replace(/^\uFEFF/, "");
  const records: Record<string, string>[] = parse(csv, { columns: true, skip_empty_lines: true, trim: true });

  // Pick first contestant without a picture
  const row = records.find((r) => {
    const id = String(r.ID).padStart(3, "0");
    return !picFiles.some((f) => path.parse(f).name === id);
  })!;

  const id = String(row.ID).padStart(3, "0");
  const parts = row.Child.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  const m = row.Age.trim().match(/^(\d+)\s*(years?|months?)/i);
  const age = m ? m[1] : row.Age;
  const ageUnit = m ? (m[2].toLowerCase().startsWith("y") ? "yrs" : "mths") : "";
  const gender = row.Gender.toLowerCase().startsWith("m") ? "male" : "female";

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 2 });

  for (const avatarStyle of ["initials", "silhouette", "mystery"] as const) {
    const params = new URLSearchParams({ id, firstName, lastName, age, ageUnit, gender, avatarStyle });
    await page.goto(`http://localhost:3009/campaign-poster?${params}`, { waitUntil: "networkidle0", timeout: 15000 });

    const poster = await page.$("#poster");
    if (!poster) throw new Error("No #poster element found");

    const out = path.join(OUTPUT_DIR, `${avatarStyle}.jpg`);
    await poster.screenshot({ path: out, type: "jpeg", quality: 95 });
    console.log(`✅ ${avatarStyle} → ${out}`);
  }

  await browser.close();
  fs.rmSync(PUBLIC_PICS_DIR, { recursive: true, force: true });
  console.log("\nOpen the avatar-preview folder on your Desktop to compare.");
}

main().catch((err) => { console.error(err); process.exit(1); });
