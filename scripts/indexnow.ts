/**
 * Tells IndexNow search engines (Bing, which powers Microsoft Copilot, and others) about every URL in the sitemap.
 * Run after a deploy that adds or changes pages:  npm run indexnow
 * The key is public by design: IndexNow verifies ownership by fetching public/<key>.txt from the site.
 */
const KEY = "1571909c0a53e5f01478288cf9372a22";
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://apollogroupr.tv").replace(/\/$/, "");

async function main() {
  const xml = await (await fetch(`${site}/sitemap.xml`)).text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(site).host, key: KEY, keyLocation: `${site}/${KEY}.txt`, urlList }),
  });
  console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${res.status}`);
  if (res.status >= 400) process.exit(1);
}

main();
