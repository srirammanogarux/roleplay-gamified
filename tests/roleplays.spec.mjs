// Every path of every roleplay: pick it with the presenter chips (behind the
// "Demo" button on a phone), tap the mic each turn, and check the ending.
// What is checked follows .context/plans/engine-contract.md ("What the tests observe").
import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import vm from 'node:vm';
import { openRoleplay, playToResults, readOutcome } from './play.mjs';

const sandbox = { window: {} };
for (const f of readdirSync('roleplays').filter(f => f.endsWith('.js'))) {
  vm.runInNewContext(readFileSync(`roleplays/${f}`, 'utf8'), sandbox);
}
const ORDER = ['asking-for-leave', 'saying-no', 'your-mistake', 'small-talk', 'being-blamed'];
const roleplays = Object.values(sandbox.window.ROLEPLAYS)
  .sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
// the row's first line is enough to find it (textContent drops the <br>)
const firstLine = html => html.split('<br>')[0].replace(/<[^>]*>/g, '').trim();

// Asking for leave keeps its old format and its old results stamp.
const isLeave = rp => rp.id === 'asking-for-leave';
const expectedStamp = (rp, path) => isLeave(rp)
  ? (path.outcome === 'fail' ? 'MISSION FAILED' : path.outcome === 'timeout' ? "TIME'S UP" : null)
  : path.stamp.text.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim();
// the meter value the script leaves behind (rooms compare Elena's bar)
const lastMeter = (rp, path) => {
  const key = isLeave(rp) ? 'anger' : 'meter';
  const v = [...path.turns].reverse().find(t => t[key] !== undefined)[key];
  return typeof v === 'object' ? v.elena : v;
};

for (const rp of roleplays) {
  for (const path of rp.conversation.paths) {
    test(`${rp.title} › ${path.title}`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push(m.text()); });

      const frame = await openRoleplay(page, firstLine(rp.topic.label));
      if (path.id !== rp.conversation.defaultPath) {
        await page.locator('#demoBtn').click();
        await page.locator(`.demo-chip[data-id="${path.id}"]`).click();
        await expect(page.locator('#demoChips')).toBeHidden();
      }
      await expect(page.locator(`.demo-chip[data-id="${path.id}"]`)).toHaveClass(/active/);
      await playToResults(frame);
      await page.waitForTimeout(4500);   // let the stars land on the results screen
      const got = await readOutcome(frame);

      expect(got.stamp).toBe(expectedStamp(rp, path));
      expect(got.title).toBe(path.title);
      expect(got.stars).toBe(path.stars);
      expect(got.resultStars).toBe(path.stars);
      if (path.outcome !== 'timeout') {
        // the whole script played: every line on screen, the meter where the script leaves it
        expect(got.bot).toBe(path.turns.filter(t => t.who === 'them' || t.who === 'boss').length);
        expect(got.user).toBe(path.turns.filter(t => t.who === 'user' || t.who === 'hint').length);
        expect(isLeave(rp) ? got.anger : got.meter).toBe(lastMeter(rp, path));
      }
      expect(errors).toEqual([]);
    });
  }
}
