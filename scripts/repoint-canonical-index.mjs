import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const indexPath = path.join(process.cwd(), 'content', 'book-content.json');
const index = JSON.parse(await readFile(indexPath, 'utf8'));

const restoredFiles = {
  'section-1': [
    ['sections/section-1.part-1.json', 'f2c350b801be2b694e92d4860675d8cdb81d618eaac3cfbf69b7964d0b4f2290', 5],
    ['sections/section-1.part-2.json', '34bcf0c9159567b715ac57f518ab386fc98e7ec52abf61e81e1faffe47466e91', 5],
    ['sections/section-1.part-3.json', 'd2098881270b6b988cc333e7d155042d3a37ff86197bbcc8412f24e078a5d54e', 5],
    ['sections/section-1.part-4.json', '962804f84a3726083c13cb38ac01304602db3c39a9bf5fd5aa388d9ad07d7be4', 4],
  ],
  'section-2': [
    ['sections/section-2.part-1.json', '067c37ac9670ce275183a2c45c22031ce5b947dc617fb2b9101b36403c25796b', 5],
    ['sections/section-2.part-2.json', '92e3763152ae0e9019b8899a08ef12995baa4fd4238bca5925e0aa8d811d135f', 5],
  ],
  'section-3': [
    ['sections/section-3.part-1.json', '65e0f224eb40db2008b3c9d3c9dfbb4f7371a7ecd8635060923fcb4fd2947436', 6],
    ['sections/section-3.part-2.json', '3afcfcc7979b75a634b448603d8524f4667e778e67d2702401f7584d6449f1b9', 5],
    ['sections/section-3.part-3.json', 'c6676899adc9eb5086f688a12dd3de1faa1f817aa4e709f68f4a0e7b2d444b40', 5],
  ],
  'section-5': [
    ['sections/section-5.part-1.json', '624f34073db32738677c4d455496450b57a7943719a097e2dd01b6c85d80dd63', 4],
    ['sections/section-5.part-2.json', 'dc5bbad15ceb8e75b20523f1bb09b0702bedff1aa80af151ee4e0882c4baa36f', 5],
    ['sections/section-5.part-3.json', '377b53feaad772ffc08a77bc51da048b137d0eebb5d40e813596d6548d27a042', 5],
    ['sections/section-5.part-4.json', 'e72c42e81378fbad1bfa7d14cfd1f7f394056cb5a446e6db4241d92a0093952a', 1],
  ],
  'section-6': [
    ['sections/section-6.part-1.json', '4c7d03a0db5ed162196c8888103cc5aacbfa17313ef6311d55ff5be952425788', 7],
    ['sections/section-6.part-2.json', '55833b229a6e5593715683f298280d49bca193a42bc8d7588758be28c52819cc', 4],
    ['sections/section-6.part-3.json', 'c7c2929c6b6aa2faf4c4e1604d03640d25b57f2935398f4799d382c5af64022d', 1],
  ],
  'section-7': [
    ['sections/section-7.part-1.json', 'dd3a48d3cad161ed0eac9ad7df90bc0b4f765c6e22c37d92aaa240a39bfa84e1', 3],
  ],
};

for (const section of index.sections) {
  const restored = restoredFiles[section.id];
  if (!restored) continue;
  section.files = restored.map(([file, sha256, piece_count]) => ({
    file,
    sha256,
    piece_count,
    compression: 'none',
    format: 'piece-shard',
  }));
}

index.storage = 'hash-verified-section-shards';
await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log('Canonical index references repaired.');
