import { mkdir, copyFile, rm, cp } from 'node:fs/promises';
const output = new URL('./dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'style.css', 'app.js', 'geometry.js', 'vector-scene.js', 'scene-effects.js', 'projects.js', 'project-art.js', 'balance-art.js', 'arrival-sequence.js', 'balance-interaction.js']) {
  await copyFile(new URL(file, import.meta.url), new URL(file, output));
}
await cp(new URL('./assets/', import.meta.url), new URL('assets/', output), { recursive: true });
console.log('Static site built in dist/');
