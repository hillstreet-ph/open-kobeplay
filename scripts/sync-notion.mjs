import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const token = process.env.NOTION_API_TOKEN;
if (!token) throw new Error("NOTION_API_TOKEN is required");

const sourceMap = await readFile("docs/NOTION-SOURCE-MAP.md", "utf8");
const ids = [...sourceMap.matchAll(/`([0-9a-f]{32})`/gi)].map((match) => match[1]);
if (!ids.length) throw new Error("No immutable Notion IDs found in docs/NOTION-SOURCE-MAP.md");

const headers = {
  Authorization: `Bearer ${token}`,
  "Notion-Version": "2022-06-28",
};

function safeTitle(object) {
  if (object.object === "page") {
    const property = Object.values(object.properties ?? {}).find((value) => value?.type === "title");
    return property?.title?.map((part) => part.plain_text).join("") || "Untitled page";
  }
  return object.title?.map((part) => part.plain_text).join("") || "Untitled database";
}

async function fetchObject(id) {
  for (const endpoint of [`pages/${id}`, `databases/${id}`]) {
    const response = await fetch(`https://api.notion.com/v1/${endpoint}`, { headers });
    if (response.ok) {
      const object = await response.json();
      return {
        id: object.id.replaceAll("-", ""),
        object: object.object,
        title: safeTitle(object),
        url: object.url,
        archived: Boolean(object.archived),
        last_edited_time: object.last_edited_time,
      };
    }
    if (response.status !== 404) {
      throw new Error(`Notion ${endpoint} returned ${response.status}`);
    }
  }
  throw new Error(`Notion object ${id} is not accessible`);
}

const resources = [];
for (const id of [...new Set(ids)].sort()) resources.push(await fetchObject(id));

const snapshot = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  source: "Notion metadata API",
  content_exported: false,
  resource_count: resources.length,
  resources,
};
const canonical = JSON.stringify({ ...snapshot, generated_at: null });
snapshot.content_hash = createHash("sha256").update(canonical).digest("hex");

await mkdir("generated/notion", { recursive: true });
await writeFile("generated/notion/manifest.json", `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${resources.length} redacted Notion metadata records`);
