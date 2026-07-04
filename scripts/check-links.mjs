import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(process.cwd(), 'docs-full-preview');
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
for (const file of htmlFiles) {
  const text = await readFile(file, 'utf8');
  const hrefs = [...text.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) continue;
    const target = path.resolve(path.dirname(file), href.split('#')[0]);
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
console.log(JSON.stringify({ status: 'passed', html_files: htmlFiles.length, internal_links_checked: 'all' }, null, 2));
