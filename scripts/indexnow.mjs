// Usage: node scripts/indexnow.mjs [url ...]   (no args = submit every URL in the live sitemap)
const KEY = '91649e28500a4d2e8933a99c513bb7b7'
const SITE = process.env.SITE_URL || 'https://supertechint.com.kw'
const host = new URL(SITE).host

let urls = process.argv.slice(2)
if (!urls.length) {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text()
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}
for (let i = 0; i < urls.length; i += 10000) {
  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls.slice(i, i + 10000) }),
  })
  console.log(`batch ${i / 10000 + 1}: ${res.status} ${res.statusText} (${Math.min(10000, urls.length - i)} URLs)`)
}
