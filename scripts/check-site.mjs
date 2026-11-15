#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requiredPages = [
  'index.html',
  'en/index.html',
  'en/terms/index.html',
  'en/privacy/index.html',
  'en/delete-account/index.html',
];

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(target) : [target];
  }));
  return nested.flat();
}

function localTarget(href) {
  const pathname = href.split(/[?#]/, 1)[0];
  if (!pathname.startsWith('/')) return undefined;
  const decoded = decodeURIComponent(pathname);
  const relative = decoded.replace(/^\/+/, '');
  return path.join(root, relative, path.extname(relative) ? '' : 'index.html');
}

const allFiles = await filesBelow(root);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));
assert.deepEqual(
  requiredPages.map((file) => path.join(root, file)).sort(),
  htmlFiles.sort(),
  'Unexpected or missing HTML pages',
);

assert.equal((await readFile(path.join(root, 'CNAME'), 'utf8')).trim(), 'legal.dailance.com');
assert(allFiles.includes(path.join(root, '.nojekyll')), '.nojekyll is missing');
assert(allFiles.includes(path.join(root, 'robots.txt')), 'robots.txt is missing');
assert(allFiles.includes(path.join(root, 'sitemap.xml')), 'sitemap.xml is missing');

for (const file of htmlFiles) {
  const relative = path.relative(root, file);
  const html = await readFile(file, 'utf8');
  assert.match(html, /<!doctype html>/i, `${relative}: missing doctype`);
  assert.match(html, /<html lang="en">/, `${relative}: missing language`);
  assert.match(html, /<meta name="viewport"/, `${relative}: missing viewport`);
  assert.match(html, /<meta name="description"/, `${relative}: missing description`);
  assert.match(html, /<title>[^<]+<\/title>/, `${relative}: missing title`);
  assert.match(html, /<link rel="canonical" href="https:\/\/legal\.dailance\.com\//, `${relative}: missing canonical URL`);
  assert.match(html, /href="\/assets\/styles\.css"/, `${relative}: missing shared stylesheet`);
  assert.doesNotMatch(html, /<script\b|document\.cookie|googletag|analytics\.js/i, `${relative}: script or tracking code found`);
  assert.doesNotMatch(html, /example\.(com|org|net)|support@dailance\.(app|io)/i, `${relative}: placeholder domain or wrong support address found`);

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (href.startsWith('mailto:')) {
      assert.equal(href, 'mailto:support@dailance.com', `${relative}: unexpected email link`);
      continue;
    }
    if (href.startsWith('https://')) continue;
    if (href.startsWith('#')) continue;
    const target = localTarget(href);
    assert(target && allFiles.includes(target), `${relative}: broken internal link ${href}`);
  }
}

const combined = (await Promise.all(htmlFiles.map((file) => readFile(file, 'utf8')))).join('\n');
for (const address of [
  'https://legal.dailance.com/en/terms/',
  'https://legal.dailance.com/en/privacy/',
  'https://legal.dailance.com/en/delete-account/',
]) {
  assert(combined.includes(address), `Missing canonical public URL: ${address}`);
}

const privacy = await readFile(path.join(root, 'en/privacy/index.html'), 'utf8');
for (const requiredDisclosure of [
  'Sign in with Apple',
  'private relay address',
  'DigitalOcean',
  'Resend',
  'Expo push token',
  'Apple Push Notification service',
  'Firebase Cloud Messaging',
  'hosted on DigitalOcean infrastructure in Frankfurt, Germany',
  'private DigitalOcean Spaces bucket',
  'Automatic deletion of old backup restore points is not currently enabled',
  'removed from active application databases',
]) {
  assert(privacy.includes(requiredDisclosure), `Privacy Policy is missing required disclosure: ${requiredDisclosure}`);
}

const terms = await readFile(path.join(root, 'en/terms/index.html'), 'utf8');
for (const requiredTerm of [
  'at least 18 years old',
  'contractual 18+ eligibility rule is separate from the content-based age rating',
  'does not promise any financial result',
  'Sign in with Apple',
  'laws of the Republic of Armenia',
]) {
  assert(terms.includes(requiredTerm), `Terms of Use is missing required term: ${requiredTerm}`);
}

const deletion = await readFile(path.join(root, 'en/delete-account/index.html'), 'utf8');
for (const requiredInstruction of [
  'email-and-password account',
  'Apple-only account',
  'revokes its stored Apple authorization',
  'deletion completes asynchronously',
  'encrypted backups',
  'support@dailance.com',
]) {
  assert(deletion.includes(requiredInstruction), `Deletion page is missing required instruction: ${requiredInstruction}`);
}

for (const legalPage of [privacy, terms, deletion]) {
  assert(legalPage.includes('Dailance is the product and service name'), 'Legal page does not distinguish the Dailance name from the operator');
  assert(legalPage.includes('natural person acting in an individual capacity'), 'Legal page is missing the confirmed individual operating form');
  assert(legalPage.toLowerCase().includes('no legal entity or registered sole proprietorship'), 'Legal page is missing the no-entity/no-registration boundary');
  assert(legalPage.includes('VERIFIED LEGAL NAME REQUIRED BEFORE PUBLICATION'), 'Legal page is missing the operator legal-name publication blocker');
}

assert(privacy.includes('do not operate Dailance'), 'Privacy Policy does not distinguish external service providers from the operator');
assert(privacy.includes('operator transition has already occurred'), 'Privacy Policy is missing the future-operator transition boundary');
assert(terms.includes('operator transition has already occurred'), 'Terms are missing the future-operator transition boundary');
assert(terms.includes('does not represent that Dailance is an Armenian company, registered business, or licensed provider'), 'Terms overstate the effect of the Armenian governing-law clause');
assert.doesNotMatch(combined, /Oleg Pyrchenkov/i, 'Unverified operator legal name found');

for (const legalPage of [privacy, terms, deletion]) {
  assert(legalPage.includes('completely free'), 'Legal page is missing the confirmed free launch model');
  assert(legalPage.includes('no paid subscriptions, in-app purchases, paid features, advertisements, or other monetization'), 'Legal page is missing a launch monetization exclusion');
}

assert(terms.includes('does not promise that Dailance will remain free forever'), 'Terms incorrectly imply that the free model is permanent');
assert(terms.includes('clear notice'), 'Terms are missing the future-pricing notice boundary');
assert(privacy.includes('do not collect payment-card or purchase information'), 'Privacy Policy is missing the no-payment-data boundary');
for (const legalPage of [privacy, terms, deletion]) {
  assert(legalPage.includes('Armenia storefronts'), 'Legal page is missing the Armenia-only launch market');
}
assert(privacy.includes('does not currently claim geographical access controls'), 'Privacy Policy overstates storefront targeting as a backend restriction');
assert(terms.includes('not a representation that the backend technically blocks access'), 'Terms overstate storefront targeting as a backend restriction');
assert.doesNotMatch(combined, /\brefunds?\b/i, 'Refund language is inappropriate for the free launch model');

for (const legalPage of [privacy, terms, deletion]) {
  assert(legalPage.includes('Proposed revision:</strong> 15 November 2026'), 'Legal page revision dates are inconsistent');
  assert(legalPage.includes('Publication approval required.'), 'Legal page is missing the approval boundary');
}

const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
assert.match(robots, /^User-agent: \*$/m);
assert.match(robots, /^Sitemap: https:\/\/legal\.dailance\.com\/sitemap\.xml$/m);

const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
for (const address of [
  'https://legal.dailance.com/',
  'https://legal.dailance.com/en/',
  'https://legal.dailance.com/en/terms/',
  'https://legal.dailance.com/en/privacy/',
  'https://legal.dailance.com/en/delete-account/',
]) {
  assert(sitemap.includes(`<loc>${address}</loc>`), `Sitemap is missing ${address}`);
}

for (const unsupportedLanguage of ['ru', 'hy', 'vi']) {
  assert(!allFiles.some((file) => file.startsWith(path.join(root, unsupportedLanguage))), `Fake ${unsupportedLanguage} translation found`);
}

process.stdout.write(`PASS: validated ${htmlFiles.length} HTML pages, legal disclosures, metadata, and all internal links.\n`);
