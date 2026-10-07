/* ════════════════════════════════════════════════════════════════
   Roleplay file · When a coworker blames you ("The dropped handover")
   Game type: being blamed (you lose when the person who decides turns on you).

   Follows roleplays/asking-for-leave.js, plus the additions in
   .context/plans/roleplay-script-format.md: a `room` meter with two
   faces, `who: 'them'` + `speaker` on every line from the other side,
   events drawn by the app, and a stamp per path. The plan is
   roleplays/being-blamed/setup.md. See GLOSSARY.md for the terms.
   ════════════════════════════════════════════════════════════════ */
(function () {
const OPENING = `honestly, it was never handed over properly.`;

const V = (line) => `media/being-blamed/voice/${line}.mp3`;
const RYAN = 'characters/ryan/sheet/';
const ELENA = 'characters/elena/sheet/';

const roleplay = {
  id: 'being-blamed',
  title: 'When a coworker blames you',
  gameType: 'being-blamed',
  character: 'ryan',

  /* Row on the topics list */
  topic: { label: 'When a coworker<br>blames you', avatar: 'media/being-blamed/stills/topic-avatar.png', bg: '#4a5f7a' },

  /* AI-ready notes: enough for a live AI to play the room and judge the stars.
     Two people speak; each `them` turn names its speaker. */
  ai: {
    personality: {
      ryan: `ryan, a coworker. easy-going, charming, a bit lazy. shifts blame without thinking ("it was never handed over properly"). backs down fast and goes sheepish when calmly shown a fact; gets defensive and pushes back if attacked. casual, lowercase lines.`,
      elena: `elena, your boss's boss. sharp, time-poor, hard to impress. cares about fixes, not blame; has no patience for history or arguing. she asks "is that right?" and always has the last word. short, cool, lowercase lines.`,
    },
    facts: [
      `it's monday morning. elena has called you and ryan into a small meeting room: "someone dropped this. what happened?"`,
      `the urgent request was due friday. it never got done, the deadline was missed, and it cost the team.`,
      `friday was your day off. on thursday at 5:10 pm you sent ryan a written handover note: what was done, what was left, and who to call.`,
      `ryan replied at 5:12 pm: "got it 👍". the note and his reply are on your phone; you can show them.`,
      `ryan tells elena "it was never handed over properly." that isn't true.`,
      `the fix: you'll call the people waiting on it this morning and get it done by noon. next time you'll go through a handover face to face, not only in writing.`,
      `elena cares about fixes, not blame: one calm fact, then the plan.`,
    ],
    stars: [
      { id: 'stay-calm', rule: `stays calm: no "that's a lie!" or "that's not true!", no blaming ryan back, no raised voice. a level first reply counts.` },
      { id: 'one-fact', rule: `corrects the record with one fact: the written handover on thursday at 5:10 and ryan's "got it" reply, optionally offering to show it. ryan's past mistakes or habits don't count, and the fact thrown at ryan as an attack doesn't count.` },
      { id: 'back-to-fix', rule: `brings it back to the fix: what they'll do now (call the people waiting, done by noon) and a clearer handover next time (go through it face to face). both parts are needed.` },
    ],
    lose: `elena's meter drops below 20: she stops listening and decides you're the problem. running out the 60-second clock is a separate, softer ending: elena decides without your side and the blame sticks.`,
  },

  /* Story: scenes play in order, then the face-off and the mission.
     Times are seconds from the start of the scene. No text lives in the videos:
     `cards` are app-drawn phone cards laid over the scene. */
  story: {
    title: 'When a Coworker Blames You',
    scenes: [
      /* Times follow the 6 s clips as cut: your phone lights 0.2–0.8, Ryan's lights 1.0,
         he taps the reply 2.2–3.0, you stand 3.3 and are out of frame by 5.0. */
      { videos: ['media/being-blamed/videos/story-1-handover.mp4'], dur: 6.6,
        cards: [
          { at: 0.9, kind: 'phone', title: 'You → Ryan · Thu 5:10 PM', body: `handover for tomorrow: the urgent request is due friday. what's done, what's left and who to call are all below.`, style: 'left:6%; top:9%; width:88%;' },
          { at: 2.9, kind: 'phone', title: 'Ryan · Thu 5:12 PM', body: 'got it 👍', style: 'right:6%; top:26%; width:54%;' },
        ],
        narrator: { at: 0.2, text: "Thursday, 5:10 PM. Friday's your day off, so you hand the urgent request to Ryan, in writing" },
        cloud: { at: 4.6, text: 'all written down. he\'s got it.', tail: 'bl', style: 'left:7%; top:60%; max-width:270px;' },
        sound: [
          { at: 0, pad: { freqs: [196, 247, 294], level: 0.045 }, id: 'pad' },
          { at: 0.9, whoosh: true },
          { at: 2.9, chime: 660 },
          { at: 3.8, footstep: true }, { at: 4.3, footstep: true },
          { at: 4.9, door: true },
          { at: 6.2, stop: 'pad' },
        ] },
      /* The door swings shut 0.5–1.2, your phone lights 1.6–3.6, you look up 4.0–5.0. */
      { videos: ['media/being-blamed/videos/story-2-monday.mp4'], dur: 6.2, transition: { type: 'fadedark', dur: 400 },
        card: { at: 1.7, kind: 'phone', title: 'Elena · Mon 8:47 AM', body: `the friday request never went out. you and ryan, small meeting room, 9:00.`, style: 'left:6%; top:9%; width:88%;' },
        narrator: { at: 0.2, text: 'Monday. The request never got done. The deadline passed, and it cost the team' },
        cloud: { at: 4.1, text: 'wait... ryan had it.', tail: 'bl', style: 'right:6%; top:40%;' },
        sound: [
          { at: 0, hum: { level: 0.04, freq: 240 }, id: 'hum' },
          { at: 0.5, door: true },
          { at: 1.7, chime: 520 },
          { at: 1.7, stop: 'hum', hard: true },
          { at: 2.1, heartbeat: 1200 },
          { at: 6.0, silence: true },
        ] },
      /* Ryan drops into his chair 0.3–1.2; Elena is close up, eyes on you, 2.0–4.3; wide again from 5.0. */
      { videos: ['media/being-blamed/videos/story-3-room.mp4'], dur: 6.0, transition: { type: 'crossfade', dur: 400 },
        ring: { at: 2.4, style: 'left:40%; top:37%; width:19%; height:13%;' } /* seated Elena, wide shot (clip rebuilt) */,
        narrator: { at: 0.2, text: `Elena, your boss's boss, has you both in: "someone dropped this. what happened?"` },
        cloud: { at: 3.6, text: 'okay. breathe.', tail: 'br', style: 'left:7%; top:60%;' },
        sound: [
          { at: 0, hum: { level: 0.04, freq: 220 }, id: 'hum' },
          { at: 0, ticks: 1000, id: 'tick' },
          { at: 0.3, door: true },
          { at: 0.9, creak: true },
          { at: 5.8, stop: 'hum' }, { at: 5.8, stop: 'tick', hard: true },
        ] },
      /* Ryan shrugs at Elena 0.2–1.0; Elena is close up, cool, 1.8–3.8; wide again, Ryan smug, from 4.3. */
      { videos: ['media/being-blamed/videos/story-4-blame.mp4'], dur: 6.6, transition: { type: 'hardcut', dur: 0 },
        narrator: { at: 0.2, text: 'Ryan answers first: "honestly, it was never handed over properly."' },
        cloud: { at: 2.8, text: 'wait, what?', tail: 'down', style: 'left:50%; transform-origin:center; margin-left:-60px; bottom:20%;' },
        sound: [
          { at: 0, hum: { level: 0.04, freq: 220 }, id: 'hum' },
          { at: 1.6, stop: 'hum', hard: true },
          { at: 1.6, heartbeat: 1100 },
          { at: 6.2, silence: true },
        ] },
    ],
    faceoff: {
      transition: { type: 'hardcut', dur: 0 },
      them: { name: 'ryan', img: RYAN + 'smug.png' },
      you: { name: 'you', img: 'img/you.png' },
      headline: 'YOU <span style="color:var(--yellow)">vs</span> RYAN',
      tagline: 'elena is watching.',
    },
    mission: {
      transition: { type: 'crossfade', dur: 400 },
      goal: 'Goal: Set the record straight and get the room back to the <span class="hl">fix</span>',
      stars: [
        { title: 'stay calm', sub: `no "that's a lie!", keep your voice level` },
        { title: 'correct it with one fact', sub: 'your note and his "got it", nothing more' },
        { title: 'bring it back to the fix', sub: "what you'll do now, and a clearer handover next time" },
      ],
    },
  },

  /* Conversation: the room meter, the clock, the moments, the events, and the paths. */
  conversation: {
    eyebrow: 'Being blamed · The dropped handover',
    opening: OPENING,
    /* bubble avatars come from the meter faces per speaker; this is the fallback */
    avatar: ELENA + 'neutral.png',
    /* Room meter: two faces, each 0–100, high = on your side. You lose when elena < 20.
       A face follows its value (`moods`, first band whose `below` the value is under)
       unless a turn sets `face` for that character; the override holds until the next turn. */
    meter: {
      kind: 'room',
      start: { elena: 60, ryan: 25 },
      idle: { elena: 60, ryan: 25 },
      lead: 'elena',
      lose: { elenaBelow: 20 },
      faces: {
        elena: ELENA + '{face}.png',
        ryan: RYAN + '{face}.png',
      },
      moods: {
        elena: [{ below: 20, face: 'disapproving' }, { below: 50, face: 'skeptical' }, { below: 75, face: 'neutral' }, { below: 101, face: 'interested' }],
        ryan: [{ below: 30, face: 'smug' }, { below: 60, face: 'surprised' }, { below: 101, face: 'sheepish' }],
      },
    },
    clock: {
      seconds: 60,
      hidden: true,   /* no countdown on screen in a meeting: it only decides when Elena moves on */
      /* when it runs out, Elena glances at her phone, decides without your side, and moves on */
      exit: { speaker: 'elena', line: `okay. so the handover wasn't clear. let's make sure that doesn't happen again.`, src: ELENA + 'checks-phone.mp4', poster: ELENA + 'checks-phone-poster.jpg', hold: 4.0, caption: `Moving on.`, audio: V('clock-exit') },
    },
    /* takeover videos from the character sheets: the speaker's face lifts to the centre and plays one */
    moments: {
      'shifts-blame':   { character: 'ryan',  src: RYAN + 'shifts-blame.mp4',   poster: RYAN + 'shifts-blame-poster.jpg',   caption: `Never handed over.` },
      'gets-defensive': { character: 'ryan',  src: RYAN + 'gets-defensive.mp4', poster: RYAN + 'gets-defensive-poster.jpg', hold: 2.0, caption: `I'm lying?` },
      'caught-out':     { character: 'ryan',  src: RYAN + 'caught-out.mp4',     poster: RYAN + 'caught-out-poster.jpg',     hold: 2.0, caption: `Oh... right.` },
      'turns-to-you':   { character: 'elena', src: ELENA + 'turns-to-you.mp4',  poster: ELENA + 'turns-to-you-poster.jpg',  hold: 2.4, caption: `Is that right?` },
      'checks-phone':   { character: 'elena', src: ELENA + 'checks-phone.mp4',  poster: ELENA + 'checks-phone-poster.jpg',  hold: 4.0, caption: `Moving on.` },
    },
    /* app-drawn cards: the room goes quiet for "is that right?"; the phone card pops in when you cite the note.
       `messages` lets the app draw it as a chat on a phone; `body` is the plain fallback. */
    events: {
      'is-that-right': { card: false, title: 'Elena', body: 'is that right?', icon: 'eye' },
      'handover-note': {
        title: 'Your note to Ryan · Thu 5:10 PM',
        body: `handover for tomorrow: the urgent request is due friday. what's done, what's left and who to call are all below.<br><b>Ryan · 5:12 PM:</b> got it 👍`,
        icon: 'phone',
        messages: [
          { from: 'you', time: 'Thu 5:10 PM', text: `handover for tomorrow: the urgent request is due friday. what's done, what's left and who to call are all below.` },
          { from: 'ryan', time: 'Thu 5:12 PM', text: 'got it 👍' },
        ],
      },
    },
    hint: { video: 'flow-assets/sarah-hint.mp4', poster: 'flow-assets/sarah-hint-poster.jpg', avatar: 'flow-assets/av-introduction.png', card: `Corrected it with one fact` },
    defaultPath: 'defensive',
    paths: [
      {
        id: 'defensive', title: 'Got defensive', tag: 'Calls it a lie, attacks Ryan, loses Elena', stars: 0, outcome: 'fail',
        stamp: { text: 'YOU LOOKED<br>DEFENSIVE', color: 'red' },
        turns: [
          { who: 'them', speaker: 'ryan', text: OPENING, mood: `relaxed, shifting the blame`, morph: 'shifts-blame', meter: { elena: 55, ryan: 15 }, audio: V('opening') },
          { who: 'user', text: `what? that's a lie! i <span class="underline-y">was hand over</span> everything to him on thursday!`, meter: { elena: 40, ryan: 12 }, face: { ryan: 'surprised' }, uaudio: V('defensive-u2'), chips: [{ miss: true, label: `called it a lie in front of elena` }], feedback: {
            grammar: { wrong: `i <span class="err">was hand over</span> everything to him.`, right: `i <span class="fix">handed</span> everything <span class="fix">over</span> to him.`, reason: `it's finished, so use the simple past: handed over. no "was" in front of it.` },
            pronunciation: { quote: `that's a <span class="err">lie</span>!`, words: ['lie', 'thursday'] },
            vocabulary: { wrong: `<span class="err">that's a lie!</span>`, right: `<span class="fix">that's not quite how it went.</span>`, from: `that's a lie`, to: `that's not quite how it went` },
            content: { points: [ { ok: false, text: `"Lie" is an attack, even when you're right.` }, { ok: false, text: `Elena needs one fact, not a reaction. Say what you sent and when.` } ] }
          } },
          { who: 'them', speaker: 'elena', text: `hold on. ryan says it wasn't handed over properly. is that right?`, mood: `cool, turning to you`, morph: 'turns-to-you', event: { id: 'is-that-right', at: 'before' }, face: { elena: 'skeptical' }, meter: { elena: 37, ryan: 12 }, audio: V('defensive-t3') },
          { who: 'user', text: `no! he never <span class="underline-y">reads nothing</span>. always he is doing like this, ask anyone!`, tag: `this loses the room`, meter: { elena: 28, ryan: 6 }, face: { ryan: 'defensive' }, uaudio: V('defensive-u4'), chips: [{ miss: true, label: `attacked ryan's habits instead of giving the fact` }], feedback: {
            grammar: { wrong: `he never <span class="err">reads nothing</span>.`, right: `he never <span class="fix">reads anything</span>.`, reason: `"never" is already negative, so use "anything", not "nothing".` },
            pronunciation: { quote: `<span class="err">always</span> he is doing like this.`, words: ['always', 'anyone'] },
            vocabulary: { wrong: `<span class="err">always he is doing like this</span>`, right: `<span class="fix">this has happened before</span>`, from: `always he is doing like this`, to: `this has happened before` },
            content: { points: [ { ok: false, text: `Attacking Ryan turns it into a fight, and Elena stops listening to both of you.` }, { ok: false, text: `You still haven't said what you sent, or when.` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: `whoa. so i'm lying now? come on, that's not fair.`, mood: `stung, digging in`, morph: 'gets-defensive', face: { ryan: 'defensive' }, meter: { elena: 26, ryan: 5 }, audio: V('defensive-t5') },
          { who: 'user', text: `yes! you <span class="underline-y">said me</span> "got it" and then you did nothing!`, meter: { elena: 24, ryan: 5 }, face: { ryan: 'defensive' }, uaudio: V('defensive-u6'), chips: [{ miss: true, label: `threw the right fact at ryan like an attack` }], feedback: {
            grammar: { wrong: `you <span class="err">said me</span> "got it".`, right: `you <span class="fix">replied</span> "got it".`, reason: `"say" can't take a person straight after it. use "told me", or here simply "replied".` },
            pronunciation: { quote: `then you did <span class="err">nothing</span>!`, words: ['nothing', 'said'] },
            vocabulary: { wrong: `<span class="err">you did nothing</span>`, right: `<span class="fix">it didn't get done</span>`, from: `you did nothing`, to: `it didn't get done` },
            content: { points: [ { ok: true, text: `The note and his "got it" is the right fact.` }, { ok: false, text: `Shouted at Ryan, it sounds like an attack. Say it calmly, to Elena.` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: `you sent a text at five o'clock and left for the day. what was i supposed to do?`, mood: `annoyed, pushing back`, face: { ryan: 'annoyed' }, meter: { elena: 23, ryan: 5 }, audio: V('defensive-t7') },
          { who: 'user', text: `that is not my problem! i was <span class="underline-y">in leave</span>, what i can do?`, meter: { elena: 14, ryan: 5 }, face: { ryan: 'annoyed' }, uaudio: V('defensive-u8'), chips: [{ miss: true, label: `said "not my problem" about a missed deadline` }], feedback: {
            grammar: { wrong: `i was <span class="err">in leave</span>, what i can do?`, right: `i was <span class="fix">on leave</span>. what <span class="fix">could i</span> do?`, reason: `you're "on" leave, not "in" leave. and in a question, the verb comes before "i": what could i do?` },
            pronunciation: { quote: `that is not my <span class="err">problem</span>!`, words: ['problem', 'leave'] },
            vocabulary: { wrong: `<span class="err">that is not my problem</span>`, right: `<span class="fix">here's what i'll do now</span>`, from: `not my problem`, to: `here's what i'll do now` },
            content: { points: [ { ok: false, text: `The deadline was missed. "Not my problem" tells Elena you don't care.` }, { ok: false, text: `She wanted a fix. You gave her an argument.` } ] }
          } },
          { who: 'them', speaker: 'elena', text: `stop. i'm not here to referee. i'll talk to you both separately.`, mood: `cold, done with both of you`, face: { elena: 'disapproving' }, meter: { elena: 10, ryan: 5 }, audio: V('defensive-t9') },
        ],
      },
      {
        id: 'silent', title: 'Stayed silent', tag: 'Stays calm but apologizes, lets the blame stick', stars: 1, outcome: 'timeout',
        stamp: { text: 'IT STUCK<br>TO YOU', color: 'amber' },
        turns: [
          { who: 'them', speaker: 'ryan', text: OPENING, mood: `relaxed, shifting the blame`, morph: 'shifts-blame', meter: { elena: 55, ryan: 15 }, audio: V('opening') },
          { who: 'user', text: `oh... sorry, sorry. maybe i <span class="underline-y">was not explain</span> it good.`, meter: { elena: 52, ryan: 18 }, flyStar: 0, card: `Stayed calm`, uaudio: V('silent-u2'), chips: [{ miss: true, label: `apologized for a handover you did right` }], feedback: {
            grammar: { wrong: `maybe i <span class="err">was not explain</span> it good.`, right: `maybe i <span class="fix">didn't explain</span> it <span class="fix">well</span>.`, reason: `in the past, the negative is "didn't" + the base verb. and after a verb, use "well", not "good".` },
            pronunciation: { quote: `oh... <span class="err">sorry</span>, sorry.`, words: ['sorry', 'explain'] },
            vocabulary: { wrong: `<span class="err">sorry, sorry</span>`, right: `<span class="fix">can i add one thing?</span>`, from: `sorry, sorry`, to: `can i add one thing?` },
            content: { points: [ { ok: true, text: `You stayed calm. That part was right.` }, { ok: false, text: `Saying sorry here sounds like you agree the handover was bad. It wasn't.` } ] }
          } },
          { who: 'them', speaker: 'elena', text: `so it wasn't handed over properly? is that right?`, mood: `cool, turning to you`, morph: 'turns-to-you', event: { id: 'is-that-right', at: 'before' }, face: { elena: 'skeptical' }, meter: { elena: 46, ryan: 18 }, timeJump: 40, audio: V('silent-t3') },
          { who: 'user', text: `um... maybe <span class="underline-y">little bit confusion from both side</span>. i don't remember what i wrote exactly.`, meter: { elena: 40, ryan: 22 }, uaudio: V('silent-u4'), chips: [{ miss: true, label: `took half the blame and hid the note on your phone` }], feedback: {
            grammar: { wrong: `maybe <span class="err">little bit confusion from both side</span>.`, right: `maybe <span class="fix">there was a little confusion on both sides</span>.`, reason: `this needs a full sentence with "there was", and "side" becomes "sides" when there's more than one.` },
            pronunciation: { quote: `i don't remember what i wrote <span class="err">exactly</span>.`, words: ['exactly', 'confusion'] },
            vocabulary: { wrong: `<span class="err">i don't remember what i wrote</span>`, right: `<span class="fix">i can show you what i wrote</span>`, from: `i don't remember`, to: `i can show you` },
            content: { points: [ { ok: false, text: `The note is on your phone: Thursday, 5:10, and his "got it". Say it.` }, { ok: false, text: `"Both sides" makes Ryan's version the official one.` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: `yeah, it happens. we're on it now.`, mood: `off the hook, easy again`, face: { ryan: 'casual-grin' }, meter: { elena: 40, ryan: 25 }, timeJump: 15, audio: V('silent-t5') },
          { who: 'user', text: `yes, we will finish it <span class="underline-y">soon as possible</span>. sorry again for the trouble.`, meter: { elena: 36, ryan: 25 }, timeJump: 5, uaudio: V('silent-u6'), chips: [{ miss: true, label: `apologized again, no time and no plan` }], feedback: {
            grammar: { wrong: `we will finish it <span class="err">soon as possible</span>.`, right: `we'll finish it <span class="fix">as soon as possible</span>.`, reason: `the phrase is "as soon as possible". the first "as" can't be dropped.` },
            pronunciation: { quote: `sorry again for the <span class="err">trouble</span>.`, words: ['trouble', 'possible'] },
            vocabulary: { wrong: `<span class="err">as soon as possible</span>`, right: `<span class="fix">by noon today</span>`, from: `soon as possible`, to: `a real time` },
            content: { points: [ { ok: false, text: `No time, no plan. Elena moves on with Ryan's story.` }, { ok: false, text: `You never mentioned the note or his "got it".` } ] }
          } },
          /* the clock runs out here: conversation.clock.exit plays (Elena, checks-phone) */
        ],
      },
      {
        id: 'guided', title: 'Guided', tag: 'Calm start, digs up the past, Sarah steers it back', stars: 2, outcome: 'win',
        stamp: { text: 'CLOSE<br>CALL', color: 'lavender' },
        turns: [
          { who: 'them', speaker: 'ryan', text: OPENING, mood: `relaxed, shifting the blame`, morph: 'shifts-blame', meter: { elena: 55, ryan: 15 }, audio: V('opening') },
          { who: 'user', text: `okay, i hear you. can i add something?`, meter: { elena: 62, ryan: 20 }, flyStar: 0, card: `Stayed calm`, uaudio: V('guided-u2') },
          { who: 'them', speaker: 'elena', text: `go on. so it wasn't handed over properly, is that right?`, mood: `cool, turning to you`, morph: 'turns-to-you', event: { id: 'is-that-right', at: 'before' }, face: { elena: 'skeptical' }, meter: { elena: 58, ryan: 20 }, audio: V('guided-t3') },
          { who: 'user', text: `not exactly. i <span class="underline-y">was give</span> him everything. and last time also, when i was off, same thing happened...`, meter: { elena: 42, ryan: 12 }, face: { ryan: 'defensive' }, uaudio: V('guided-u4'), chips: [{ miss: true, label: `buried the note under "last time"` }], feedback: {
            grammar: { wrong: `i <span class="err">was give</span> him everything.`, right: `i <span class="fix">gave</span> him everything.`, reason: `for a finished action, use the simple past: gave. "was" and "give" don't go together.` },
            pronunciation: { quote: `same thing <span class="err">happened</span>...`, words: ['happened', 'everything'] },
            vocabulary: { wrong: `i <span class="err">gave him everything</span>`, right: `i <span class="fix">left him a written handover</span>`, from: `gave him everything`, to: `a written handover on thursday at 5:10` },
            content: { points: [ { ok: true, text: `"Not exactly" kept it calm.` }, { ok: false, text: `Last time isn't the question. This handover is.` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: `come on, that was months ago. it's got nothing to do with this.`, mood: `stung, defensive`, morph: 'gets-defensive', face: { ryan: 'defensive' }, meter: { elena: 38, ryan: 10 }, audio: V('guided-t5') },
          { who: 'them', speaker: 'elena', text: `i don't need the history. what happened with this one?`, mood: `losing patience`, meter: { elena: 32, ryan: 10 }, audio: V('guided-t6') },
          { who: 'user', text: `what i'm saying is, i <span class="underline-y">explained him</span> everything. he never takes it serious.`, meter: { elena: 22, ryan: 6 }, face: { ryan: 'annoyed' }, uaudio: V('guided-u7'), chips: [{ miss: true, label: `still on ryan's habits, elena is almost gone` }], feedback: {
            grammar: { wrong: `i <span class="err">explained him</span> everything.`, right: `i <span class="fix">explained everything to him</span>.`, reason: `"explain" needs "to" before the person, and the thing comes first: explain something to someone.` },
            pronunciation: { quote: `he never takes it <span class="err">serious</span>.`, words: ['explained', 'seriously'] },
            vocabulary: { wrong: `<span class="err">he never takes it serious</span>`, right: `<span class="fix">he replied "got it"</span>`, from: `he never takes it serious`, to: `what he actually wrote back` },
            content: { points: [ { ok: false, text: `You're judging Ryan. Elena asked what happened.` }, { ok: false, text: `One fact, the note and his reply, would end this in ten seconds.` } ] }
          } },
          { who: 'hint', video: 'sarah-hint', hintText: `don't go over the past. just say when you handed it over, and what he wrote back.`, audio: V('hint'), response: `sorry, let me be clear. i left ryan a written handover on thursday at 5:10, and he replied "got it." i can show you.`, stars: [1], card: `Corrected it with one fact`, event: { id: 'handover-note', at: 'after' }, meter: { elena: 52, ryan: 40 }, face: { ryan: 'surprised' }, uaudio: V('guided-u8') },
          { who: 'them', speaker: 'ryan', text: `oh... right. i did say that. that one's on me.`, mood: `caught out, backing down`, morph: 'caught-out', face: { ryan: 'sheepish' }, meter: { elena: 56, ryan: 64 }, audio: V('guided-t9') },
          { who: 'them', speaker: 'elena', text: `okay. so what happens now?`, mood: `moving on, still cool`, meter: { elena: 56, ryan: 64 }, audio: V('guided-t10') },
          { who: 'user', text: `i'll call them this morning and get it done by noon.`, meter: { elena: 64, ryan: 66 }, uaudio: V('guided-u11') },
          { who: 'them', speaker: 'elena', text: `okay, noon. next time, lead with the note.`, mood: `satisfied, but noting it`, meter: { elena: 66, ryan: 66 }, audio: V('guided-t12') },
        ],
      },
      {
        id: 'perfect', title: 'Perfect', tag: 'Calm, one fact, then the fix', stars: 3, outcome: 'win',
        stamp: { text: 'RECORD<br>CORRECTED', color: 'gold' },
        turns: [
          { who: 'them', speaker: 'ryan', text: OPENING, mood: `relaxed, shifting the blame`, morph: 'shifts-blame', meter: { elena: 55, ryan: 15 }, audio: V('opening') },
          { who: 'user', text: `i hear you, ryan. can i add one thing?`, meter: { elena: 64, ryan: 22 }, flyStar: 0, card: `Stayed calm`, uaudio: V('perfect-u2') },
          { who: 'them', speaker: 'elena', text: `go ahead. is that right?`, mood: `cool, turning to you`, morph: 'turns-to-you', event: { id: 'is-that-right', at: 'before' }, face: { elena: 'skeptical' }, meter: { elena: 60, ryan: 22 }, audio: V('perfect-t3') },
          { who: 'user', text: `not quite. i left ryan a written handover on thursday at 5:10, and he replied "got it." i can show you.`, meter: { elena: 76, ryan: 42 }, face: { ryan: 'surprised' }, flyStar: 1, card: `Corrected it with one fact`, event: { id: 'handover-note', at: 'after' }, uaudio: V('perfect-u4') },
          { who: 'them', speaker: 'ryan', text: `oh... yeah, i did say that. i thought it could wait till monday.`, mood: `caught out, sheepish`, morph: 'caught-out', face: { ryan: 'sheepish' }, meter: { elena: 74, ryan: 66 }, audio: V('perfect-t5') },
          { who: 'them', speaker: 'elena', text: `okay. so where does that leave us?`, mood: `moving on, all business`, meter: { elena: 76, ryan: 66 }, audio: V('perfect-t6') },
          { who: 'user', text: `i'll call them this morning and get it done by noon. and next time, i'll go through the handover face to face.`, meter: { elena: 88, ryan: 72 }, flyStar: 2, card: `Brought it back to the fix`, uaudio: V('perfect-u7') },
          { who: 'them', speaker: 'ryan', text: `and i should've asked if it wasn't clear. i'll help you finish it.`, mood: `owning his part, quietly`, face: { ryan: 'sheepish' }, meter: { elena: 90, ryan: 80 }, audio: V('perfect-t8') },
          { who: 'them', speaker: 'elena', text: `good. noon, then. and from now on, handovers get talked through, not just written.`, mood: `impressed, closing it out`, meter: { elena: 92, ryan: 80 }, audio: V('perfect-t9') },
        ],
      },
    ],
  },

  /* The ring face is Elena's: she decides, so the lesson is how she sees you. */
  results: {
    faces: { fail: ELENA + 'disapproving.png', win: ELENA + 'interested.png', neutral: ELENA + 'neutral.png' },
  },
};

(window.ROLEPLAYS = window.ROLEPLAYS || {})[roleplay.id] = roleplay;
})();
