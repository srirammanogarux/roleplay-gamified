// ffmpeg / ffprobe helpers. Everything here is local and needs no API keys.

import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { FFMPEG, FFPROBE, LOUDNESS } from '../config.mjs';

function run(bin, args) {
  return new Promise((resolve, reject) => {
    execFile(bin, args, { maxBuffer: 64 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) reject(new Error(`${path.basename(bin)} failed: ${stderr.split('\n').filter(Boolean).slice(-3).join(' | ') || err.message}`));
      else resolve({ stdout, stderr });
    });
  });
}

const ffmpeg = (args) => run(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
const mkdirFor = (file) => fs.mkdirSync(path.dirname(file), { recursive: true });

export async function duration(file) {
  const { stdout } = await run(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]);
  return Number(stdout.trim());
}

// Drop Veo's audio track, and optionally crop to a centred square and/or retime to a target length.
export async function finishVideo(input, output, { crop, size, fitSeconds } = {}) {
  mkdirFor(output);
  const filters = [];
  if (crop === 'square') filters.push("crop='min(iw,ih)':'min(iw,ih)'");
  if (size) filters.push(`scale=${size}:${size}`);
  const length = fitSeconds && (await duration(input));
  if (fitSeconds && Math.abs(length - fitSeconds) > 0.05) filters.push(`setpts=PTS*${fitSeconds / length}`);
  if (!filters.length) return ffmpeg(['-i', input, '-an', '-c:v', 'copy', '-movflags', '+faststart', output]);
  return ffmpeg(['-i', input, '-an', '-vf', filters.join(','), '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', output]);
}

export async function extractFrame(video, at, output) {
  mkdirFor(output);
  const q = /\.jpe?g$/i.test(output) ? ['-q:v', '2'] : [];
  if (at === 'last') return ffmpeg(['-sseof', '-0.5', '-i', video, '-update', '1', ...q, output]);
  return ffmpeg(['-i', video, '-frames:v', '1', ...q, output]);
}

export async function posters(video, { first, last }) {
  if (first) await extractFrame(video, 'first', first);
  if (last) await extractFrame(video, 'last', last);
}

export async function dimensions(file) {
  const { stdout } = await run(FFPROBE, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file]);
  const [w, h] = stdout.trim().split(',').map(Number);
  return { w, h };
}

// Veo frames must match the clip's aspect. A square still (e.g. a morph clip's frame on black) is centred on a
// black 9:16 canvas; a still that already matches is used as-is.
export async function fitFrame(input, output, aspect) {
  const [aw, ah] = aspect.split(':').map(Number);
  const { w, h } = await dimensions(input);
  if (Math.abs(w / h - aw / ah) < 0.01) return input;
  const W = aw > ah ? 1280 : 720;
  const H = aw > ah ? 720 : 1280;
  await ffmpeg(['-i', input, '-vf', `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:black`, '-frames:v', '1', output]);
  return output;
}

// Convert whatever the image model returned to the output's format, optionally resized to a square.
export async function writeImage(input, output, { size } = {}) {
  mkdirFor(output);
  const vf = size ? ['-vf', `scale=${size}:${size}:force_original_aspect_ratio=increase,crop=${size}:${size}`] : [];
  return ffmpeg(['-i', input, ...vf, '-frames:v', '1', output]);
}

// Two-pass EBU R128 loudness normalisation so every line sits at the same level.
export async function loudnorm(input, output) {
  mkdirFor(output);
  const { I, TP, LRA, sampleRate, bitrate, channels } = LOUDNESS;
  const target = `I=${I}:TP=${TP}:LRA=${LRA}`;
  const pass1 = await run(FFMPEG, ['-hide_banner', '-i', input, '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-']);
  const m = JSON.parse(pass1.stderr.match(/\{[^{}]*"input_i"[^{}]*\}/s)[0]);
  const measured = `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}`;
  return ffmpeg(['-i', input, '-af', `loudnorm=${target}:${measured}:linear=true`, '-ar', String(sampleRate), '-ac', String(channels), '-c:a', 'libmp3lame', '-b:a', bitrate, output]);
}
