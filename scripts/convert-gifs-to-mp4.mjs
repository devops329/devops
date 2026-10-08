#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { access, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const courseDirectory = path.resolve(scriptDirectory, '..');

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(entryPath);
    return entry.isFile() && entry.name.toLowerCase().endsWith('.md') ? [entryPath] : [];
  }));
  return nested.flat();
}

function runFfmpeg(ffmpeg, source, temporaryOutput) {
  const result = spawnSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', source,
    '-map', '0:v:0', '-an',
    '-c:v', 'libx264', '-crf', '23', '-preset', 'medium',
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
    '-pix_fmt', 'yuv420p', '-fps_mode', 'vfr',
    '-movflags', '+faststart', '-f', 'mp4', temporaryOutput,
  ], { encoding: 'utf8' });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `ffmpeg exited with status ${result.status}`);
  }
}

const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
const check = spawnSync(ffmpeg, ['-version'], { encoding: 'utf8' });
if (check.error || check.status !== 0) {
  console.error(`FFmpeg is required. Install it or set FFMPEG_PATH to its executable. Tried: ${ffmpeg}`);
  process.exit(1);
}

const files = await markdownFiles(courseDirectory);
const imagePattern = /(!\[([^\]]*)\]\()([^\s)]+\.gif)(\))/gi;
const videoSourcePattern = /<source\s+src=["']([^"']+\.mp4)["']/gi;
const documents = [];
const referencedGifs = new Map();
const existingVideos = new Set();

for (const markdownPath of files) {
  const original = await readFile(markdownPath, 'utf8');
  for (const match of original.matchAll(videoSourcePattern)) {
    const videoPath = match[1];
    if (/^(?:[a-z]+:|\/\/|\/)/i.test(videoPath)) continue;
    const resolvedVideo = path.resolve(path.dirname(markdownPath), videoPath);
    if (resolvedVideo.startsWith(`${courseDirectory}${path.sep}`)) existingVideos.add(resolvedVideo);
  }

  const matches = [...original.matchAll(imagePattern)];
  if (matches.length === 0) continue;

  let updated = original;
  for (const match of matches) {
    const relativeGif = match[3];
    if (/^(?:[a-z]+:|\/\/|\/)/i.test(relativeGif)) continue;

    const gifPath = path.resolve(path.dirname(markdownPath), relativeGif);
    if (!gifPath.startsWith(`${courseDirectory}${path.sep}`)) {
      throw new Error(`GIF reference escapes the course directory: ${relativeGif} in ${markdownPath}`);
    }

    const relativeMp4 = relativeGif.replace(/\.gif$/i, '.mp4');
    const mp4Path = path.resolve(path.dirname(markdownPath), relativeMp4);
    referencedGifs.set(gifPath, mp4Path);

    const replacement = `<video controls preload="metadata" playsinline aria-label="${match[2].replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"><source src="${relativeMp4}" type="video/mp4"></video>`;
    updated = updated.replace(match[0], replacement);
  }
  if (updated !== original) documents.push({ markdownPath, original, updated });
}

if (referencedGifs.size === 0) {
  let removed = 0;
  for (const videoPath of existingVideos) {
    const sourceGif = videoPath.replace(/\.mp4$/i, '.gif');
    try {
      await access(videoPath);
      await rm(sourceGif);
      removed += 1;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  if (removed > 0) {
    console.log(`Removed ${removed} GIF(s) already replaced by referenced MP4 videos.`);
    process.exit(0);
  }
  console.log('No local GIF references found in Markdown.');
  process.exit(0);
}

const stagedOutputs = [];
try {
  for (const [gifPath, mp4Path] of referencedGifs) {
    const temporaryOutput = `${mp4Path}.tmp`;
    console.log(`Converting ${path.relative(courseDirectory, gifPath)} -> ${path.relative(courseDirectory, mp4Path)}`);
    stagedOutputs.push({ temporaryOutput, mp4Path });
    runFfmpeg(ffmpeg, gifPath, temporaryOutput);
  }

  for (const output of stagedOutputs) await rename(output.temporaryOutput, output.mp4Path);
  for (const document of documents) await writeFile(document.markdownPath, document.updated, 'utf8');
  for (const gifPath of referencedGifs.keys()) await rm(gifPath);
} catch (error) {
  await Promise.all(stagedOutputs.map(({ temporaryOutput }) => rm(temporaryOutput, { force: true })));
  console.error(`Conversion stopped: ${error.message}`);
  process.exit(1);
}

console.log(`Converted ${referencedGifs.size} GIF(s), updated ${documents.length} Markdown file(s), and removed the replaced GIFs.`);
