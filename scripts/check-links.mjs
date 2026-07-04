import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const outputDirectory = process.env.SITE_OUTPUT_DIR || 'docs';
const root = path.resolve(process.cwd(), outputDirectory);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const candidate = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(candidate));
    else out.push(candidate);
  }
  return out;
}

const htmlFiles = (await walk(root)).filter((file) => file.endsWith('.html'));
const failures = [];
let linksChecked = 0;

for (const file of htmlFiles) {
  const text = await readFile(file, 'utf8');
  const hrefs = [...text.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('/')) continue;
    const pathOnly = href.split('#')[0].split('?')[0];
    if (!pathOnly) continue;
    linksChecked += 1;
    const target = path.resolve(path.dirname(file), pathOnly);
    try {
      await access(target);
    } catch {
      failures.push(`${path.relative(root, file)} -> ${href}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  status: 'passed',
  output_directory: outputDirectory,
  html_files: htmlFiles.length,
  internal_links_checked: linksChecked,
}, null, 2));