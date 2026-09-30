/* Results reveal for "Asking for leave".
   To port: OUTCOMES (plain data) + TIMELINE (beats) + playResults(outcome, opts).
   Every motion is a WAAPI animation on transform/opacity. The CSS describes the final
   state, so cancelling every animation *is* the final state: that is how skip works. */
'use strict';

/* ═══ 1. Timeline: every beat of the reveal, in ms at 1× ═══ */
const TIMELINE = [
  // beat      start   dur
  ['enter',       0,   480], // backdrop + header; ring and face spring up, big and centred
  ['slots',     200,   320], // empty star slots pop in as dim outlines, so the eye knows where stars land
  ['star1',     520,   420], // left slot:   star arcs in and lands (at start+dur) | dull star drops, cracks, shatters
  ['star2',     880,   420], // middle slot: same | clock tick (time's up)
  ['star3',    1240,   820], // right slot:  the long beat — the last star hovers in slow motion, then slams
  ['dock',     2300,   420], // ring, face and stars shrink up into the current screen's position
  ['stamp',    2640,   420], // stamp slams below the ring; hits at STAMP_HIT → dust + shake
  ['stats',    2920,   600], // stat tiles rise in and count up (80ms stagger)
  ['cards',    3020,   460], // feedback carousel rises in
  ['dials',    3100,   650], // dials fill on the card in view (and later on the other card, when swiped to)
  ['button',   3260,   360], // CTA rises in, last
];
const BEAT = Object.fromEntries(TIMELINE.map(([name, at, dur]) => [name, { at, dur }]));
const END = Math.max(...TIMELINE.map(([, at, dur]) => at + dur)); // 3750

/* Flight profiles. Fractions are of the flight: arc in → hover → drop onto the slot. */
const FLIGHT = {
  normal: { dur: 420, arc: .74, hang: .8, spin: -540, k0: .5, kH: 1.2, kHang: 1.25 },
  finale: { dur: 820, arc: .5, hang: .8, spin: 720, k0: .45, kH: 1.45, kHang: 1.6 }, // 246ms slow-mo hover
  dull:   { dur: 420, arc: .6, hang: .66, spin: 0, k0: .9, kH: 1.05, kHang: 1.08 },
};
const STAMP_HIT = 0.55;   // point in the stamp beat where it meets the page
const SHATTER_AT = 300;   // ms after a dull star lands that it breaks apart
const CRACK_AT = 110;     // ms after a dull star lands that the crack appears
const TICK_GAP = 260;     // spacing of anticipation pulses and clock ticks
const COUNT_STAGGER = 80;
const DIAL_STAGGER = 70;
const SHIMMER = { every: 2400, sweep: .32, stagger: 110 }; // idle sheen over earned stars after a win
const BIG_DY = 110;       // the big ring sits at least 110px below its docked spot (as in the current screen)…
const BIG_AT = .36;       // …and on tall screens its centre sits 36% of the way down
const DOCK_SCALE = .62;   // docked size, as in the current screen
const REDUCED = { stamp: 200, stats: 320, button: 480, fade: 240, end: 720 }; // fades only

const EASE = {
  out: 'cubic-bezier(.22, 1, .36, 1)',     // enters: instant response, long settle
  move: 'cubic-bezier(.65, 0, .35, 1)',    // on-screen move (the dock)
  slam: 'cubic-bezier(.55, 0, .9, .45)',   // falls: accelerates into the hit
  settle: 'cubic-bezier(.2, .8, .3, 1)',   // after a hit
  burst: 'cubic-bezier(.15, .8, .3, 1)',   // particles fly out fast and drift
};

/* ═══ 2. Outcomes: plain data ═══ */
const FACE = {
  happy: '../../flow-assets/boss-happy-avatar.png',
  neutral: '../../boss.png',
  furious: '../../flow-assets/boss-meter-furious.png',
};
// slots[] is what happens on star1 (left), star2 (middle), star3 (right), filled in that order:
// 'star' arcs in gold · 'crack' drops dull, cracks, shatters · 'miss' waits, then wobbles empty · 'tick'/'tock' clock ticks
// finale: index of the star that gets the long slow-mo flight + confetti (the last one to land on a win).
const OUTCOMES = {
  perfect: {
    label: '3★', theme: 't-gold', stamp: 'You got the day', face: FACE.happy, faceClass: 'happy',
    slots: ['star', 'star', 'star'], finale: 2,
    stats: { messages: 8, words: 81, seconds: 192 },
    cameAcross: { Confident: 88, Clear: 94, Calm: 76 },
    english: { Grammar: 86, Pronunciation: 90, Vocabulary: 84 },
    line: 'the day, the reason, a plan. nothing left to ask.',
    fix: ["my mom's not been well", "my mom hasn't been well"],
    cta: 'See detailed results',
  },
  close: {
    label: 'Close call', theme: 't-lavender', stamp: 'Close call', face: FACE.neutral, faceClass: '',
    slots: ['star', 'star', 'miss'], finale: 1,
    stats: { messages: 12, words: 124, seconds: 260 },
    cameAcross: { Confident: 58, Clear: 52, Calm: 72 },
    english: { Grammar: 68, Pronunciation: 74, Vocabulary: 61 },
    line: "'something's come up' told me nothing.",
    fix: ["is it okay if i'm not here tomorrow?", 'could i take tomorrow off?'],
    cta: 'See detailed results',
  },
  failed: {
    label: 'Mission failed', theme: 't-red', stamp: 'Mission failed', face: FACE.furious, faceClass: 'fail',
    slots: ['crack', 'crack', 'crack'], finale: null,
    stats: { messages: 9, words: 63, seconds: 168 },
    cameAcross: { Confident: 34, Clear: 21, Calm: 46 },
    english: { Grammar: 58, Pronunciation: 64, Vocabulary: 49 },
    line: 'you asked like you expected a no.',
    fix: ['can i not come in tomorrow?', 'could i take tomorrow off?'],
    cta: 'Try again',
  },
  timesup: {
    label: "Time's up", theme: 't-amber', stamp: "Time's up", face: FACE.neutral, faceClass: '',
    slots: ['star', 'tick', 'tock'], finale: null,
    stats: { messages: 10, words: 97, seconds: 300 },
    cameAcross: { Confident: 44, Clear: 27, Calm: 63 },
    english: { Grammar: 72, Pronunciation: 70, Vocabulary: 57 },
    line: 'say it straight. i had to walk out the door.',
    fix: ["so basically what i'm trying to ask is...", 'could i take tomorrow off?'],
    cta: 'Try again',
  },
};
const word = s => (s >= 85 ? 'Great' : s >= 70 ? 'Good' : s >= 45 ? 'Shaky' : 'Weak');
const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const int = n => String(n);

/* ═══ 3. Markup ═══ */
const $ = id => document.getElementById(id);
const phone = $('phone'), cam = $('cam'), screen = $('screen'), fx = $('fx'), track = $('track');
const cards = [...track.children];
const SLOTS = ['left', 'middle', 'right']; // fill order
const CRACK = {
  left: 'M18 7 L20.6 14 L16.8 18.8 L21.4 23.4 L18.6 28.8',
  middle: 'M21 6 L18.6 13.5 L22.4 17.6 L17.8 22.8 L21.2 27.4 L19.4 29 M22.4 17.6 L27 19.2',
  right: 'M23 8 L19.4 15 L23.6 19.4 L19 24.6 L21.6 29.4',
};
const GLOSS = 'M20 8 L23.2 16 L31.4 16.8 L25.4 21.6 L20 19.6 L14.6 21.6 L8.6 16.8 L16.8 16 Z';
const STAR_SVG = cls => `<svg class="star ${cls}" viewBox="0 0 40 40"><use href="#r-star"/>${cls === 'gold' ? `<path class="gloss" d="${GLOSS}"/>` : ''}</svg>`;

function slotHTML(pos, kind) {
  const state = kind === 'star' ? ' earned' : kind === 'crack' ? ' cracked' : '';
  return `<div class="r-slot r-slot-${pos}${state}"><div class="slot-in">
    ${STAR_SVG('empty')}
    <div class="sglow"></div>
    <div class="squash">${STAR_SVG('gold')}<div class="sheen-clip"><i class="sheen"></i></div>${STAR_SVG('dull')}</div>
    <svg class="star crack" viewBox="0 0 40 40"><path class="edge" d="${CRACK[pos]}"/><path class="gap" d="${CRACK[pos]}"/></svg>
    ${STAR_SVG('flash')}
  </div></div>`;
}
function metricHTML(label, score, withWord) {
  return `<div class="metric">
    <div class="dial" data-score="${score}" role="img" aria-label="${label}: ${score} out of 100">
      <span class="dial-half r"><i class="arc"></i></span>
      <span class="dial-half l"><i class="arc"></i></span>
      <i class="dial-cap"></i><i class="dial-head"></i>
      <b class="dial-num">0</b>
    </div>
    <span class="m-name">${label}</span>
    ${withWord ? `<span class="m-word">${word(score)}</span>` : ''}
  </div>`;
}

function render(o) {
  phone.className = 'results-screen ' + o.theme;
  const img = $('avatarImg');
  img.src = o.face;
  img.className = o.faceClass;
  $('quoteFace').src = o.face;
  $('stamp').textContent = o.stamp;
  $('starsWrap').innerHTML = SLOTS.map((pos, i) => slotHTML(pos, o.slots[i])).join('');
  $('stats').querySelectorAll('[data-stat]').forEach(el => {
    const k = el.dataset.stat;
    el.textContent = (k === 'seconds' ? mmss : int)(o.stats[k]);
  });
  $('cameAcross').innerHTML = Object.entries(o.cameAcross).map(([k, v]) => metricHTML(k, v, true)).join('');
  $('english').innerHTML = Object.entries(o.english).map(([k, v]) => metricHTML(k, v, false)).join('');
  $('quoteText').textContent = `"${o.line}"`;
  $('fixWrong').textContent = o.fix[0];
  $('fixRight').textContent = o.fix[1];
  $('cta').textContent = o.cta;
}

/* ═══ 4. Motion helpers ═══ */
let run = null;             // the reveal in progress
const counters = new Set(); // number elements driven by an animation's progress
let extraAnims = [];        // dials and the idle shimmer: outlive the reveal, cancelled on replay

function A(el, frames, { at = 0, dur, ease = 'linear', fill = 'both', iterations = 1 }) {
  const a = el.animate(frames, { duration: dur * run.K, delay: at * run.K, easing: ease, fill, iterations });
  run.anims.push(a);
  return a;
}
function countUp(el, target, fmt, driver) { counters.add({ el, target, fmt, a: driver }); kick(); }

/* Apple-style spring (duration + bounce), sampled into keyframes. */
function springFrames(bounce, toFrame, n = 40) {
  const z = 1 - bounce, w = 2 * Math.PI, wd = w * Math.sqrt(1 - z * z);
  const x = t => 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
  return Array.from({ length: n + 1 }, (_, i) => ({ ...toFrame(i === n ? 1 : x(i / n)), offset: i / n }));
}

const rnd = (a, b) => a + Math.random() * (b - a);
const q = (el, sel) => el.querySelector(sel);
function spawn(cls, w, h, x, y, css = '') {
  const el = document.createElement('i');
  el.className = cls;
  el.style.cssText = `width:${w}px;height:${h}px;margin:${-h / 2}px 0 0 ${-w / 2}px;translate:${x}px ${y}px;${css}`;
  fx.appendChild(el);
  return el;
}
function particle(el, frames, opts) { // hidden until its delay, removed when done
  A(el, frames, { ...opts, fill: 'forwards' }).onfinish = () => el.remove();
}

/* A star's path onto its slot: a quadratic arc from off-card to a hover point above the
   slot, a hover (the slow-motion beat on the finale), then a stretched drop onto the slot.
   Sampled into keyframes so position, spin, scale and stretch share one timeline. */
const PATHS = { // offsets from the slot centre, big-ring pixels
  normal: { left: [[-330, -150], [-170, -380], [0, -48]], middle: [[330, -170], [150, -400], [0, -52]], right: [[330, -150], [170, -380], [0, -48]] },
  finale: { left: [[340, 30], [60, -560], [0, -150]], middle: [[-340, 40], [-40, -560], [0, -160]], right: [[-340, 40], [-60, -560], [0, -150]] },
  dull: { left: [[0, -300], [0, -200], [0, -40]], middle: [[0, -320], [0, -210], [0, -44]], right: [[0, -300], [0, -200], [0, -40]] },
};
const quad = (S, C, H, u) => [0, 1].map(i => (1 - u) ** 2 * S[i] + 2 * (1 - u) * u * C[i] + u * u * H[i]);
const easeOutCubic = u => 1 - (1 - u) ** 3;
function flightAt(prof, [S, C, H], t) {
  const drift = 10;
  if (t <= prof.arc) {
    const u = easeOutCubic(t / prof.arc);
    const [x, y] = quad(S, C, H, u);
    return { x, y, rot: prof.spin * (1 - u), k: prof.k0 + (prof.kH - prof.k0) * u, sx: 1, sy: 1 };
  }
  if (t <= prof.hang) {
    const u = (t - prof.arc) / (prof.hang - prof.arc), e = u * u * (3 - 2 * u);
    return { x: H[0], y: H[1] + drift * e, rot: 0, k: prof.kH + (prof.kHang - prof.kH) * e, sx: 1, sy: 1 };
  }
  const u = (t - prof.hang) / (1 - prof.hang), e = u * u; // accelerate into the slot
  return { x: H[0] * (1 - e), y: (H[1] + drift) * (1 - e), rot: 0, k: prof.kHang + (1 - prof.kHang) * e, sx: 1 - .16 * e, sy: 1 + .24 * e };
}
function flightFrames(prof, path, fade = 1, n = 40) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, f = flightAt(prof, path, t);
    return {
      offset: t,
      transform: `translate(${f.x}px,${f.y}px) rotate(${f.rot}deg) scale(${f.k * f.sx},${f.k * f.sy})`,
      opacity: Math.min(1, t / .08) * (fade === 1 ? 1 : fade * (1 - t)),
    };
  });
}

/* ═══ 5. Effects ═══ */
function burst({ x, y, s }, at, big) {
  const n = big ? 22 : 14, reach = big ? [90, 160] : [55, 100];
  for (let i = 0; i < n; i++) {
    const kind = i % 3, ang = (i / n) * 360 + rnd(-12, 12), d = rnd(...reach);
    const size = kind === 0 ? rnd(7, 12) : kind === 1 ? rnd(16, 26) : rnd(12, 19);
    const el = kind === 1 ? spawn('p-spark', size, 4, x, y) : spawn(kind === 0 ? 'p-dot' : 'p-star', size, size, x, y);
    particle(el, [
      { transform: `rotate(${ang}deg) translateX(${s * .3}px) scale(1)`, opacity: 1 },
      { transform: `rotate(${ang}deg) translateX(${d * .85}px) scale(.8)`, opacity: 1, offset: .55 },
      { transform: `rotate(${ang}deg) translateX(${d}px) scale(.2)`, opacity: 0 },
    ], { at, dur: rnd(520, 780), ease: EASE.burst });
  }
}
function shockwave({ x, y, s }, at, big) {
  particle(spawn('p-ring', s, s, x, y),
    [{ transform: 'scale(.4)', opacity: .95 }, { transform: `scale(${big ? 3.2 : 2.2})`, opacity: 0 }],
    { at, dur: big ? 640 : 480, ease: 'cubic-bezier(.1,.7,.3,1)' });
  particle(spawn('p-bloom', s * 3, s * 3, x, y),
    [{ transform: 'scale(.3)', opacity: .95 }, { transform: 'scale(1.3)', opacity: 0 }],
    { at, dur: big ? 620 : 460, ease: 'cubic-bezier(.2,.7,.3,1)' });
}
function trail(prof, path, origin, at) {
  const steps = prof === FLIGHT.finale ? 16 : 10;
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * prof.arc, f = flightAt(prof, path, t), s = rnd(8, 14);
    particle(spawn('p-trail', s, s, origin.x + f.x, origin.y + f.y),
      [{ transform: 'scale(1)', opacity: .9 }, { transform: 'translateY(12px) scale(.2)', opacity: 0 }],
      { at: at + t * prof.dur, dur: 360, ease: 'ease-out' });
  }
}
function confetti({ x, y }, at) {
  const colors = ['#ffe14d', '#f5b72a', '#b7a6ff', '#7ee8c1', '#ff8fb1', '#ffffff', '#6fb6ff'];
  for (let i = 0; i < 56; i++) {
    const el = spawn('p-conf', rnd(6, 10), rnd(10, 16), x, y, `background:${colors[i % colors.length]}`);
    const dx = rnd(-240, 240), peak = rnd(-300, -80), fall = rnd(420, 640), spin = rnd(-720, 720);
    particle(el, [
      { transform: 'translate(0,0) rotate(0) scaleY(1)', opacity: 1, easing: 'cubic-bezier(.1,.75,.3,1)' },
      { transform: `translate(${dx * .6}px,${peak}px) rotate(${spin * .3}deg) scaleY(.3)`, offset: .25, easing: 'cubic-bezier(.45,0,.9,.6)' },
      { transform: `translate(${dx + rnd(-30, 30)}px,${fall}px) rotate(${spin}deg) scaleY(1)`, opacity: 1, offset: .9 },
      { transform: `translate(${dx}px,${fall + 40}px) rotate(${spin}deg) scaleY(.6)`, opacity: 0 },
    ], { at: at + rnd(0, 140), dur: rnd(1700, 2300) });
  }
  for (let i = 0; i < 16; i++) { // sparkles that twinkle out around the finale
    const s = rnd(10, 18), el = spawn('p-star', s, s, x + rnd(-150, 150), y + rnd(-200, 40));
    particle(el, [{ transform: 'scale(0) rotate(0)', opacity: 1 }, { transform: 'scale(1.2) rotate(90deg)', opacity: 1, offset: .35 }, { transform: 'scale(0) rotate(180deg)', opacity: 0 }],
      { at: at + rnd(80, 700), dur: rnd(500, 800), ease: 'ease-out' });
  }
}
function dust({ x, y, w, h }, at) {
  for (let i = 0; i < 14; i++) {
    const t = i / 13, bottom = i % 2 === 0, s = rnd(22, 42);
    const el = spawn('p-dust', s, s, x - w / 2 + t * w, bottom ? y + h / 2 : y - h / 2);
    particle(el,
      [{ transform: 'translate(0,0) scale(.5)', opacity: .9 },
       { transform: `translate(${(t - .5) * rnd(70, 120)}px,${(bottom ? 1 : -1) * rnd(14, 34)}px) scale(1.6)`, opacity: 0 }],
      { at, dur: rnd(500, 750), ease: 'cubic-bezier(.1,.7,.3,1)' });
  }
}
function shatter({ x, y, s }, at, heavy) {
  const n = heavy ? 16 : 12;
  for (let i = 0; i < n; i++) {
    const w = rnd(8, heavy ? 17 : 13), h = rnd(6, 12), a = (i / n) * Math.PI * 2;
    const ox = Math.cos(a) * s * .22, oy = Math.sin(a) * s * .22;
    const el = spawn('p-shard', w, h, x + ox, y + oy, `clip-path:polygon(0 0,100% ${rnd(10, 60)}%,${rnd(20, 70)}% 100%)`);
    const dx = Math.cos(a) * rnd(24, 60), up = Math.min(0, Math.sin(a) * rnd(20, 40)) - rnd(6, 18), spin = rnd(-320, 320);
    particle(el, [
      { transform: 'translate(0,0) rotate(0)', opacity: 1, easing: 'cubic-bezier(.2,.7,.4,1)' },
      { transform: `translate(${dx * .6}px,${up}px) rotate(${spin * .3}deg)`, opacity: 1, offset: .22, easing: 'cubic-bezier(.5,0,.9,.5)' },
      { transform: `translate(${dx}px,${rnd(150, 240)}px) rotate(${spin}deg)`, opacity: 0 },
    ], { at, dur: rnd(750, 950) });
  }
}
/* Light shake jitters both axes; a heavy thud drops first and settles slowly. */
function shake(at, px, dur, heavy = false) {
  const frames = heavy
    ? [0, 1, -.5, .28, -.12, 0].map((m, i) => ({ transform: `translate(${(i % 2 ? .25 : -.25) * m * px}px,${m * px}px)` }))
    : [0, -1, .8, -.6, .4, -.2, 0].map((m, i) => ({ transform: `translate(${m * px}px,${(i % 2 ? .6 : -.5) * m * px}px)` }));
  A(screen, frames, { at, dur, ease: heavy ? EASE.settle : 'linear', fill: 'none' });
}
/* Camera punch-in towards a point: translate(P·(1−z)) scale(z) zooms about P with origin 0 0. */
function punch({ x, y }, at, z, dur) {
  const t = k => `translate(${x * (1 - k)}px,${y * (1 - k)}px) scale(${k})`;
  A(cam, [{ transform: t(1) }, { transform: t(z), offset: .22 }, { transform: t(1) }], { at, dur, ease: 'ease-out', fill: 'none' });
}
const BIG = k => `translateY(${run.bigDy}px) scale(${k})`;
function ringHit(at, amt, dur, flash = true) {
  A($('avatarWrap'), [{ transform: BIG(1) }, { transform: BIG(1 + amt), offset: .3 }, { transform: BIG(1) }], { at, dur, ease: 'ease-out', fill: 'none' });
  if (flash) A($('ringFlash'), [{ opacity: 0 }, { opacity: .9, offset: .18 }, { opacity: 0 }], { at, dur: 380, ease: 'ease-out', fill: 'none' });
}
function anticipate(slot, at) { // the empty slot pulses: "a star is coming here"
  A(q(slot, '.empty'), [{ transform: 'scale(1)' }, { transform: 'scale(1.16)', offset: .45 }, { transform: 'scale(1)' }], { at, dur: 240, ease: 'ease-in-out', fill: 'none' });
  A(q(slot, '.flash'), [{ opacity: 0 }, { opacity: .7, offset: .45 }, { opacity: 0 }], { at, dur: 240, ease: 'ease-in-out', fill: 'none' });
}
function shimmer(slots, at, list) {
  slots.forEach((slot, i) => {
    const sheen = q(slot, '.sheen');
    const opts = { duration: SHIMMER.every * run.K, delay: (at + i * SHIMMER.stagger) * run.K, iterations: Infinity, easing: 'linear' };
    list.push(sheen.animate([
      { transform: 'translateX(-120%) skewX(-18deg)' },
      { transform: 'translateX(320%) skewX(-18deg)', offset: SHIMMER.sweep, easing: 'ease-in-out' },
      { transform: 'translateX(320%) skewX(-18deg)' },
    ], opts));
  });
}

/* ═══ 6. Slot beats ═══ */
const SLOT_BEAT = {
  star(slot, { at }, pos, i, o) {
    const finale = o.finale === i, prof = finale ? FLIGHT.finale : FLIGHT.normal;
    const path = (finale ? PATHS.finale : PATHS.normal)[SLOTS[i]], land = at + prof.dur;
    const flyer = spawn('flyer', pos.s, pos.s, pos.x, pos.y);
    flyer.innerHTML = STAR_SVG('gold');
    A(flyer, flightFrames(prof, path), { at, dur: prof.dur, fill: 'backwards' }).onfinish = () => flyer.remove();
    A(flyer, [{ opacity: 1 }, { opacity: 0 }], { at: land, dur: 1, fill: 'forwards' });
    [.45, .25].forEach((fade, g) => { // ghost trail
      const ghost = spawn('ghost', pos.s, pos.s, pos.x, pos.y);
      ghost.innerHTML = STAR_SVG('gold');
      particle(ghost, flightFrames(prof, path, fade), { at: at + (g + 1) * 28, dur: prof.dur });
    });
    trail(prof, path, pos, at);
    if (finale) { anticipate(slot, at + prof.arc * prof.dur); anticipate(slot, at + prof.arc * prof.dur + TICK_GAP / 2 + 40); }
    else anticipate(slot, land - TICK_GAP);

    A(q(slot, '.gold'), [{ opacity: 0 }, { opacity: 1 }], { at: land, dur: 1 });
    A(q(slot, '.squash'), [
      { transform: 'scale(1,1)' }, { transform: 'scale(1.32,.7)', offset: .14 }, { transform: 'scale(.88,1.14)', offset: .36 },
      { transform: 'scale(1.06,.95)', offset: .58 }, { transform: 'scale(.98,1.02)', offset: .8 }, { transform: 'scale(1,1)' },
    ], { at: land, dur: finale ? 520 : 420, ease: 'ease-out', fill: 'none' });
    A(q(slot, '.sglow'), [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1.4)', offset: .25 }, { opacity: .45, transform: 'none' }], { at: land, dur: 700, ease: 'ease-out' });
    shockwave(pos, land, finale);
    burst(pos, land, finale);
    ringHit(land, finale ? .05 : .03, finale ? 380 : 300);
    punch(pos, land, finale ? 1.045 : 1.018, finale ? 420 : 280);
    if (finale) {
      confetti(pos, land + 20);
      shake(land + 10, 7, 380);
      shimmer([...document.querySelectorAll('.r-slot.earned')], land + 520, run.anims);
    }
  },
  crack(slot, { at }, pos, i) {
    const last = i === 2, prof = last ? FLIGHT.finale : FLIGHT.dull, path = PATHS.dull[SLOTS[i]], land = at + prof.dur;
    const dullProf = last ? { ...prof, spin: 0, k0: .9, kH: 1.1, kHang: 1.18 } : prof;
    const flyer = spawn('flyer', pos.s, pos.s, pos.x, pos.y);
    flyer.innerHTML = STAR_SVG('dull');
    A(flyer, flightFrames(dullProf, path), { at, dur: prof.dur, fill: 'backwards' }).onfinish = () => flyer.remove();
    A(flyer, [{ opacity: 1 }, { opacity: 0 }], { at: land, dur: 1, fill: 'forwards' });
    anticipate(slot, land - TICK_GAP);

    const dull = q(slot, '.dull');
    A(dull, [{ opacity: 0 }, { opacity: 1 }], { at: land, dur: 1 });
    A(q(slot, '.squash'), [
      { transform: 'scale(1,1)' }, { transform: 'scale(1.36,.64)', offset: .16 }, { transform: 'scale(.95,1.06)', offset: .5 }, { transform: 'scale(1,1)' },
    ], { at: land, dur: 340, ease: 'ease-out', fill: 'none' });
    A(q(slot, '.crack'), [{ opacity: 0, transform: 'scale(1.18)' }, { opacity: 1, transform: 'none' }], { at: land + CRACK_AT, dur: 100, ease: EASE.out });
    A(q(slot, '.slot-in'), [{ transform: 'none' }, { transform: 'translateX(-3px) rotate(-4deg)', offset: .25 }, { transform: 'translateX(3px) rotate(3deg)', offset: .6 }, { transform: 'none' }],
      { at: land + CRACK_AT, dur: 220, ease: 'ease-out', fill: 'none' });
    A(dull, [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.12)' }], { at: land + SHATTER_AT, dur: 90, ease: 'ease-out', fill: 'forwards' });
    shatter(pos, land + SHATTER_AT, last);
    shake(land, last ? 11 : 6, last ? 520 : 400, true);
    ringHit(land, -.025, 340);
    if (last) punch(pos, land, 1.03, 360);
  },
  miss(slot, { at, dur }) {
    const land = at + dur;
    anticipate(slot, land - 2 * TICK_GAP);
    anticipate(slot, land - TICK_GAP);
    A(q(slot, '.slot-in'), [
      { transform: 'rotate(0) translateY(0)' }, { transform: 'rotate(-9deg) translateY(2px)', offset: .2 },
      { transform: 'rotate(7deg) translateY(4px)', offset: .45 }, { transform: 'rotate(-3deg) translateY(4px)', offset: .7 },
      { transform: 'rotate(0) translateY(0)' },
    ], { at: land, dur: 640, ease: 'ease-in-out', fill: 'none' });
  },
  tick(slot, { at, dur }, pos, i, o, ticks = 1) {
    const land = at + dur;
    for (let k = ticks - 1; k >= 0; k--) {
      const t = land - k * TICK_GAP, tock = k === 0 && ticks > 1, a = tock ? 20 : 12;
      A(q(slot, '.slot-in'), [
        { transform: 'rotate(0)' }, { transform: `rotate(${a}deg)`, offset: .1 },
        { transform: `rotate(${-a * .35}deg)`, offset: .35 }, { transform: `rotate(${a * .12}deg)`, offset: .6 }, { transform: 'rotate(0)' },
      ], { at: t, dur: 420, ease: 'ease-out', fill: 'none' });
      A(q(slot, '.flash'), [{ opacity: 0 }, { opacity: 1, offset: .1 }, { opacity: 0 }], { at: t, dur: 420, ease: 'ease-out', fill: 'none' });
      ringHit(t, tock ? .03 : .015, 240, false);
      if (tock) shake(t, 3, 240);
    }
  },
  tock(slot, beat, pos, i, o) { SLOT_BEAT.tick(slot, beat, pos, i, o, 3); }, // after star2's tick: tick, tick, TOCK
};
const STAMP_SHAKE = { // [px, ms, heavy]
  't-gold': [5, 300, false], 't-lavender': [4, 280, false], 't-red': [12, 520, true], 't-amber': [4, 280, false],
};

/* ═══ 7. playResults ═══ */
function playResults(key, { skip = false, reduced = false, speed = 1 } = {}) {
  stop();
  const o = OUTCOMES[key];
  render(o);
  track.scrollLeft = 0;
  run = { o, K: 1 / speed, reduced, anims: [], events: [], live: true, armed: false };

  const clockAnim = A($('clock'), [{ opacity: 1 }, { opacity: 1 }], { dur: skip ? 0 : reduced ? REDUCED.end : END });
  run.clock = clockAnim;
  if (skip) { finish(true); return controller; }
  clockAnim.onfinish = () => finish();

  const stamp = $('stamp'), stats = $('stats'), tiles = [...stats.children];
  const avatarWrap = $('avatarWrap'), starsWrap = $('starsWrap');
  const lift = (el, at, dur, dist = 20) => A(el, [{ opacity: 0, transform: `translateY(${dist}px)` }, { opacity: 1, transform: 'none' }], { at, dur, ease: EASE.out });

  if (reduced) { // straight to the final layout, one group of fades at a time
    const fade = (el, at) => A(el, [{ opacity: 0 }, { opacity: 1 }], { at, dur: REDUCED.fade, ease: 'ease-out' });
    [$('bg'), $('header'), avatarWrap, starsWrap].forEach(el => fade(el, 0));
    fade(stamp, REDUCED.stamp);
    [stats, $('divider'), track, $('dots')].forEach(el => fade(el, REDUCED.stats));
    fade($('ctaWrap'), REDUCED.button);
    cards.forEach(c => fillDials(c, false));
    kick();
    return controller;
  }

  // Measure the big-ring slot positions (phone coordinates) before anything moves.
  const base = phone.getBoundingClientRect();
  const centre = el => {
    const r = el.getBoundingClientRect();
    return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2, w: r.width, h: r.height, s: r.width };
  };
  const slots = [...starsWrap.children];
  run.bigDy = Math.max(BIG_DY, Math.round(base.height * BIG_AT - centre(avatarWrap).y));
  starsWrap.style.transform = BIG(1);
  const pos = slots.map(centre);
  starsWrap.style.transform = '';
  const stampBox = centre(stamp);

  // enter: the ring arrives big and centred, as on the current screen
  A($('bg'), [{ opacity: 0 }, { opacity: 1 }], { dur: 360, ease: 'ease-out' });
  A($('header'), [{ opacity: 0 }, { opacity: 1 }], { dur: 300, ease: 'ease-out' });
  const springIn = springFrames(.3, v => ({ transform: BIG(.8 + .2 * v) }));
  [avatarWrap, starsWrap].forEach(el => {
    A(el, springIn, { at: 40, dur: 560 });
    A(el, [{ opacity: 0 }, { opacity: 1 }], { at: 40, dur: 200, ease: 'ease-out' });
  });

  // empty slots, left → middle → right
  slots.forEach((slot, i) => A(q(slot, '.empty'), [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'none' }],
    { at: BEAT.slots.at + i * 60, dur: BEAT.slots.dur, ease: 'cubic-bezier(.34,1.56,.64,1)' }));

  o.slots.forEach((kind, i) => SLOT_BEAT[kind](slots[i], BEAT[`star${i + 1}`], pos[i], i, o));

  // dock into the current screen's layout (fill forwards only, so it doesn't mask the enter spring)
  [avatarWrap, starsWrap].forEach(el => A(el, [{ transform: BIG(1) }, { transform: `translateY(0) scale(${DOCK_SCALE})` }],
    { at: BEAT.dock.at, dur: BEAT.dock.dur, ease: EASE.move, fill: 'forwards' }));

  // stamp: large and faint, accelerating into the page, then a scale-down impact
  const { at: sAt, dur: sDur } = BEAT.stamp, hit = sAt + sDur * STAMP_HIT;
  A(stamp, [
    { opacity: 0, transform: 'rotate(-7deg) scale(2.6)', easing: EASE.slam },
    { opacity: 1, transform: 'rotate(-7deg) scale(.9)', offset: STAMP_HIT, easing: EASE.settle },
    { opacity: 1, transform: 'rotate(-7deg) scale(1.03)', offset: .8 },
    { opacity: 1, transform: 'rotate(-7deg) scale(1)' },
  ], { at: sAt, dur: sDur });
  dust(stampBox, hit);
  const [px, ms, heavy] = STAMP_SHAKE[o.theme];
  shake(hit, px, ms, heavy);
  punch(stampBox, hit, heavy ? 1.02 : 1.012, 260);

  // stats rise and count up
  const { at: cAt, dur: cDur } = BEAT.stats;
  tiles.forEach((tile, i) => {
    lift(tile, cAt + i * COUNT_STAGGER, 420);
    const num = q(tile, '[data-stat]'), k = num.dataset.stat;
    countUp(num, o.stats[k], k === 'seconds' ? mmss : int,
      A(num, [{ opacity: 1 }, { opacity: 1 }], { at: cAt + i * COUNT_STAGGER, dur: cDur, ease: EASE.out }));
  });
  A($('divider'), [{ opacity: 0 }, { opacity: 1 }], { at: BEAT.cards.at, dur: 300, ease: 'ease-out' });
  lift(track, BEAT.cards.at, BEAT.cards.dur, 24);
  A($('dots'), [{ opacity: 0 }, { opacity: 1 }], { at: BEAT.cards.at + 120, dur: 300, ease: 'ease-out' });
  run.events.push({ at: BEAT.dials.at, fn: () => armDials(true) });
  lift($('ctaWrap'), BEAT.button.at, BEAT.button.dur, 16);

  kick();
  return controller;
}

/* Jump to the final state: every animation cancelled leaves the resting DOM. */
function skipReveal() {
  if (!run?.live) return;
  run.anims.forEach(a => a.cancel());
  fx.replaceChildren();
  finish(true);
}
function finish(skipped = false) {
  if (!run.live) return;
  run.live = false;
  for (const c of counters) if (run.anims.includes(c.a)) { c.el.textContent = c.fmt(c.target); counters.delete(c); }
  armDials(false);
  // a skipped win still gets its idle shimmer (a played one already has it running)
  if (skipped && run.o.finale != null && !run.reduced) shimmer([...document.querySelectorAll('.r-slot.earned')], 400, extraAnims);
}
function stop() {
  if (!run) return;
  run.anims.forEach(a => a.cancel());
  extraAnims.forEach(a => a.cancel());
  extraAnims = [];
  counters.clear();
  fx.replaceChildren();
  run = null;
}
const controller = { skip: skipReveal, get playing() { return !!run?.live; } };

/* One rAF loop: writes counter text and fires timeline events (so seeking works too). */
let looping = false;
function kick() { if (!looping) { looping = true; requestAnimationFrame(loop); } }
function loop() {
  for (const c of counters) {
    const st = c.a.playState;
    if (st === 'idle' || st === 'finished') { c.el.textContent = c.fmt(c.target); counters.delete(c); continue; }
    c.el.textContent = c.fmt(Math.round(c.target * (c.a.effect.getComputedTiming().progress ?? 0)));
  }
  if (run?.live) {
    const t = run.clock.currentTime / run.K;
    for (const e of run.events) if (!e.done && t >= e.at) { e.done = true; e.fn(); }
  }
  if (counters.size || run?.live) requestAnimationFrame(loop);
  else looping = false;
}

/* ═══ 8. Dials: fill when their card is in view, once the reveal has armed them ═══ */
const visible = new Set();
const io = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (e.intersectionRatio >= .6) {
      visible.add(e.target);
      if (run?.armed) fillDials(e.target, !run.reduced);
    } else visible.delete(e.target);
  }
}, { threshold: [0, .6, 1] });
cards.forEach(c => io.observe(c));

function armDials(animate) {
  if (!run || run.armed) return;
  run.armed = true;
  visible.forEach(c => fillDials(c, animate && !run.reduced));
}
function fillDials(card, animate) {
  card.querySelectorAll('.metric').forEach((m, i) => {
    const d = q(m, '.dial');
    if (d.classList.contains('on')) return;
    const score = +d.dataset.score, deg = Math.max(score, 1) * 3.6;
    const [rArc, lArc] = d.querySelectorAll('.arc'), head = q(d, '.dial-head'), num = q(d, '.dial-num');
    const R = 45 + Math.min(deg, 180), L = 45 + Math.max(deg - 180, 0);
    rArc.style.transform = `rotate(${R}deg)`;
    lArc.style.transform = `rotate(${L}deg)`;
    head.style.transform = `rotate(${deg}deg)`;
    d.classList.add('on'); m.classList.add('on');
    num.textContent = score;
    if (!animate) return;
    const K = run.K, at = i * DIAL_STAGGER, dur = BEAT.dials.dur, f = Math.min(deg, 180) / deg;
    const opt = { duration: dur * K, delay: at * K, easing: EASE.out, fill: 'backwards' };
    const driver = num.animate([{ opacity: 1 }, { opacity: 1 }], opt);
    extraAnims.push(
      rArc.animate([{ transform: 'rotate(45deg)' }, { transform: `rotate(${R}deg)`, offset: f }, { transform: `rotate(${R}deg)` }], opt),
      lArc.animate([{ transform: 'rotate(45deg)' }, { transform: 'rotate(45deg)', offset: f }, { transform: `rotate(${L}deg)` }], opt),
      head.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${deg}deg)` }], opt),
      driver,
    );
    const w = q(m, '.m-word');
    if (w) extraAnims.push(w.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240 * K, delay: (at + dur * .5) * K, easing: 'ease-out', fill: 'backwards' }));
    countUp(num, score, int, driver);
  });
}

/* ═══ 9. Carousel: native scroll-snap for touch, pointer drag for mouse, dot taps ═══ */
const dots = [...$('dots').children];
const maxScroll = () => track.scrollWidth - track.clientWidth;
const goTo = i => track.scrollTo({ left: i ? maxScroll() : 0, behavior: 'smooth' });
let shown = 0;
track.addEventListener('scroll', () => {
  const i = track.scrollLeft > maxScroll() / 2 ? 1 : 0;
  if (i === shown) return;
  shown = i;
  dots.forEach((d, j) => d.setAttribute('aria-current', j === i));
}, { passive: true });
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

let drag = null;
track.addEventListener('pointerdown', e => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  drag = { x: e.clientX, left: track.scrollLeft, from: shown, vx: 0, t: e.timeStamp, lx: e.clientX };
  track.setPointerCapture(e.pointerId);
  track.classList.add('dragging');
});
track.addEventListener('pointermove', e => {
  if (!drag) return;
  track.scrollLeft = drag.left - (e.clientX - drag.x);
  const dt = e.timeStamp - drag.t;
  if (dt > 0) drag.vx = (e.clientX - drag.lx) / dt;
  drag.t = e.timeStamp; drag.lx = e.clientX;
});
const endDrag = e => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  let to = drag.from;
  if (dx < -40 || drag.vx < -.4) to = 1;
  else if (dx > 40 || drag.vx > .4) to = 0;
  drag = null;
  track.classList.remove('dragging');
  goTo(to);
};
track.addEventListener('pointerup', endDrag);
track.addEventListener('pointercancel', endDrag);

/* A tap anywhere on the screen during the reveal jumps to the end. */
phone.addEventListener('pointerdown', skipReveal);

/* ═══ 10. Prototype controls ═══ */
const params = new URLSearchParams(location.search);
const ui = {
  outcome: OUTCOMES[params.get('o')] ? params.get('o') : 'perfect',
  slow: params.get('slow') === '1',
  reduced: params.get('rm') === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches,
};
const proto = $('proto'), toggle = $('protoToggle');
function setOpen(open) { proto.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); }
setOpen(params.get('open') === '1' || matchMedia('(min-width: 640px)').matches);
toggle.addEventListener('click', () => setOpen(!proto.classList.contains('open')));

function replay() {
  $('slow').checked = ui.slow;
  $('rm').checked = ui.reduced;
  $('protoLabel').textContent = OUTCOMES[ui.outcome].label;
  document.querySelectorAll('[data-outcome]').forEach(b => b.setAttribute('aria-pressed', b.dataset.outcome === ui.outcome));
  playResults(ui.outcome, { speed: ui.slow ? .25 : 1, reduced: ui.reduced });
}
document.querySelectorAll('[data-outcome]').forEach(b => b.addEventListener('click', () => { ui.outcome = b.dataset.outcome; replay(); }));
$('replay').addEventListener('click', replay);
$('slow').addEventListener('change', e => { ui.slow = e.target.checked; replay(); });
$('rm').addEventListener('change', e => { ui.reduced = e.target.checked; replay(); });
$('cta').addEventListener('click', () => { if (!run?.live && OUTCOMES[ui.outcome].cta === 'Try again') replay(); });

// Hooks for capture scripts: play, freeze at a time, skip.
window.__results = {
  play(o, opts = {}) { ui.outcome = o; Object.assign(ui, opts); replay(); },
  seek(ms) { run?.anims.forEach(a => { a.pause(); a.currentTime = ms * run.K; }); kick(); },
  skip: skipReveal,
  get playing() { return !!run?.live; },
};

// Faces and fonts first, so the stamp is measured in its real font and faces don't pop in mid-reveal.
Promise.all([
  document.fonts.ready,
  ...Object.values(FACE).map(src => { const i = new Image(); i.src = src; return i.decode().catch(() => {}); }),
]).then(replay);
