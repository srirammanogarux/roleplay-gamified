// Reading and writing the asset spec, character files, queue and Paper board.
// Shared by generate.mjs and review-server.mjs so both see the same "units".
//
// A unit is one thing that can be generated: a still, a video or a voice line.
// Spec items of kind "character-sheet" expand into one unit per sheet entry of that character.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MODELS, MAX_CHARACTER_REFS, MAX_VIDEO_REFS, VIDEO_DURATIONS, HERO_RESOLUTION, DEFAULT_RESOLUTION,
  MARCUS_STYLE, STILL_RULES, VIDEO_RULES, SHEET_RULES, PLAYER_VOICE,
} from '../config.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export const abs = (p) => path.join(ROOT, p);
export const exists = (p) => !!p && fs.existsSync(abs(p));

export const KINDS = ['still', 'video', 'voice', 'character-sheet'];
export const QUEUE_ACTIONS = ['redo', 'improve-prompt', 'replace', 'add-scene'];

export function checkRoleplayId(id) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id || '')) throw new Error(`bad roleplay id "${id}" (use lowercase letters, digits and dashes)`);
  return id;
}

export function isStatus(s) {
  return s === 'draft' || s === 'approved' || /^redo:.+/s.test(s || '');
}

export function roleplayPaths(rp) {
  const dir = `media/${checkRoleplayId(rp)}`;
  return { dir, spec: `${dir}/assets.json`, queue: `${dir}/queue.json`, board: `${dir}/paper-board.json` };
}

export function readJson(p, fallback) {
  if (!exists(p)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`${p} not found`);
  }
  return JSON.parse(fs.readFileSync(abs(p), 'utf8'));
}

export function writeJson(p, data) {
  fs.mkdirSync(path.dirname(abs(p)), { recursive: true });
  const tmp = abs(p) + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
  fs.renameSync(tmp, abs(p));
}

export function listRoleplays() {
  if (!exists('media')) return [];
  return fs.readdirSync(abs('media'))
    .filter((d) => exists(`media/${d}/assets.json`))
    .map((d) => ({ id: d, title: readJson(`media/${d}/assets.json`).title || d }));
}

// ---------- characters ----------

export const characterPath = (name) => `characters/${name}/character.json`;

export function loadCharacter(name, cache = new Map()) {
  if (!cache.has(name)) cache.set(name, readJson(characterPath(name)));
  return cache.get(name);
}

// Reference images that define a character: the listed references plus any approved sheet entry marked `reference`.
export function characterRefs(ch) {
  const fromSheet = (ch.sheet || [])
    .filter((e) => e.reference && e.status === 'approved' && exists(e.output))
    .map((e) => e.output);
  return [...(ch.references || []), ...fromSheet].filter(exists);
}

// ---------- units ----------

export function loadSpec(rp) {
  return readJson(roleplayPaths(rp).spec);
}

export function expandUnits(rp, spec = loadSpec(rp), cache = new Map()) {
  const units = [];
  spec.items.forEach((item, index) => {
    if (item.kind !== 'character-sheet') {
      units.push({ ...item, params: item.params || {}, source: { type: 'spec', index } });
      return;
    }
    const name = item.params.character;
    const ch = loadCharacter(name, cache);
    const only = item.params.entries;
    for (const e of ch.sheet || []) {
      if (only && !only.includes(e.id)) continue;
      const sub = (id) => (id ? `${item.id}/${id}` : undefined);
      units.push({
        id: `${item.id}/${e.id}`,
        kind: e.type,
        scene: item.scene || `${name} sheet`,
        summary: e.summary,
        prompt: e.prompt,
        characters: [name],
        params: {
          aspect: e.aspect || (e.type === 'video' ? '9:16' : '1:1'),
          sheet: true,
          ...(e.type === 'video'
            ? { duration: e.duration || 8, resolution: e.resolution, hero: !!e.hero, firstStill: sub(e.firstFrame), lastStill: sub(e.lastFrame), crop: e.crop, fitSeconds: e.fitSeconds, model: e.model }
            : { size: e.size, model: e.model }),
        },
        output: e.output,
        posters: e.posters,
        status: e.status || 'draft',
        takes: e.takes || [],
        source: { type: 'character', name, entryId: e.id, parentId: item.id },
      });
    }
  });
  return units;
}

// Write a patch back to wherever the unit lives (assets.json or character.json).
export function updateUnit(rp, unit, patch) {
  if (unit.source.type === 'spec') {
    const specPath = roleplayPaths(rp).spec;
    const spec = readJson(specPath);
    const item = spec.items.find((i) => i.id === unit.id);
    if (!item) throw new Error(`item ${unit.id} vanished from ${specPath}`);
    Object.assign(item, patch);
    writeJson(specPath, spec);
    return;
  }
  const p = characterPath(unit.source.name);
  const ch = readJson(p);
  const entry = ch.sheet.find((e) => e.id === unit.source.entryId);
  Object.assign(entry, patch);
  writeJson(p, ch);
}

export function findUnit(units, id) {
  const u = units.find((x) => x.id === id);
  if (!u) throw new Error(`no item "${id}" (ids: ${units.map((x) => x.id).slice(0, 8).join(', ')}${units.length > 8 ? ', …' : ''})`);
  return u;
}

// ---------- takes & posters ----------

export function takePath(output, n) {
  const ext = path.extname(output);
  return `${output.slice(0, -ext.length)}.take${n}${ext}`;
}

export function nextTake(unit) {
  const used = new Set((unit.takes || []).map((t) => t.take));
  for (let n = 2; ; n++) if (!used.has(n) && !exists(takePath(unit.output, n))) return n;
}

// First/last-frame posters sit next to a video: foo.mp4 -> foo-poster.jpg, foo-last.jpg.
export function posterPaths(videoPath, unit) {
  if (unit?.posters && videoPath === unit.output) return unit.posters;
  const base = videoPath.slice(0, -path.extname(videoPath).length);
  return { first: `${base}-poster.jpg`, last: `${base}-last.jpg` };
}

export function takePosterPaths(unit, n) {
  const main = posterPaths(unit.output, unit);
  const p = (x) => (x ? takePath(x, n) : null);
  return { first: p(main.first), last: p(main.last) };
}

// ---------- rules ----------

// One place to edit at a time: Paper owns everything before video; once a scene's video exists,
// the review page owns its prompt (and the prompts of the stills it was made from). Voices never go to Paper.
export function promptOwner(unit, units) {
  if (unit.kind === 'voice') return 'review';
  if (unit.kind === 'video') return exists(unit.output) ? 'review' : 'paper';
  const usedByMadeVideo = units.some((v) => v.kind === 'video' && exists(v.output) && (v.params.firstStill === unit.id || v.params.lastStill === unit.id));
  return usedByMadeVideo ? 'review' : 'paper';
}

export function videoSettings(unit) {
  const p = unit.params;
  const hero = !!p.hero;
  const resolution = hero ? HERO_RESOLUTION : (p.resolution || DEFAULT_RESOLUTION);
  const notes = [];
  let duration = Number(p.duration || 8);
  const needs8 = [resolution !== '720p' && `${resolution}`, p.lastStill && 'first+last frame', p.references?.length && 'reference images'].filter(Boolean);
  if (needs8.length && duration !== 8) {
    notes.push(`Veo needs 8s for ${needs8.join(', ')}: generating 8s${p.fitSeconds ? `, retimed to ${p.fitSeconds}s` : ` (set params.fitSeconds to retime to ${duration}s)`}`);
    duration = 8;
  }
  // A clip can name its own model. Veo 2 makes no sound (so Veo 3's audio filter can't refuse it), but takes only a first frame.
  if (p.model?.startsWith('veo-2')) {
    notes.push('Veo 2 fallback: no sound, first frame only, 720p');
    return { hero, resolution: undefined, duration, model: p.model, aspect: p.aspect || '9:16', notes, firstFrameOnly: true };
  }
  return { hero, resolution, duration, model: p.model || (hero ? MODELS.videoHero : MODELS.video), aspect: p.aspect || '9:16', notes };
}

// Problems that stop a unit being generated right now. `blocked` stops it; `warnings` are printed.
export function checkUnit(unit, units, cache = new Map()) {
  const blocked = [];
  const warnings = [];
  const p = unit.params;
  if (!unit.output) blocked.push('no output path');
  if (!isStatus(unit.status)) warnings.push(`unknown status "${unit.status}"`);
  if (p.frozen) blocked.push('frozen original: never regenerated');

  if (unit.kind === 'still' && !p.extract) {
    if (!unit.prompt) blocked.push('no prompt yet');
    for (const name of unit.characters || []) {
      const ch = loadCharacter(name, cache);
      const isBase = unit.source.type === 'character' && ch.sheet.find((e) => e.id === unit.source.entryId)?.base;
      if (!characterRefs(ch).length && !isBase) blocked.push(`${name} has no approved reference image yet (approve the sheet entry marked "base" first)`);
    }
  }
  if (unit.kind === 'still' && p.extract && !exists(p.extract.from)) blocked.push(`extract source ${p.extract.from} missing`);

  if (unit.kind === 'video') {
    if (!unit.prompt) blocked.push('no prompt yet');
    const vs = videoSettings(unit);
    warnings.push(...vs.notes);
    if (!['9:16', '16:9'].includes(vs.aspect)) blocked.push(`Veo only makes 9:16 or 16:9, not ${vs.aspect} (use params.crop "square" for square clips)`);
    if (!VIDEO_DURATIONS.includes(vs.duration)) blocked.push(`duration must be one of ${VIDEO_DURATIONS.join('/')}`);
    for (const key of ['firstStill', 'lastStill']) {
      if (!p[key]) continue;
      const s = units.find((x) => x.id === p[key]);
      if (!s) blocked.push(`${key} "${p[key]}" is not an item`);
      else if (!exists(s.output)) blocked.push(`${key} "${s.id}" not generated yet`);
      else if (s.status !== 'approved') blocked.push(`${key} "${s.id}" not approved yet (stills first)`);
    }
    if (!p.firstStill) warnings.push('no first still: every clip should start on an approved still');
    if ((p.references?.length || 0) > MAX_VIDEO_REFS) blocked.push(`at most ${MAX_VIDEO_REFS} reference images`);
    if (p.references?.length && (p.firstStill || p.lastStill)) blocked.push('Veo cannot combine reference images with first/last frames');
  }

  if (unit.kind === 'voice') {
    if (!p.text) blocked.push('no text');
    const v = resolveVoice(unit, cache);
    if (!v.id) blocked.push(`no ElevenLabs voice id for "${p.voice}" yet (run --list-voices, then set voice.id in ${p.voice === 'player' ? 'tools/assets/config.mjs PLAYER_VOICE' : characterPath(p.voice)})`);
  }
  return { blocked, warnings };
}

export function resolveVoice(unit, cache = new Map()) {
  const who = unit.params.voice;
  const v = who === 'player' ? PLAYER_VOICE : loadCharacter(who, cache).voice || {};
  return {
    id: unit.params.voiceId || v.id,
    model: v.model || MODELS.voice,
    settings: v.settings || null,
    pronunciationDictionaries: v.pronunciationDictionaries || [],
  };
}

export function voiceText(unit) {
  const { text, emotion } = unit.params;
  return emotion ? `${emotion} ${text}` : text;
}

export function imageModel(unit) {
  return unit.params.model === 'pro' ? MODELS.imagePro : MODELS.image;
}

// Reference images for a still: each character's own references (capped per model), then style references
// for characters that do not have their own face yet.
export function stillRefs(unit, cache = new Map()) {
  const limit = MAX_CHARACTER_REFS[imageModel(unit)] || 4;
  const character = [];
  const style = [];
  for (const name of unit.characters || []) {
    const ch = loadCharacter(name, cache);
    const own = characterRefs(ch);
    if (own.length) character.push(...own.slice(0, Math.max(1, Math.floor(limit / (unit.characters.length || 1)))));
    else style.push(...(ch.styleReferences || []).filter(exists));
  }
  for (const r of unit.params.references || []) if (exists(r)) style.push(r);
  return { character: character.slice(0, limit), style: [...new Set(style)].slice(0, 3) };
}

// The full text sent to the model: the item's own prompt, the character notes, then the shared rules.
export function composePrompt(unit, units = [], cache = new Map()) {
  const parts = [unit.prompt.trim()];
  const chars = (unit.characters || []).map((n) => loadCharacter(n, cache));
  if (unit.params.note) parts.push(`CHANGE FOR THIS TAKE: ${unit.params.note}`);
  if (chars.length) parts.push('CHARACTERS (keep exactly on-model):\n' + chars.map((c) => `- ${c.name}: ${c.look}`).join('\n'));
  const style = unit.params.style || (chars.length === 1 && chars[0].style) || MARCUS_STYLE;
  parts.push(`STYLE: ${style}`);
  if (unit.kind === 'still') {
    const refs = stillRefs(unit, cache);
    const lines = [];
    if (refs.character.length) lines.push(`The first ${refs.character.length} image(s) are the character references: copy the face, hair and outfit exactly.`);
    if (refs.style.length) lines.push(`The next ${refs.style.length} image(s) are style references only: copy the drawing style, never the person.`);
    if (lines.length) parts.push(lines.join(' '));
    if (unit.params.sheet) parts.push(SHEET_RULES);
    parts.push(STILL_RULES);
  }
  if (unit.kind === 'video') parts.push(VIDEO_RULES);
  return parts.join('\n\n');
}

// ---------- queue ----------

export function loadQueue(rp) {
  return readJson(roleplayPaths(rp).queue, { roleplay: rp, entries: [] });
}

export function appendQueue(rp, entry) {
  const q = loadQueue(rp);
  const n = q.entries.reduce((m, e) => Math.max(m, e.n), 0) + 1;
  const full = { n, ...entry, state: 'pending', createdAt: new Date().toISOString() };
  q.entries.push(full);
  writeJson(roleplayPaths(rp).queue, q);
  return full;
}

export function updateQueueEntry(rp, n, patch) {
  const q = loadQueue(rp);
  Object.assign(q.entries.find((e) => e.n === n), patch);
  writeJson(roleplayPaths(rp).queue, q);
}
