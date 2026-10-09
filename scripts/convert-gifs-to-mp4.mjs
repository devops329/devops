#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { copyFile, readdir, readFile, rename, rm } from 'node:fs/promises';
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
const imagePattern = /!\[([^\]]*)\]\(([^\s)]+\.gif)\)/gi;
const referencedGifs = new Map();

for (const markdownPath of files) {
  const markdown = await readFile(markdownPath, 'utf8');
  for (const match of markdown.matchAll(imagePattern)) {
    const relativeGif = match[2];
    if (/^(?:[a-z]+:|\/\/|\/)/i.test(relativeGif)) continue;

    const gifPath = path.resolve(path.dirname(markdownPath), relativeGif);
    if (!gifPath.startsWith(`${courseDirectory}${path.sep}`)) {
      throw new Error(`GIF reference escapes the course directory: ${relativeGif} in ${markdownPath}`);
    }

    referencedGifs.set(gifPath, gifPath.replace(/\.gif$/i, '.mp4'));
  }
}

if (referencedGifs.size === 0) {
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

  for (const { temporaryOutput, mp4Path } of stagedOutputs) {
    await copyFile(temporaryOutput, mp4Path);
    await rm(temporaryOutput);
  }
} catch (error) {
  await Promise.all(stagedOutputs.map(({ temporaryOutput }) => rm(temporaryOutput, { force: true })));
  console.error(`Conversion stopped: ${error.message}`);
  process.exit(1);
}

console.log(`Converted ${referencedGifs.size} GIF(s) to MP4. Original GIFs and Markdown references were kept.`);
