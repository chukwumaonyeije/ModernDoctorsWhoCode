import fs from "node:fs";
import path from "node:path";

const SITE_ORIGIN = "https://www.doctorswhocode.blog";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const PUBLIC_DIR = path.resolve("public");

function findKeyFile() {
  const candidates = fs
    .readdirSync(PUBLIC_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(name));

  if (candidates.length !== 1) {
    throw new Error(
      `Expected exactly one IndexNow key file in public/, found ${candidates.length}.`
    );
  }

  const keyFile = candidates[0];
  const key = keyFile.replace(/\.txt$/, "");
  const contents = fs.readFileSync(path.join(PUBLIC_DIR, keyFile), "utf8").trim();

  if (contents !== key) {
    throw new Error(`Key file ${keyFile} must contain exactly the same key as its filename.`);
  }

  return { key, keyFile };
}

function usage() {
  console.error(
    [
      "Usage:",
      "  npm run indexnow:submit -- <url1> <url2> ...",
      "",
      "Example:",
      "  npm run indexnow:submit -- https://www.doctorswhocode.blog/ https://www.doctorswhocode.blog/about",
    ].join("\n")
  );
}

function normalizeUrls(rawUrls) {
  if (rawUrls.length === 0) {
    usage();
    process.exit(1);
  }

  const normalized = [...new Set(rawUrls)].map((value) => new URL(value).toString());

  for (const url of normalized) {
    if (!url.startsWith(`${SITE_ORIGIN}/`) && url !== `${SITE_ORIGIN}/`) {
      throw new Error(`URL must belong to ${SITE_ORIGIN}: ${url}`);
    }
  }

  return normalized;
}

async function submit() {
  const { key, keyFile } = findKeyFile();
  const urlList = normalizeUrls(process.argv.slice(2));

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      host: new URL(SITE_ORIGIN).host,
      key,
      keyLocation: `${SITE_ORIGIN}/${keyFile}`,
      urlList,
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`IndexNow request failed (${response.status}): ${body || "No response body"}`);
  }

  console.log(`Submitted ${urlList.length} URL(s) to IndexNow.`);
  console.log(`Status: ${response.status}`);
  if (body) {
    console.log(body);
  }
}

submit().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
