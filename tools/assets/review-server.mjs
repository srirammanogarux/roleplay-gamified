#!/usr/bin/env node
// Review page server. No dependencies, localhost only, never generates anything.
//   node tools/assets/review-server.mjs [--port 4178]
// then open http://localhost:4178/
//
// Serves the repo read-only (dotfiles such as .env are never served) plus a small JSON API:
//   GET  /api/roleplays
//   GET  /api/roleplay/<id>          items in story order, queue, shared rules
//   POST /api/roleplay/<id>/queue    { action, itemId, note?, prompt?, description? }  → appends to queue.json

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT, abs, exists, listRoleplays, loadSpec, expandUnits, updateUnit, findUnit, promptOwner, posterPaths,
  loadQueue, appendQueue, QUEUE_ACTIONS, checkRoleplayId, voiceText,
} from './lib/spec.mjs';
import { STILL_RULES, VIDEO_RULES, SHEET_RULES } from './config.mjs';

const portArg = process.argv.indexOf('--port');
const PORT = Number(portArg > -1 ? process.argv[portArg + 1] : process.env.PORT || 4178);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
};

function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}

const mtime = (p) => (exists(p) ? Math.round(fs.statSync(abs(p)).mtimeMs) : null);

function roleplayView(rp) {
  const spec = loadSpec(rp);
  const units = expandUnits(rp, spec);
  return {
    id: rp,
    title: spec.title,
    note: spec.note,
    playlists: spec.playlists || {},
    rules: { still: STILL_RULES, video: VIDEO_RULES, sheet: SHEET_RULES },
    items: units.map((u) => ({
      id: u.id, kind: u.kind, scene: u.scene, summary: u.summary, status: u.status, characters: u.characters || [],
      prompt: u.kind === 'voice' ? voiceText(u) : u.prompt, params: u.params, output: u.output,
      exists: exists(u.output), version: mtime(u.output), owner: promptOwner(u, units),
      poster: u.kind === 'video' && exists(posterPaths(u.output, u).first) ? posterPaths(u.output, u).first : null,
      takes: (u.takes || []).map((t) => ({ ...t, exists: exists(t.path), version: mtime(t.path) })),
    })),
    queue: loadQueue(rp).entries,
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e6) reject(new Error('body too large')); });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { reject(new Error('body is not JSON')); } });
  });
}

const clean = (s, max = 8000) => (typeof s === 'string' ? s.trim().slice(0, max) : '');

async function queueAction(rp, body) {
  const action = body.action;
  if (!QUEUE_ACTIONS.includes(action)) throw Object.assign(new Error(`action must be one of ${QUEUE_ACTIONS.join(', ')}`), { status: 400 });
  const units = expandUnits(rp);
  const unit = findUnit(units, body.itemId);
  const entry = { action, itemId: unit.id };

  if (action === 'redo') {
    entry.note = clean(body.note, 1000);
    if (!entry.note) throw Object.assign(new Error('say what to fix'), { status: 400 });
    updateUnit(rp, unit, { status: `redo:${entry.note}` });
  }
  if (action === 'improve-prompt') {
    const prompt = clean(body.prompt);
    if (!prompt) throw Object.assign(new Error('prompt is empty'), { status: 400 });
    if (promptOwner(unit, units) === 'paper') throw Object.assign(new Error('Paper owns this prompt until its video exists: edit it on the Paper board'), { status: 409 });
    if (unit.kind === 'voice') {
      const m = prompt.match(/^(\[[^\]]+\])\s*(.*)$/s);
      const params = { ...unit.params, text: m ? m[2] : prompt };
      if (m) params.emotion = m[1]; else delete params.emotion;
      entry.previous = voiceText(unit);
      if (unit.source.type === 'spec') updateUnit(rp, unit, { params });
    } else {
      entry.previous = unit.prompt;
      updateUnit(rp, unit, { prompt });
    }
    entry.prompt = prompt;
  }
  if (action === 'replace' || action === 'add-scene') {
    entry.description = clean(body.description, 2000);
    if (!entry.description) throw Object.assign(new Error('describe the new thing'), { status: 400 });
    if (action === 'add-scene') { entry.after = unit.id; delete entry.itemId; }
  }
  return appendQueue(rp, entry);
}

function serveFile(req, res, urlPath) {
  const rel = decodeURIComponent(urlPath).replace(/^\/+/, '');
  if (rel.split('/').some((seg) => seg.startsWith('.') || seg === 'node_modules')) return send(res, 404, 'not found', 'text/plain');
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return send(res, 404, 'not found', 'text/plain');
  const size = fs.statSync(file).size;
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? Number(range[1]) : size - Number(range[2]);
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start >= size || start > end) { res.writeHead(416, { 'Content-Range': `bytes */${size}` }); return res.end(); }
    res.writeHead(206, { 'Content-Type': type, 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/') { res.writeHead(302, { Location: '/tools/assets/review.html' }); return res.end(); }
    if (url.pathname === '/api/roleplays' && req.method === 'GET') return send(res, 200, listRoleplays());
    const m = url.pathname.match(/^\/api\/roleplay\/([^/]+)(\/queue)?$/);
    if (m) {
      const rp = checkRoleplayId(m[1]);
      if (!m[2] && req.method === 'GET') return send(res, 200, roleplayView(rp));
      if (m[2] && req.method === 'POST') {
        const entry = await queueAction(rp, await readBody(req));
        return send(res, 200, { entry, view: roleplayView(rp) });
      }
      return send(res, 405, { error: 'method not allowed' });
    }
    if (url.pathname.startsWith('/api/')) return send(res, 404, { error: 'unknown endpoint' });
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'method not allowed', 'text/plain');
    return serveFile(req, res, url.pathname);
  } catch (err) {
    return send(res, err.status || (/not found|no item/.test(err.message) ? 404 : /bad roleplay id/.test(err.message) ? 400 : 500), { error: err.message });
  }
});

server.listen(PORT, '127.0.0.1', () => console.log(`review page: http://localhost:${PORT}/  (Ctrl+C to stop)`));
