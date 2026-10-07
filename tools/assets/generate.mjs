#!/usr/bin/env node
// Asset generator. See tools/assets/README.md.
//
//   node tools/assets/generate.mjs <roleplay-id> [--only <id,...>] [--queue] [--dry-run] [--verbose]
//   node tools/assets/generate.mjs <roleplay-id> --promote <id> <take>
//   node tools/assets/generate.mjs <roleplay-id> --sync-from <paper-board.json> [--dry-run]
//   node tools/assets/generate.mjs <roleplay-id> --init-board
//   node tools/assets/generate.mjs --list-voices

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  abs, exists, roleplayPaths, loadSpec, readJson, writeJson, expandUnits, updateUnit, findUnit, checkUnit,
  composePrompt, videoSettings, stillRefs, imageModel, resolveVoice, voiceText, takePath, nextTake, posterPaths,
  takePosterPaths, promptOwner, isStatus, loadQueue, updateQueueEntry,
} from './lib/spec.mjs';
import { MissingKey, requireKey, generateImage, generateVideo, synthesize, listVoices } from './lib/providers.mjs';
import { finishVideo, extractFrame, fitFrame, posters, writeImage, loudnorm } from './lib/media.mjs';

const USAGE = `usage:
  node tools/assets/generate.mjs <roleplay-id> [--only <id,...>] [--queue] [--dry-run] [--verbose]
  node tools/assets/generate.mjs <roleplay-id> --promote <id> <take>
  node tools/assets/generate.mjs <roleplay-id> --sync-from <file> [--dry-run]
  node tools/assets/generate.mjs <roleplay-id> --init-board
  node tools/assets/generate.mjs --list-voices`;

function parseArgs(argv) {
  const a = { positional: [] };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === '--only') a.only = argv[++i]?.split(',').map((s) => s.trim()).filter(Boolean);
    else if (x === '--queue') a.queue = true;
    else if (x === '--dry-run') a.dryRun = true;
    else if (x === '--verbose') a.verbose = true;
    else if (x === '--list-voices') a.listVoices = true;
    else if (x === '--init-board') a.initBoard = true;
    else if (x === '--sync-from') a.syncFrom = argv[++i];
    else if (x === '--promote') a.promote = [argv[++i], argv[++i]];
    else if (x === '--help' || x === '-h') a.help = true;
    else if (x.startsWith('--')) throw new Error(`unknown option ${x}\n${USAGE}`);
    else a.positional.push(x);
  }
  return a;
}

const log = (...m) => console.log(...m);

// ---------- --list-voices ----------

async function cmdListVoices() {
  const voices = await listVoices();
  const w = Math.max(...voices.map((v) => v.name.length), 4);
  log(`${'name'.padEnd(w)}  ${'voice id'.padEnd(22)}  category`);
  for (const v of voices.sort((a, b) => a.name.localeCompare(b.name))) log(`${v.name.padEnd(w)}  ${v.voice_id.padEnd(22)}  ${v.category || ''}`);
  log(`\n${voices.length} voices. Put Marcus's and Sarah's ids in characters/<name>/character.json → voice.id, and the player's in tools/assets/config.mjs → PLAYER_VOICE.`);
}

// ---------- --promote ----------

function swap(a, b) {
  const tmp = abs(a) + '.swap';
  fs.renameSync(abs(a), tmp);
  fs.renameSync(abs(b), abs(a));
  fs.renameSync(tmp, abs(b));
}

function cmdPromote(rp, id, takeArg) {
  const n = Number(String(takeArg || '').replace(/^take/, ''));
  if (!id || !Number.isInteger(n) || n < 2) throw new Error(`usage: --promote <id> <take number, e.g. 2>`);
  const unit = findUnit(expandUnits(rp), id);
  const take = takePath(unit.output, n);
  if (!exists(take)) throw new Error(`${take} does not exist`);
  if (exists(unit.output)) swap(unit.output, take);
  else fs.renameSync(abs(take), abs(unit.output));
  if (unit.kind === 'video') {
    const main = posterPaths(unit.output, unit);
    const tp = takePosterPaths(unit, n);
    for (const k of ['first', 'last']) {
      if (main[k] && tp[k] && exists(tp[k])) exists(main[k]) ? swap(main[k], tp[k]) : fs.renameSync(abs(tp[k]), abs(main[k]));
    }
  }
  const takes = (unit.takes || []).map((t) => (t.take === n ? { ...t, promotedAt: new Date().toISOString(), note: `${t.note ? t.note + ' · ' : ''}now the main file; the previous main is saved as take ${n}` } : t));
  updateUnit(rp, unit, { status: 'approved', takes });
  log(`promoted take ${n} of ${id}: ${unit.output} is now the new version, the old one is ${take}. Status: approved.`);
}

// ---------- Paper board ----------

function boardFromUnits(rp, units) {
  return {
    roleplay: rp,
    note: 'Driven by the main agent through the Paper MCP. cardId = Paper node id of the scene card. prompt/status = what Paper showed at the last sync.',
    paperFile: null,
    paperPage: null,
    syncedAt: null,
    cards: units.filter((u) => u.kind !== 'voice').map((u) => ({ cardId: null, itemId: u.id, summary: u.summary, prompt: u.prompt, status: u.status })),
  };
}

function cmdInitBoard(rp) {
  const p = roleplayPaths(rp).board;
  if (exists(p)) throw new Error(`${p} already exists; it holds the Paper card ids, so it is never overwritten`);
  writeJson(p, boardFromUnits(rp, expandUnits(rp)));
  log(`wrote ${p}`);
}

function cmdSyncFrom(rp, file, dryRun) {
  const incoming = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  if (!Array.isArray(incoming.cards)) throw new Error(`${file} has no "cards" array (see media/<roleplay>/paper-board.json)`);
  const boardPath = roleplayPaths(rp).board;
  const board = readJson(boardPath, boardFromUnits(rp, expandUnits(rp)));
  let changes = 0;
  for (const card of incoming.cards) {
    const units = expandUnits(rp);
    const unit = units.find((u) => u.id === card.itemId);
    if (!unit) { log(`skip card ${card.cardId || '?'}: no item "${card.itemId}"`); continue; }
    const patch = {};
    const prompt = typeof card.prompt === 'string' ? card.prompt.trim() : null;
    if (prompt && prompt !== (unit.prompt || '').trim()) {
      if (promptOwner(unit, units) === 'paper') patch.prompt = prompt;
      else log(`refused prompt for ${unit.id}: its video exists, so its prompt is edited on the review page now`);
    }
    const status = typeof card.status === 'string' ? card.status.trim() : null;
    if (status && status !== unit.status) {
      if (isStatus(status)) patch.status = status;
      else log(`refused status "${status}" for ${unit.id}: use draft, approved or redo:<note>`);
    }
    if (Object.keys(patch).length) {
      changes++;
      log(`${dryRun ? 'would update' : 'updated'} ${unit.id}: ${Object.keys(patch).map((k) => (k === 'prompt' ? 'prompt' : `status → ${patch[k]}`)).join(', ')}`);
      if (!dryRun) updateUnit(rp, unit, patch);
    }
    const mine = board.cards.find((c) => c.itemId === unit.id);
    const synced = { cardId: card.cardId ?? mine?.cardId ?? null, itemId: unit.id, summary: unit.summary, prompt: patch.prompt ?? unit.prompt, status: patch.status ?? unit.status };
    if (mine) Object.assign(mine, synced);
    else board.cards.push(synced);
  }
  if (incoming.paperFile) board.paperFile = incoming.paperFile;
  if (incoming.paperPage) board.paperPage = incoming.paperPage;
  board.syncedAt = new Date().toISOString();
  if (!dryRun) writeJson(boardPath, board);
  log(`${changes} item(s) ${dryRun ? 'would change' : 'changed'}${dryRun ? '' : `; ${boardPath} updated`}.`);
}

// ---------- generation ----------

const KIND_ORDER = { still: 0, video: 1, voice: 2 };

function planJobs(rp, units, args) {
  const match = (u) => !args.only || args.only.some((id) => u.id === id || u.id.startsWith(id + '/'));
  if (!args.queue) {
    return units.filter((u) => match(u) && !exists(u.output)).map((u) => ({ unit: u, mode: 'new' }))
      .sort((a, b) => KIND_ORDER[a.unit.kind] - KIND_ORDER[b.unit.kind]);
  }
  const jobs = [];
  for (const e of loadQueue(rp).entries.filter((x) => x.state === 'pending')) {
    const targetId = e.action === 'add-scene' ? e.newItemId : e.itemId;
    const unit = units.find((u) => u.id === targetId);
    if (!unit || !match(unit)) {
      if (!args.only) jobs.push({ entry: e, skip: e.action === 'add-scene' && !e.newItemId ? 'waiting for the new item: add it to assets.json, then set newItemId and ready: true on this queue entry' : `no item "${targetId}"` });
      continue;
    }
    if ((e.action === 'replace' || e.action === 'add-scene') && !e.ready) {
      jobs.push({ entry: e, unit, skip: 'waiting for a prompt: write it in assets.json, then set ready: true on this queue entry' });
      continue;
    }
    const mode = e.action === 'add-scene' && !exists(unit.output) ? 'new' : 'take';
    jobs.push({ entry: e, unit: e.action === 'redo' && e.note ? { ...unit, params: { ...unit.params, note: e.note } } : unit, mode });
  }
  return jobs;
}

function describe(unit, units, cache) {
  if (unit.kind === 'still' && unit.params.extract) return `ffmpeg: ${unit.params.extract.at} frame of ${unit.params.extract.from}`;
  if (unit.kind === 'still') {
    const r = stillRefs(unit, cache);
    return `${imageModel(unit)} · ${unit.params.aspect || '9:16'}${unit.params.size ? ` → ${unit.params.size}px` : ''} · ${r.character.length} character ref(s), ${r.style.length} style ref(s)`;
  }
  if (unit.kind === 'video') {
    const v = videoSettings(unit);
    const s = (id) => units.find((x) => x.id === id)?.output || id;
    return `${v.model} · ${v.aspect} · ${v.duration}s · ${v.resolution}${v.hero ? ' · HERO' : ''}${unit.params.crop ? ` · crop ${unit.params.crop}` : ''}` +
      `${unit.params.fitSeconds ? ` · fit ${unit.params.fitSeconds}s` : ''} · first ${unit.params.firstStill ? s(unit.params.firstStill) : '-'} · last ${unit.params.lastStill ? s(unit.params.lastStill) : '-'}`;
  }
  const v = resolveVoice(unit, cache);
  return `${v.model} · voice ${unit.params.voice} (${v.id || 'id not set'}) · loudnorm · "${voiceText(unit).slice(0, 60)}${voiceText(unit).length > 60 ? '…' : ''}"`;
}

function neededKey(unit) {
  if (unit.kind === 'voice') return 'ELEVENLABS_API_KEY';
  if (unit.kind === 'still' && unit.params.extract) return null;
  return 'GEMINI_API_KEY';
}

async function makeUnit(unit, units, target, cache) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'assets-'));
  try {
    if (unit.kind === 'still' && unit.params.extract) {
      await extractFrame(abs(unit.params.extract.from), unit.params.extract.at, abs(target));
      return;
    }
    if (unit.kind === 'still') {
      const refs = stillRefs(unit, cache);
      const img = await generateImage({ model: imageModel(unit), prompt: composePrompt(unit, units, cache), refs: [...refs.character, ...refs.style], aspect: unit.params.aspect || '9:16' });
      const raw = path.join(tmp, `raw.${img.mimeType?.includes('jpeg') ? 'jpg' : 'png'}`);
      fs.writeFileSync(raw, img.bytes);
      await writeImage(raw, abs(target), { size: unit.params.size });
      return;
    }
    if (unit.kind === 'video') {
      const v = videoSettings(unit);
      const frame = async (id, name) => id && fitFrame(abs(units.find((x) => x.id === id).output), path.join(tmp, `${name}.png`), v.aspect);
      let dots = 0;
      const bytes = await generateVideo({
        model: v.model, prompt: composePrompt(unit, units, cache),
        firstFrame: await frame(unit.params.firstStill, 'first'), lastFrame: v.firstFrameOnly ? undefined : await frame(unit.params.lastStill, 'last'),
        references: unit.params.references, aspect: v.aspect, duration: v.duration, resolution: v.resolution,
        onPoll: () => process.stdout.write(++dots % 6 ? '.' : ' still rendering '),
      });
      if (dots) process.stdout.write('\n');
      const raw = path.join(tmp, 'raw.mp4');
      fs.writeFileSync(raw, bytes);
      await finishVideo(raw, abs(target), { crop: unit.params.crop, size: unit.params.size, fitSeconds: unit.params.fitSeconds });
      const pp = target === unit.output ? posterPaths(unit.output, unit) : takePosterPaths(unit, Number(target.match(/\.take(\d+)\./)[1]));
      await posters(abs(target), { first: pp.first && abs(pp.first), last: pp.last && abs(pp.last) });
      return;
    }
    const voice = resolveVoice(unit, cache);
    const bytes = await synthesize({ voiceId: voice.id, model: voice.model, text: voiceText(unit), settings: voice.settings, pronunciationDictionaries: voice.pronunciationDictionaries });
    const raw = path.join(tmp, 'raw.mp3');
    fs.writeFileSync(raw, bytes);
    await loudnorm(raw, abs(target));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

async function cmdGenerate(rp, args) {
  const cache = new Map();
  const units = expandUnits(rp, loadSpec(rp), cache);
  const jobs = planJobs(rp, units, args);
  const label = args.queue ? 'queued job' : 'missing item';
  if (!jobs.length) { log(`nothing to do: no ${label}s for ${rp}${args.only ? ` matching ${args.only.join(',')}` : ''}.`); return; }

  // Check every runnable job first, so a missing key fails before anything is spent.
  const plan = jobs.map((j) => (j.skip ? j : { ...j, ...checkUnit(j.unit, units, cache) }));
  if (!args.dryRun) {
    const keys = new Set(plan.filter((j) => !j.skip && !j.blocked.length).map((j) => neededKey(j.unit)).filter(Boolean));
    for (const k of keys) requireKey(k);
  }

  log(`${args.dryRun ? 'DRY RUN · ' : ''}${rp} · ${jobs.length} ${label}(s)\n`);
  let made = 0, blocked = 0, failed = 0;
  for (const j of plan) {
    const tag = j.entry ? `#${j.entry.n} ${j.entry.action} ` : '';
    if (j.skip) { log(`- ${tag}${j.entry.itemId || ''}: skipped, ${j.skip}`); blocked++; continue; }
    const { unit } = j;
    const target = j.mode === 'take' || exists(unit.output) ? takePath(unit.output, nextTake(unit)) : unit.output;
    log(`- ${tag}[${unit.kind}] ${unit.id} → ${target}`);
    log(`    ${describe(unit, units, cache)}`);
    for (const w of j.warnings) log(`    note: ${w}`);
    if (j.blocked.length) { for (const b of j.blocked) log(`    BLOCKED: ${b}`); blocked++; continue; }
    if (args.verbose && !unit.params.extract && unit.kind !== 'voice') log('\n' + composePrompt(unit, units, cache).replace(/^/gm, '      ') + '\n');
    if (args.dryRun) continue;
    try {
      await makeUnit(unit, units, target, cache);
      made++;
      if (target !== unit.output) {
        const n = Number(target.match(/\.take(\d+)\./)[1]);
        const takes = [...(unit.takes || []), { take: n, path: target, createdAt: new Date().toISOString(), ...(j.entry ? { queue: j.entry.n, note: j.entry.note || j.entry.description || j.entry.action } : {}) }];
        updateUnit(rp, unit, { takes, status: 'draft' });
      }
      if (j.entry) updateQueueEntry(rp, j.entry.n, { state: 'done', doneAt: new Date().toISOString(), result: target });
      log(`    done: ${target}`);
    } catch (err) {
      if (err instanceof MissingKey) throw err;
      failed++;
      log(`    FAILED: ${err.message}`);
      if (j.entry) updateQueueEntry(rp, j.entry.n, { state: 'failed', error: err.message.slice(0, 300) });
    }
  }
  log(`\n${args.dryRun ? 'would make' : 'made'} ${args.dryRun ? plan.filter((j) => !j.skip && !j.blocked.length).length : made}, blocked/skipped ${blocked}${failed ? `, failed ${failed}` : ''}.`);
  if (failed) process.exitCode = 1;
}

// ---------- main ----------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) return log(USAGE);
  if (args.listVoices) return cmdListVoices();
  const rp = args.positional[0];
  if (!rp) throw new Error(USAGE);
  if (!exists(roleplayPaths(rp).spec)) throw new Error(`no spec at ${roleplayPaths(rp).spec}`);
  if (args.promote) return cmdPromote(rp, ...args.promote);
  if (args.initBoard) return cmdInitBoard(rp);
  if (args.syncFrom) return cmdSyncFrom(rp, args.syncFrom, args.dryRun);
  return cmdGenerate(rp, args);
}

main().catch((err) => {
  console.error(err instanceof MissingKey ? err.message : `error: ${err.message}`);
  process.exit(1);
});
