// Records screenshots of every screen of Asking for leave, to compare before/after a change:
//   SHOTS_DIR=.context/before npx playwright test tests/screenshots.spec.mjs
import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { openRoleplay, playToResults, readOutcome } from './play.mjs';

const dir = process.env.SHOTS_DIR;
test.skip(!dir, 'set SHOTS_DIR to record screenshots');

test('asking for leave, auto-played path', async ({ page }) => {
  mkdirSync(dir, { recursive: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const shots = name => page.screenshot({ path: `${dir}/${name}.png` });
  const frame = await openRoleplay(page, 'Asking for leave', { shots });
  await page.waitForTimeout(1500);
  await shots('conversation-start');
  await playToResults(frame, { onTurn: async n => { if (n === 2) await shots('conversation-turn2'); } });
  await page.waitForTimeout(7000);
  await shots('results');
  const outcome = await readOutcome(frame);
  console.log(JSON.stringify(outcome));
  expect(errors).toEqual([]);
});
