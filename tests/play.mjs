// Drives a roleplay the way a presenter does: topic → story → conversation,
// tapping the mic (and Sarah's hint when it appears) every turn.
import { expect } from '@playwright/test';

// A real tap at the element's centre. Playwright's locator.click() scrolls the
// element into view first, which scrolls the overflow:hidden screens and
// shifts every later screenshot, so tap by coordinates instead.
async function tap(page, locator, offset) {
  await locator.waitFor({ state: 'visible' });
  const box = await locator.boundingBox();
  const x = box.x + (offset ? offset.x : box.width / 2);
  const y = box.y + (offset ? offset.y : box.height / 2);
  await page.mouse.click(x, y);
}

export async function openRoleplay(page, topicText, { shots, query = '' } = {}) {
  await page.goto('/index.html' + query);
  if (shots) await shots('topics');
  await tap(page, page.locator('.topic-row', { hasText: topicText }));
  const story = page.frameLocator('#ctx-frame');
  await page.waitForTimeout(800);   // let the view finish sliding in
  const onSlide = () => story.locator('.slide').evaluateAll(els => els.findIndex(e => e.classList.contains('on')));
  for (let t = 0; t < 10 && (await onSlide()) < 0; t++) {
    await tap(page, story.locator('#gate'));
    await page.waitForTimeout(400);
  }
  const slides = await story.locator('.slide').count();
  for (let i = 1; i < slides; i++) {
    await expect.poll(onSlide).toBe(i - 1);
    await page.waitForTimeout(900);
    if (shots) await shots(`story-${i}`);
    // tap the right side until the next slide is on (taps during a transition are ignored)
    for (let t = 0; t < 5 && (await onSlide()) < i; t++) {
      await tap(page, story.locator('#stage'), { x: 330, y: 460 });
      await page.waitForTimeout(500);
    }
  }
  await expect(story.locator('#goalCta.in')).toBeVisible({ timeout: 15_000 });
  if (shots) await shots(`story-${slides}`);
  await tap(page, story.locator('#goalCta'));
  await expect(page.locator('#view-conversation.v-active')).toBeVisible();
  const frame = await waitForFrame(page, /roleplay-conversation/);
  await frame.waitForFunction(() => document.body.classList.contains('path-ui'));
  return frame;
}

async function waitForFrame(page, url) {
  for (let i = 0; i < 100; i++) {
    const f = page.frames().find(fr => url.test(fr.url()));
    if (f) return f;
    await page.waitForTimeout(100);
  }
  throw new Error('conversation frame never loaded');
}

// Taps through the conversation until the results screen shows.
export async function playToResults(frame, { holdMs = 400, onTurn } = {}) {
  const page = frame.page();
  let turns = 0;
  for (let guard = 0; guard < 2000; guard++) {
    const state = await frame.evaluate(() => {
      const q = s => document.querySelector(s);
      if (q('#resultsScreen.show')) return 'results';
      if (q('.hint-launcher.show')) return 'hint';
      if (q('.hint-stage.show')) return 'hint-cta';
      const pill = q('#micPill');
      if (pill.classList.contains('expanded')) return 'recording';
      if (pill.classList.contains('idle') && pill.classList.contains('visible')) return 'mic';
      return 'wait';
    });
    if (state === 'results') return turns;
    if (state === 'hint') await tap(page, frame.locator('.hint-launcher'));
    else if (state === 'hint-cta') { await frame.waitForTimeout(600); await tap(page, frame.locator('.hint-cta')); }
    else if (state === 'mic') { await tap(page, frame.locator('#micPill')); turns++; if (onTurn) await onTurn(turns); }
    else if (state === 'recording') { await frame.waitForTimeout(holdMs); await tap(page, frame.locator('#micPill .pill-confirm')); }
    await frame.waitForTimeout(150);
  }
  throw new Error('never reached the results screen');
}

export async function readOutcome(frame) {
  return frame.evaluate(() => ({
    bot: document.querySelectorAll('#chat .bubble.bot').length,
    user: document.querySelectorAll('#chat .bubble.user').length,
    stars: document.querySelectorAll('#starsTray .star-slot.filled').length,
    resultStars: document.querySelectorAll('#resultsScreen .r-star.on').length,
    stamp: getComputedStyle(document.querySelector('#resultsScreen .r-stamp')).display === 'none'
      ? null : document.querySelector('#resultsScreen .r-stamp').innerText.replace(/\s+/g, ' ').trim(),
    title: document.querySelector('#resultsScreen .r-title').textContent,
    // Leave keeps its anger global; the other roleplays publish the last applied meter value
    anger: typeof ANGER === 'undefined' ? null : ANGER,
    meter: window.METER_VALUE === undefined ? null : window.METER_VALUE,
  }));
}
