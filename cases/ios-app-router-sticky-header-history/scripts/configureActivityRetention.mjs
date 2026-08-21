import {readFile, writeFile} from 'node:fs/promises';

const retention = process.env.NEXT_ACTIVITY_RETENTION ?? '3';

if (retention !== '1' && retention !== '3') {
  throw new Error('NEXT_ACTIVITY_RETENTION must be either 1 or 3');
}

const nextModules = [
  '../node_modules/next/dist/client/components/bfcache-state-manager.js',
  '../node_modules/next/dist/esm/client/components/bfcache-state-manager.js',
];
const maxEntries =
  /const MAX_BF_CACHE_ENTRIES = process\.env\.__NEXT_CACHE_COMPONENTS \? [13] : 1;/;
const replacement = `const MAX_BF_CACHE_ENTRIES = process.env.__NEXT_CACHE_COMPONENTS ? ${retention} : 1;`;

for (const nextModule of nextModules) {
  const url = new URL(nextModule, import.meta.url);
  const source = await readFile(url, 'utf8');

  if (!maxEntries.test(source)) {
    throw new Error(`Could not configure ${nextModule}`);
  }

  await writeFile(url, source.replace(maxEntries, replacement));
}

console.log(`Next.js Activity route retention: ${retention}`);
