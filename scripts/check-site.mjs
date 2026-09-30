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

for (const unsupportedLanguage of ['ru', 'hy', 'vi']) {
  assert(!allFiles.some((file) => file.startsWith(path.join(root, unsupportedLanguage))), `Fake ${unsupportedLanguage} translation found`);
}

process.stdout.write(`PASS: validated ${htmlFiles.length} HTML pages and all internal links.\n`);
