import { readdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const imageDirectory = path.resolve('_site/assets/img');
const concurrency = 4;

async function findPngs(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return findPngs(entryPath);
    if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.png') return [entryPath];
    return [];
  }));

  return files.flat();
}

async function optimizePng(file) {
  const temporaryFile = `${file}.optimize-${process.pid}`;
  const originalSize = (await stat(file)).size;

  try {
    const metadata = await sharp(file, { animated: true }).metadata();
    if ((metadata.pages ?? 1) > 1) return { originalSize, optimizedSize: originalSize };

    await sharp(file)
      .keepMetadata()
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: false,
        effort: 10
      })
      .toFile(temporaryFile);

    const optimizedSize = (await stat(temporaryFile)).size;
    if (optimizedSize >= originalSize) {
      await rm(temporaryFile);
      return { originalSize, optimizedSize: originalSize };
    }

    await rename(temporaryFile, file);
    return { originalSize, optimizedSize };
  } catch (error) {
    await rm(temporaryFile, { force: true });
    throw error;
  }
}

async function main() {
  const files = await findPngs(imageDirectory);
  const results = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < files.length) {
      const file = files[nextIndex];
      nextIndex += 1;
      results.push(await optimizePng(file));
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));

  const originalBytes = results.reduce((total, result) => total + result.originalSize, 0);
  const optimizedBytes = results.reduce((total, result) => total + result.optimizedSize, 0);
  const savedBytes = originalBytes - optimizedBytes;
  const percent = originalBytes ? (savedBytes / originalBytes) * 100 : 0;

  console.log(
    `Losslessly optimized ${files.length} PNGs: saved ${(savedBytes / 1024).toFixed(1)} KiB (${percent.toFixed(1)}%).`
  );
}

main().catch((error) => {
  console.error(`Image optimization failed: ${error.message}`);
  process.exitCode = 1;
});
