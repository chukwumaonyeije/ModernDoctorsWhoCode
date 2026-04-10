import fs from "node:fs";
import path from "node:path";

import { SITE_ORIGIN, submitUrls } from "./submit-indexnow.mjs";

const RSS_PATH = path.resolve("dist", "rss.xml");

function extractLatestPostUrl() {
  if (!fs.existsSync(RSS_PATH)) {
    throw new Error("dist/rss.xml was not found. Run `npm run build` before `npm run indexnow:latest`.");
  }

  const xml = fs.readFileSync(RSS_PATH, "utf8");
  const linkMatch = xml.match(/<item>[\s\S]*?<link>(.*?)<\/link>/i);

  if (!linkMatch?.[1]) {
    throw new Error("Could not find a post URL in dist/rss.xml.");
  }

  return linkMatch[1].trim();
}

async function main() {
  const latestPostUrl = extractLatestPostUrl();
  const urls = [`${SITE_ORIGIN}/`, `${SITE_ORIGIN}/blog/`, latestPostUrl];

  console.log(`Latest published post: ${latestPostUrl}`);
  await submitUrls(urls);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
