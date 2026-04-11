import puppeteer from "puppeteer";
import * as fs from "fs";

const OUTPUT = "/Users/kinngdann/Desktop/posters/stage-one-banner.jpg";

async function main() {
  fs.mkdirSync("/Users/kinngdann/Desktop/posters", { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 800, deviceScaleFactor: 2 });
  await page.goto("http://localhost:3009/stage-banner", { waitUntil: "networkidle0", timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);

  const banner = await page.$("#stage-banner");
  if (!banner) throw new Error("No #stage-banner element found — is the dev server running?");

  await banner.screenshot({ path: OUTPUT, type: "jpeg", quality: 95 });
  console.log(`✅ Saved to: ${OUTPUT}`);

  await browser.close();
}

main().catch((err) => { console.error(err); process.exit(1); });
