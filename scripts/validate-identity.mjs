import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const personId = 'https://www.doctorswhocode.blog/chukwuma-onyeije#person';
const requiredSameAs = [
  'https://www.doctorswhocode.blog/',
  'https://chukwumaonyeije.com/',
  'https://openmfm.org/',
  'https://chukwumatheology.substack.com/',
  'https://x.com/chukwumaonyeije',
  'https://bsky.app/profile/chukwumaonyeije.bsky.social',
  'https://providers.emoryhealthcare.org/provider/chukwuma-onyeije/778536',
  'https://www.care.piedmont.org/provider/Chukwuma+Ijeoma+Onyeije/390542',
  'https://www.doximity.com/pub/chukwuma-onyeije-md',
];

const read = (relativePath) => readFile(resolve(root, relativePath), 'utf8');
const profileHtml = await read('dist/chukwuma-onyeije/index.html');
const verifiedHtml = await read('dist/verified/index.html');
const sitemap = await read('dist/sitemap-0.xml');
const jsonLdBlocks = [...profileHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
const graph = jsonLdBlocks.flatMap((block) => block['@graph'] ?? [block]);
const person = graph.find((entry) => entry['@type'] === 'Person' && entry['@id'] === personId);

if (!person) throw new Error(`Missing canonical Person schema: ${personId}`);
for (const url of requiredSameAs) {
  if (!person.sameAs?.includes(url)) throw new Error(`Missing Person.sameAs URL: ${url}`);
}
if (!verifiedHtml.includes('Verified Accounts and Official Projects')) throw new Error('Missing /verified page content');
for (const path of ['/chukwuma-onyeije/', '/verified/']) {
  if (!sitemap.includes(`https://www.doctorswhocode.blog${path}`)) throw new Error(`Sitemap does not include ${path}`);
}

console.log('Identity schema, verified route, and sitemap checks passed.');
