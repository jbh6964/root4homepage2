import { mkdir, copyFile } from 'node:fs/promises';
const output = new URL('./dist/', import.meta.url);
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'style.css', 'app.js', 'geometry.js', 'vector-scene.js', 'worlds.js']) {
  await copyFile(new URL(file, import.meta.url), new URL(file, output));
}
console.log('Static site built in dist/');
