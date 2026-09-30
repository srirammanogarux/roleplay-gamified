// API calls: Gemini (stills), Veo (video), ElevenLabs (voice). Keys come from .env and are never printed.
// Request shapes follow the official REST docs as of 2026-09-30:
//   Gemini image:  POST /v1beta/models/{model}:generateContent (generationConfig.imageConfig)
//   Veo:           POST /v1beta/models/{model}:predictLongRunning, poll GET /v1beta/{operation}, download the sample uri
//   ElevenLabs:    POST /v1/text-to-speech/{voice_id}?output_format=…, GET /v2/voices

import fs from 'node:fs';
import path from 'node:path';
import { GEMINI, ELEVENLABS, VIDEO_NEGATIVE } from '../config.mjs';
import { ROOT } from './spec.mjs';

export class MissingKey extends Error {}

let envLoaded = false;
export function requireKey(name) {
  if (!envLoaded) {
    envLoaded = true;
    const envFile = path.join(ROOT, '.env');
    if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
  }
  const v = process.env[name];
  if (!v) throw new MissingKey(`${name} is missing: add it to .env at the repo root (copy .env.example), then run again.`);
  return v;
}

const mimeOf = (file) => ({ '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' })[path.extname(file).toLowerCase()] || 'image/png';
const inline = (file) => ({ mimeType: mimeOf(file), data: fs.readFileSync(path.isAbsolute(file) ? file : path.join(ROOT, file)).toString('base64') });

async function failIfBad(res, what) {
  if (res.ok) return;
  let detail = await res.text();
  try { detail = JSON.parse(detail).error?.message || JSON.parse(detail).detail?.message || detail; } catch {}
  throw new Error(`${what} failed (${res.status}): ${String(detail).slice(0, 400)}`);
}

// ---------- Gemini image ----------

export async function generateImage({ model, prompt, refs, aspect }) {
  const key = requireKey('GEMINI_API_KEY');
  const body = {
    contents: [{ role: 'user', parts: [...refs.map((r) => ({ inlineData: inline(r) })), { text: prompt }] }],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: aspect, imageSize: GEMINI.imageSize } },
  };
  const res = await fetch(`${GEMINI.base}/models/${model}:generateContent`, {
    method: 'POST', headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  await failIfBad(res, `Gemini ${model}`);
  const json = await res.json();
  const parts = json.candidates?.[0]?.content?.parts || [];
  const img = parts.map((p) => p.inlineData || p.inline_data).find(Boolean);
  if (!img) {
    const why = json.candidates?.[0]?.finishReason || json.promptFeedback?.blockReason || parts.map((p) => p.text).join(' ').slice(0, 200) || 'no image in response';
    throw new Error(`Gemini ${model} returned no image: ${why}`);
  }
  return { bytes: Buffer.from(img.data, 'base64'), mimeType: img.mimeType || img.mime_type };
}

// ---------- Veo ----------

export async function generateVideo({ model, prompt, firstFrame, lastFrame, references, aspect, duration, resolution, onPoll }) {
  const key = requireKey('GEMINI_API_KEY');
  const instance = { prompt };
  if (firstFrame) instance.image = { inlineData: inline(firstFrame) };
  if (lastFrame) instance.lastFrame = { inlineData: inline(lastFrame) };
  if (references?.length) instance.referenceImages = references.map((r) => ({ image: { inlineData: inline(r) }, referenceType: 'asset' }));
  const parameters = { aspectRatio: aspect, durationSeconds: duration, resolution };
  if (firstFrame || lastFrame || references?.length) parameters.personGeneration = GEMINI.personGeneration;
  if (GEMINI.sendNegativePrompt) parameters.negativePrompt = VIDEO_NEGATIVE;

  const headers = { 'x-goog-api-key': key, 'Content-Type': 'application/json' };
  const start = await fetch(`${GEMINI.base}/models/${model}:predictLongRunning`, { method: 'POST', headers, body: JSON.stringify({ instances: [instance], parameters }) });
  await failIfBad(start, `Veo ${model}`);
  const { name } = await start.json();

  const deadline = Date.now() + GEMINI.pollTimeoutMinutes * 60_000;
  let op;
  while (true) {
    await new Promise((r) => setTimeout(r, GEMINI.pollEverySeconds * 1000));
    const res = await fetch(`${GEMINI.base}/${name}`, { headers });
    await failIfBad(res, 'Veo poll');
    op = await res.json();
    if (op.done) break;
    onPoll?.();
    if (Date.now() > deadline) throw new Error(`Veo still running after ${GEMINI.pollTimeoutMinutes} min (operation ${name})`);
  }
  if (op.error) throw new Error(`Veo failed: ${op.error.message || JSON.stringify(op.error)}`);
  const resp = op.response?.generateVideoResponse;
  const uri = resp?.generatedSamples?.[0]?.video?.uri;
  if (!uri) throw new Error(`Veo returned no video${resp?.raiMediaFilteredReasons ? `: ${resp.raiMediaFilteredReasons.join('; ')}` : ''}`);

  const file = await fetch(uri, { headers: { 'x-goog-api-key': key } });
  await failIfBad(file, 'Veo download');
  return Buffer.from(await file.arrayBuffer());
}

// ---------- ElevenLabs ----------

export async function synthesize({ voiceId, model, text, settings, pronunciationDictionaries }) {
  const key = requireKey('ELEVENLABS_API_KEY');
  const body = { text, model_id: model, voice_settings: settings || ELEVENLABS.defaultSettings };
  if (pronunciationDictionaries?.length) {
    body.pronunciation_dictionary_locators = pronunciationDictionaries.map((d) => ({ pronunciation_dictionary_id: d.id, version_id: d.versionId }));
  }
  const res = await fetch(`${ELEVENLABS.base}/v1/text-to-speech/${voiceId}?output_format=${ELEVENLABS.outputFormat}`, {
    method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' }, body: JSON.stringify(body),
  });
  await failIfBad(res, `ElevenLabs ${model}`);
  return Buffer.from(await res.arrayBuffer());
}

export async function listVoices() {
  const key = requireKey('ELEVENLABS_API_KEY');
  const voices = [];
  let token;
  do {
    const url = new URL(`${ELEVENLABS.base}/v2/voices`);
    url.searchParams.set('page_size', '100');
    if (token) url.searchParams.set('next_page_token', token);
    const res = await fetch(url, { headers: { 'xi-api-key': key } });
    await failIfBad(res, 'ElevenLabs voices');
    const json = await res.json();
    voices.push(...json.voices);
    token = json.has_more ? json.next_page_token : null;
  } while (token);
  return voices;
}
