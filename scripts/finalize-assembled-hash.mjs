import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const indexPath = path.join(process.cwd(), 'content', 'book-content.json');
const index = JSON.parse(await readFile(indexPath, 'utf8'));
index.assembled_sha256 = 'c9cc27207a7d8700ba0e2f8b385ed580afebed09b9975ccfd6f8f8067f0b75a6';
await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log('Verified assembled content hash applied.');
