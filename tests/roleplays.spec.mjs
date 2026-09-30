// Every path of every roleplay: pick it with the presenter chips (behind the
// "Demo" button on a phone), tap the mic each turn, and check the ending.
import { test, expect } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import vm from 'node:vm';
import { openRoleplay, playToResults, readOutcome } from './play.mjs';

const sandbox = { window: {} };
for (const f of readdirSync('roleplays').filter(f => f.endsWith('.js'))) {
  vm.runInNewContext(readFileSync(`roleplays/${f}`, 'utf8'), sandbox);
}
const roleplays = Object.values(sandbox.window.ROLEPLAYS);
// the row's first line is enough to find it (textContent drops the <br>)
const firstLine = html => html.split('<br>')[0].replace(/<[^>]*>/g, '').trim();

for (const rp of roleplays) {
  for (const path of rp.conversation.paths) {
    test(`${rp.title} › ${path.title}`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push(m.text()); });

      const frame = await openRoleplay(page, firstLine(rp.topic.label));
      if (path.id !== rp.conversation.defaultPath) {
        await page.locator('#demoBtn').click();
        await page.locator('.demo-chip', { hasText: path.title }).click();
        await expect(page.locator('#demoChips')).toBeHidden();
      }
      await expect(page.locator(`.demo-chip[data-id="${path.id}"]`)).toHaveClass(/active/);
      await playToResults(frame);
      await page.waitForTimeout(4500);   // let the stars land on the results screen
      const got = await readOutcome(frame);

      const stamp = path.outcome === 'fail' ? 'MISSION FAILED' : path.outcome === 'timeout' ? "TIME'S UP" : null;
      expect(got.stamp).toBe(stamp);
      expect(got.title).toBe(path.title);
      expect(got.stars).toBe(path.stars);
      expect(got.resultStars).toBe(path.stars);
      if (path.outcome !== 'timeout') {
        // the whole script played: every line on screen, the meter where the script leaves it
        expect(got.bot).toBe(path.turns.filter(t => t.who === 'boss').length);
        expect(got.user).toBe(path.turns.filter(t => t.who === 'user' || t.who === 'hint').length);
        expect(got.anger).toBe([...path.turns].reverse().find(t => typeof t.anger === 'number').anger);
      }
      expect(errors).toEqual([]);
    });
  }
}
