/* ════════════════════════════════════════════════════════════════
   Roleplay file · Telling your boss about your mistake
   Game type: confessing (you lose if he finds out first, or if he
   stops trusting you).

   The words and rules of one roleplay. The screens (story, conversation,
   results) read everything roleplay-specific from here; the engine stays
   the same for every roleplay. See GLOSSARY.md for the terms and
   .context/plans/roleplay-script-format.md for the fields that are new
   since Leave (meter kind, speaker, event, stamp).
   ════════════════════════════════════════════════════════════════ */
(function () {
const OPENING = `long week. tell me this is good news. linda park is calling me in 5 minutes.`;
const V = (id) => `media/your-mistake/voice/${id}.mp3`;
const SHEET = 'characters/marcus/sheet';

const roleplay = {
  id: 'your-mistake',
  title: 'Telling your boss about your mistake',
  gameType: 'confessing',
  character: 'marcus',

  /* Row on the topics list */
  topic: { label: 'Telling your boss about<br>your mistake', avatar: 'media/your-mistake/stills/av-your-mistake.png', bg: '#6b4b4b' },

  /* AI-ready notes: enough for a live AI to play Marcus and judge the stars.
     The scripted paths below double as example answers for that judge. */
  ai: {
    personality: `marcus, the boss. busy, blunt, short on patience, and on a call with an important customer at noon. hates surprises more than mistakes. respects people who say it plainly, own it and bring the fix. goes cold at excuses, blame and anything that sounds like hiding it. speaks in short, clipped, lowercase lines.`,
    facts: [
      `it's 11:55. at 12:00 linda park, one of the team's most important customers, calls marcus.`,
      `yesterday you promised linda you'd send her the confirmed details by end of day. you forgot. nothing went out.`,
      `this morning her follow-up landed in your inbox: "still waiting on the details you promised yesterday?"`,
      `you've already sent her the confirmed details now, with a short apology. she has everything.`,
      `marcus hates surprises more than mistakes.`,
      `just before the call, linda messages marcus: "i was promised the details yesterday. they only came this morning."`,
    ],
    stars: [
      { id: 'say-first', rule: `tells him plainly, on their own and before linda's message lands: you promised linda the confirmed details by end of day yesterday, and they didn't go out. shrinking it ("a little late", "a small timing thing") or making him drag it out doesn't count.` },
      { id: 'own-it', rule: `says it's their mistake in plain words ("i forgot", "that's on me") with no excuses: no blaming a busy day, the system, or the customer for not reminding them.` },
      { id: 'bring-fix', rule: `tells him the details are already sent and linda has everything now. a line he can open the call with makes it stronger.` },
    ],
    lose: `the trust meter reaches 0 (he takes you off the account), or the clock runs out and linda's message tells him before you do.`,
  },

  /* Story: scenes play in order, then the face-off and the mission.
     Times are seconds from the start of the scene. Sound cues use the
     story screen's small sound library (hum, pad, ticks, whoosh, …).
     Videos never show text: the laptop shows abstract shapes only, and
     linda's follow-up is an app-drawn `card` over scene 1. */
  story: {
    title: 'Telling Your Boss About Your Mistake',
    scenes: [
      /* Each clip is 6.0 s (generated at 8 s, retimed); times below are read
         off the real clips. A scene runs at most ~0.5 s past its video. */
      /* 1.6 s the blue bar slides in · 3.5 s the glance up at the clock · 4.5 s leans in */
      { videos: ['media/your-mistake/videos/story-1-inbox.mp4'], dur: 6.5,
        narrator: { at: 0.4, text: '11:50. Linda Park, one of your biggest customers, just wrote to you' },
        card: { at: 1.6, kind: 'email', icon: 'mail', title: 'Linda Park', body: '<b>Following up</b><br>still waiting on the details you promised yesterday?', style: 'left:8%; right:8%; top:30%;' },
        /* the wall clock, upper right of the shot */
        ring: { at: 3.5, style: 'left:62%; top:8%; width:30%; height:17%;' },
        cloud: { at: 4.6, text: 'yesterday...?', tail: 'bl', style: 'left:52%; top:52%;' },
        sound: [
          { at: 0, hum: { level: 0.05, freq: 280 }, id: 'hum' },
          { at: 0, ticks: 1000, id: 'tick' },
          { at: 1.6, chime: 660 },
          { at: 6.0, stop: 'tick', hard: true },
        ] },
      /* 0.8–2.3 s the hand goes to the sticky note · 2.5 s the push-in starts and the light cools · 3.5 s frozen on the note */
      { videos: ['media/your-mistake/videos/story-2-forgot.mp4'], dur: 6.0, transition: { type: 'crossfade', dur: 400 },
        narrator: { at: 0.4, text: 'Yesterday you promised her the confirmed details by end of day. You forgot' },
        cloud: { at: 3.5, text: 'oh no. no no no.', tail: 'bl', style: 'right:8%; top:22%;' },
        sound: [
          { at: 0, hum: { level: 0.05, freq: 280 }, id: 'hum' },
          { at: 2.5, whoosh: true },
          { at: 2.5, stop: 'hum', hard: true },
          { at: 2.7, heartbeat: 1000, id: 'heart' },
          { at: 5.5, stop: 'heart' },
        ] },
      /* 1.5 s the last tap (sent) · 1.8–3.3 s the look across at Marcus · 4.2 s back to typing */
      { videos: ['media/your-mistake/videos/story-3-sent.mp4'], dur: 6.2, transition: { type: 'fadedark', dur: 400 },
        narrator: { at: 0.4, text: "You've just sent them. But she's calling your boss at noon" },
        cloud: { at: 3.0, text: "maybe she won't bring it up...?", tail: 'br', style: 'left:5%; top:37%; max-width:180px;' },
        sound: [
          { at: 0, pad: { freqs: [174, 220, 262], level: 0.045 }, id: 'pad' },
          { at: 0, ticks: 700, id: 'tick' },
          { at: 1.5, whoosh: true },
          { at: 1.8, stop: 'tick' },
          { at: 1.8, ticks: 420, id: 'fast' },
          { at: 5.8, stop: 'fast', hard: true }, { at: 5.8, stop: 'pad' },
        ] },
      /* two clips stitched on the door frame: the walk's last frame (6.0 s) is the door clip's first.
         walk 0–4.7 s · 5.3 s the door starts to open · 6.0 s door clip · 9.9 s Marcus looks up */
      { videos: ['media/your-mistake/videos/story-4a-walk.mp4', 'media/your-mistake/videos/story-4b-door.mp4'], stitchAt: 6.0, dur: 12.6, transition: { type: 'fade', dur: 300 },
        narrator: { at: 0.4, text: 'Your boss hates surprises more than mistakes' },
        cloud: { at: 10.4, text: "he's going to kill me.", tail: 'down', style: 'left:50%; transform-origin:center; margin-left:-80px; bottom:22%;' },
        sound: [
          { at: 0, hum: { level: 0.04, freq: 240 }, id: 'floor' },
          { at: 0.8, footstep: true }, { at: 1.6, footstep: true }, { at: 2.4, footstep: true }, { at: 3.2, footstep: true }, { at: 4.0, footstep: true },
          { at: 5.3, door: true }, { at: 5.3, stop: 'floor' },
          { at: 9.9, silence: true },
        ] },
    ],
    faceoff: {
      transition: { type: 'hardcut', dur: 0 },
      them: { name: 'the boss', img: 'img/boss-goal.png' },
      you: { name: 'you', img: 'img/you.png' },
      headline: 'YOU <span style="color:var(--yellow)">vs</span> THE BOSS',
      tagline: 'tell him. before she does.',
    },
    mission: {
      transition: { type: 'crossfade', dur: 400 },
      goal: 'Goal: Tell him what you forgot and walk out with his <span class="hl">trust</span>',
      stars: [
        { title: 'say it first', sub: "tell him before the customer's message does" },
        { title: 'own it', sub: 'say "i forgot", no excuses' },
        { title: 'bring the fix', sub: "it's sent now, give him a line for the call" },
      ],
      clock: 'the customer calls him at noon, you have <b>5 minutes</b> to tell him',
    },
  },

  /* Conversation: the meter, the clock, the event, the character's moments, and the paths. */
  conversation: {
    eyebrow: 'Your mistake · Confessing',
    opening: OPENING,
    avatar: 'boss.png',
    /* Trust: high is good, lose at 0. Drains while the mic waits on you,
       until you've said what's wrong (a turn marked `confessed`), then the
       drain stops. The gauge can run it as anger = 100 − trust. */
    meter: {
      kind: 'trust',
      label: 'his trust',
      start: 70,
      idle: 70,
      /* about 2 points every 10 s of clock while you stall */
      drainPerSecond: 0.2,
      drainWhile: 'mic-waiting',
      drainUntil: 'confessed',
      lose: { at0: 'off-the-account' },
      faces: { marcus: 'flow-assets/boss-meter-{face}.png' },
      /* which face shows for a meter value (upper bound inclusive): high trust reads calm/approving, low reads angry/furious */
      bands: [
        { to: 15, face: 'furious' },
        { to: 35, face: 'angry' },
        { to: 55, face: 'irritated' },
        { to: 80, face: 'calm' },
        { to: 100, face: 'approving' },
      ],
    },
    clock: {
      seconds: 300, startsAt: '11:55',
      hidden: true,   /* no clock on screen: the noon call only decides when linda's email reaches him first */
      /* when it runs out, linda's message reaches him before you do */
      exit: { event: 'phone-email', line: `"they only came this morning." ...were you going to tell me?`, audio: V('timesup-t9'), src: `${SHEET}/reads-phone.mp4`, poster: `${SHEET}/reads-phone-poster.jpg`, hold: 3.6, caption: `This morning?` },
    },
    /* surprise moments, drawn by the app over the video (never text in a video) */
    events: {
      'phone-email': {
        title: 'Linda Park · customer',
        body: `<b>Before our call</b><br>i was promised the details yesterday. they only came this morning. can we talk about it at noon?`,
        icon: 'mail',
      },
    },
    /* takeover videos: the meter's face lifts to the centre and plays one */
    moments: {
      greeting:      { src: 'flow-assets/boss-intro.mp4', poster: 'flow-assets/boss-intro-poster.jpg', caption: `Hello there!` },
      angry:         { src: 'flow-assets/boss-angry.mp4', poster: 'flow-assets/boss-angry-poster.jpg', hold: 2.0, caption: `Not your fault?` },
      kickout:       { src: 'flow-assets/boss-kickout.mp4', poster: 'flow-assets/boss-kickout-poster.jpg', hold: 4.6, caption: `You're off the account.` },
      'goes-steely': { src: `${SHEET}/goes-steely.mp4`, poster: `${SHEET}/goes-steely-poster.jpg`, hold: 2.0, caption: `Yesterday?` },
      'reads-phone': { src: `${SHEET}/reads-phone.mp4`, poster: `${SHEET}/reads-phone-poster.jpg`, hold: 2.4, caption: `It's linda.` },
      exhale:        { src: `${SHEET}/exhale.mp4`, poster: `${SHEET}/exhale-poster.jpg`, hold: 1.6, caption: `Okay.` },
    },
    hint: { video: 'flow-assets/sarah-hint.mp4', poster: 'flow-assets/sarah-hint-poster.jpg', avatar: 'flow-assets/av-introduction.png', card: `Owned it, no excuses` },
    defaultPath: 'excuses',
    paths: [
      {
        id: 'excuses', title: 'Made excuses', tag: 'Shrinks it, blames a busy day, loses the account', stars: 0, outcome: 'fail',
        stamp: { text: 'OFF THE ACCOUNT', color: 'red' },
        turns: [
          { who: 'them', speaker: 'marcus', text: OPENING, mood: `busy, hoping for good news`, morph: 'greeting', meter: 68, audio: V('opening') },
          { who: 'user', text: `yes, mostly! one small thing. linda's details went out a little bit late, but she won't <span class="underline-y">mind probably</span>.`, meter: 52, uaudio: V('excuses-u2'), chips: [{ miss: true, label: `shrank the mistake` }], feedback: {
            grammar: { wrong: `she won't <span class="err">mind probably</span>.`, right: `she <span class="fix">probably won't mind</span>.`, reason: `"probably" goes before "won't": "she probably won't mind".` },
            pronunciation: { quote: `she won't mind <span class="err">probably</span>.`, words: ['probably', 'little'] },
            vocabulary: { wrong: `a little bit <span class="err">late</span>`, right: `<span class="fix">a day late</span>`, from: `a little bit late`, to: `a day late` },
            content: { points: [ { ok: false, text: `She will mind. She chased you for it this morning, and she's calling him at noon.` }, { ok: false, text: `Name it plainly: what you promised, when, and that you forgot.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `a little late? how late. she's calling me in five minutes.`, mood: `alert, suspicious`, meter: 44, audio: V('excuses-t3') },
          { who: 'user', text: `i <span class="underline-y">have promised</span> her the confirmed details yesterday, by end of day. i sent them this morning. yesterday was crazy, i had so many calls.`, confessed: true, meter: 34, uaudio: V('excuses-u4'), chips: [{ miss: true, label: `blamed a busy day` }], feedback: {
            grammar: { wrong: `i <span class="err">have promised</span> her the details yesterday.`, right: `i <span class="fix">promised</span> her the details yesterday.`, reason: `with a finished time like "yesterday", use the simple past: "i promised".` },
            pronunciation: { quote: `the <span class="err">confirmed</span> details.`, words: ['confirmed', 'details'] },
            vocabulary: { wrong: `<span class="err">yesterday was crazy</span>`, right: `<span class="fix">i forgot</span>`, from: `yesterday was crazy`, to: `i forgot` },
            content: { points: [ { ok: true, text: `You finally said what you promised and when.` }, { ok: false, text: `He had to drag it out of you, and then you blamed your busy day.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `this morning? so she waited all night on us, and she had to chase you for it.`, mood: `stunned, then cold`, morph: 'goes-steely', caption: `This morning?`, meter: 28, audio: V('excuses-t5') },
          { who: 'user', text: `i know, but it's not totally my fault. i didn't <span class="underline-y">forgot</span> on purpose, nobody reminded me.`, tag: `this costs you his trust`, meter: 14, uaudio: V('excuses-u6'), chips: [{ miss: true, label: `made excuses instead of owning it` }], feedback: {
            grammar: { wrong: `i didn't <span class="err">forgot</span> on purpose.`, right: `i didn't <span class="fix">forget</span> on purpose.`, reason: `after "didn't", use the base verb: "didn't forget".` },
            pronunciation: { quote: `it's not <span class="err">totally</span> my fault.`, words: ['totally', 'reminded'] },
            vocabulary: { wrong: `it's not <span class="err">totally my fault</span>`, right: `it's <span class="fix">my mistake</span>`, from: `not totally my fault`, to: `my mistake` },
            content: { points: [ { ok: false, text: `He doesn't need to know whose fault it is. He needs to know it's handled.` }, { ok: false, text: `You made the promise. Own it in one line: "i forgot."` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `not your fault? it was your promise. i don't need whose fault it is, i need to know what she's going to say to me.`, mood: `angry, losing faith in you`, morph: 'angry', caption: `Not your fault?`, meter: 8, audio: V('excuses-t7') },
          { who: 'user', text: `can we just not bring it up? she <span class="underline-y">has everything since</span> this morning. maybe she forgot about it already.`, meter: 0, uaudio: V('excuses-u8'), chips: [{ miss: true, label: `asked him to hide it from the customer` }], feedback: {
            grammar: { wrong: `she <span class="err">has everything since</span> this morning.`, right: `she <span class="fix">has had everything since</span> this morning.`, reason: `with "since", use the present perfect: "has had".` },
            pronunciation: { quote: `can we just not <span class="err">bring it up</span>?`, words: ['bring', 'already'] },
            vocabulary: { wrong: `<span class="err">not bring it up</span>`, right: `<span class="fix">own it up front</span>`, from: `not bring it up`, to: `own it up front` },
            content: { points: [ { ok: false, text: `She chased you for it this morning. She won't forget by noon.` }, { ok: false, text: `Hiding it turns one late email into a trust problem.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `i can't get on a call with a customer and not know what my own team promised her. you're off the account.`, mood: `cold, final`, morph: 'kickout', caption: `You're off the account.`, meter: 0, audio: V('excuses-t9') },
        ],
      },
      {
        id: 'guided', title: 'Guided', tag: 'Says it first, then blames a busy day; Sarah steers it back', stars: 2, outcome: 'win',
        stamp: { text: 'CLOSE CALL', color: 'lavender' },
        turns: [
          { who: 'them', speaker: 'marcus', text: OPENING, mood: `busy, hoping for good news`, morph: 'greeting', meter: 68, audio: V('opening') },
          { who: 'user', text: `not really, sorry. i promised linda the confirmed details by end of day yesterday. she didn't get them.`, confessed: true, meter: 64, flyStar: 0, uaudio: V('guided-u2'), card: `Said it first: the promise and what went wrong` },
          { who: 'them', speaker: 'marcus', text: `yesterday? and she's calling me in five minutes. how did that happen?`, mood: `stunned, then hard`, morph: 'goes-steely', caption: `Yesterday?`, meter: 58, audio: V('guided-t3') },
          { who: 'user', text: `i had back-to-back calls till evening, so it <span class="underline-y">was slipped from</span> my mind.`, meter: 44, uaudio: V('guided-u4'), chips: [{ miss: true, label: `blamed a busy day` }], feedback: {
            grammar: { wrong: `it <span class="err">was slipped from</span> my mind.`, right: `it <span class="fix">slipped</span> my mind.`, reason: `"slip" isn't passive here, and it takes no "from": "it slipped my mind".` },
            pronunciation: { quote: `<span class="err">back-to-back</span> calls till evening.`, words: ['back-to-back', 'evening'] },
            vocabulary: { wrong: `<span class="err">i had back-to-back calls</span>`, right: `<span class="fix">i forgot</span>`, from: `i had back-to-back calls`, to: `i forgot` },
            content: { points: [ { ok: true, text: `You told him first, before she could.` }, { ok: false, text: `Then you blamed your calendar. He asked how, and the honest answer is you forgot.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `everyone has calls. you made her a promise, and she had to chase you for it.`, mood: `cold, running out of patience`, meter: 34, timeJump: 200, audio: V('guided-t5') },
          { who: 'user', text: `but honestly, she could have <span class="underline-y">remind</span> me earlier. so it's not totally my fault.`, tag: `this costs you his trust`, meter: 18, uaudio: V('guided-u6'), chips: [{ miss: true, label: `blamed the customer` }], feedback: {
            grammar: { wrong: `she could have <span class="err">remind</span> me earlier.`, right: `she could have <span class="fix">reminded</span> me earlier.`, reason: `after "could have", use the past participle: "could have reminded".` },
            pronunciation: { quote: `but <span class="err">honestly</span>, she could have reminded me.`, words: ['honestly', 'earlier'] },
            vocabulary: { wrong: `it's not <span class="err">totally my fault</span>`, right: `it's <span class="fix">my mistake</span>`, from: `not totally my fault`, to: `my mistake` },
            content: { points: [ { ok: false, text: `Now you're blaming the customer. He stops listening before a third excuse.` }, { ok: false, text: `He hates surprises more than mistakes. Own it, then move to the fix.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `not your fault? she calls in three minutes. whose fault it is is the last thing i care about.`, mood: `angry, trust slipping`, morph: 'angry', caption: `Not your fault?`, meter: 15, timeJump: 170, audio: V('guided-t7') },
          { who: 'hint', video: 'sarah-hint', hintText: `stop explaining. say "i forgot", then tell him it's already sent.`, response: `you're right. i forgot, and that's on me. i sent her the confirmed details a few minutes ago, with an apology. she has everything now.`, stars: [1], card: `Owned it, no excuses`, meter: 45, audio: V('hint'), uaudio: V('guided-u8') },
          { who: 'them', speaker: 'marcus', text: `okay. that i can work with. what do i say when she brings it up?`, mood: `the tension drops, back to business`, morph: 'exhale', caption: `Okay.`, meter: 56, audio: V('guided-t9') },
          { who: 'user', text: `you can open with: "linda, you should have had those details yesterday. that's on us, and they're in your inbox now."`, meter: 68, flash: 'approving', uaudio: V('guided-u10') },
          { who: 'them', speaker: 'marcus', text: `that's her now. good thing i heard it from you first. next time lead with "i forgot." the rest is noise.`, mood: `reads her message, steady; a lesson, not a threat`, event: { id: 'phone-email', at: 'before' }, morph: 'reads-phone', caption: `It's linda.`, meter: 70, timeJump: 30, audio: V('guided-t11') },
        ],
      },
      {
        id: 'perfect', title: 'Perfect', tag: 'Says it, owns it, brings the fix', stars: 3, outcome: 'win',
        stamp: { text: 'TRUST EARNED', color: 'gold' },
        turns: [
          { who: 'them', speaker: 'marcus', text: OPENING, mood: `busy, hoping for good news`, morph: 'greeting', meter: 68, audio: V('opening') },
          { who: 'user', text: `not good news, sorry. before your call: i promised linda the confirmed details by end of day yesterday, and i forgot to send them.`, confessed: true, meter: 66, flyStar: 0, uaudio: V('perfect-u2'), card: `Said it first, before the customer` },
          { who: 'them', speaker: 'marcus', text: `yesterday? and she's calling me in five minutes. how did that happen?`, mood: `stunned, then hard`, morph: 'goes-steely', caption: `Yesterday?`, meter: 58, audio: V('guided-t3') },
          { who: 'user', text: `no excuse. i didn't write it down, and it slipped my mind. that's on me.`, meter: 70, flyStar: 1, uaudio: V('perfect-u4'), card: `Owned it, no excuses` },
          { who: 'them', speaker: 'marcus', text: `okay. thanks for not dressing it up. where are we now? she calls in three minutes.`, mood: `steady, listening hard`, meter: 74, timeJump: 180, audio: V('perfect-t5') },
          { who: 'user', text: `i sent her everything a few minutes ago, with an apology, and i checked it twice. you could open with: "linda, those details should have reached you yesterday. that's on us, and they're in your inbox now."`, meter: 88, flash: 'approving', flyStar: 2, uaudio: V('perfect-u6'), card: `Brought the fix and a line for the call` },
          { who: 'them', speaker: 'marcus', text: `good. that's a line i can use. forward me what you sent.`, mood: `relieved, back on solid ground`, morph: 'exhale', caption: `Good.`, meter: 90, audio: V('perfect-t7') },
          { who: 'user', text: `it's in your inbox now.`, meter: 92, uaudio: V('perfect-u8') },
          { who: 'them', speaker: 'marcus', text: `there she is. "they only came this morning." and i already know why. that's how you handle it. see something, tell me first. every time.`, mood: `ready for it, quietly impressed`, event: { id: 'phone-email', at: 'before' }, morph: 'reads-phone', caption: `It's linda.`, meter: 95, flash: 'approving', timeJump: 40, audio: V('perfect-t9') },
        ],
      },
      {
        id: 'timesup', title: "Time's up", tag: 'Small talk, "i sent it", never says what went wrong', stars: 1, outcome: 'timeout',
        stamp: { text: 'HE FOUND OUT FIRST', color: 'amber' },
        turns: [
          { who: 'them', speaker: 'marcus', text: OPENING, mood: `busy, hoping for good news`, morph: 'greeting', meter: 68, audio: V('opening') },
          { who: 'user', text: `haha yes, long week! did you <span class="underline-y">saw</span> the game last night? crazy ending.`, meter: 62, uaudio: V('timesup-u2'), chips: [{ miss: true, label: `small talk on a 5-minute clock` }], feedback: {
            grammar: { wrong: `did you <span class="err">saw</span> the game?`, right: `did you <span class="fix">see</span> the game?`, reason: `after "did", use the base verb: "did you see".` },
            pronunciation: { quote: `crazy <span class="err">ending</span>.`, words: ['ending', 'crazy'] },
            vocabulary: { wrong: `<span class="err">did you see the game</span>`, right: `<span class="fix">i need to tell you something</span>`, from: `small talk`, to: `getting to the point` },
            content: { points: [ { ok: false, text: `He asked for good news, not a chat. You have five minutes.` }, { ok: false, text: `Every second you stall costs his trust.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `i didn't. linda's calling me in four minutes. what is it?`, mood: `clipped, eyeing the clock`, meter: 56, timeJump: 240, audio: V('timesup-t3') },
          { who: 'user', text: `oh, right. i just wanted to say i sent linda the details. the confirmation. she has everything now.`, meter: 54, flyStar: 2, uaudio: V('timesup-u4'), card: `Brought the fix` },
          { who: 'them', speaker: 'marcus', text: `okay... why are you telling me? was something wrong?`, mood: `suspicious, sharp`, meter: 48, timeJump: 170, audio: V('timesup-t5') },
          { who: 'user', text: `it's, um, a small timing thing. i <span class="underline-y">sended</span> it a bit late, but it's okay now, mostly.`, meter: 36, uaudio: V('timesup-u6'), chips: [{ miss: true, label: `circled instead of saying you forgot` }], feedback: {
            grammar: { wrong: `i <span class="err">sended</span> it a bit late.`, right: `i <span class="fix">sent</span> it a bit late.`, reason: `"send" is irregular: send, sent, sent.` },
            pronunciation: { quote: `a small <span class="err">timing</span> thing.`, words: ['timing', 'mostly'] },
            vocabulary: { wrong: `a small <span class="err">timing thing</span>`, right: `<span class="fix">i forgot to send it yesterday</span>`, from: `a small timing thing`, to: `i forgot to send it yesterday` },
            content: { points: [ { ok: false, text: `"Sent" means nothing until he knows what went wrong.` }, { ok: false, text: `Say it in one line: you promised it yesterday, and you forgot.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `how late. what did you promise her. one sentence, now.`, mood: `zero patience left`, meter: 30, timeJump: 70, audio: V('timesup-t7') },
          { who: 'user', text: `so the thing is, yesterday was very busy, and the details, they <span class="underline-y">was</span>, um...`, meter: 22, timeJump: 6, uaudio: V('timesup-u8'), chips: [{ miss: true, label: `still circling as the clock runs out` }], feedback: {
            grammar: { wrong: `the details, they <span class="err">was</span>...`, right: `the details, they <span class="fix">were</span>...`, reason: `"they" takes "were", not "was".` },
            pronunciation: { quote: `and the <span class="err">details</span>...`, words: ['details', 'yesterday'] },
            vocabulary: { wrong: `<span class="err">so the thing is</span>`, right: `<span class="fix">i forgot</span>`, from: `so the thing is`, to: `i forgot` },
            content: { points: [ { ok: false, text: `Lead with the problem, not the backstory.` }, { ok: false, text: `The call was seconds away. One sentence would have saved it.` } ] }
          } },
          /* the clock hits 0 here: this turn is the clock's exit, linda's message tells him first */
          { who: 'them', speaker: 'marcus', text: `"they only came this morning." ...were you going to tell me?`, mood: `reads her message, hurt more than angry`, event: { id: 'phone-email', at: 'before' }, morph: 'reads-phone', caption: `This morning?`, meter: 14, timeJump: 0, audio: V('timesup-t9') },
          { who: 'user', text: `yes! that's what i was trying to <span class="underline-y">told</span> you. i forgot to send them yesterday.`, confessed: true, meter: 12, uaudio: V('timesup-u10'), chips: [{ miss: true, label: `said it after the customer did` }], feedback: {
            grammar: { wrong: `i was trying to <span class="err">told</span> you.`, right: `i was trying to <span class="fix">tell</span> you.`, reason: `after "to", use the base verb: "to tell".` },
            pronunciation: { quote: `i <span class="err">forgot</span> to send them yesterday.`, words: ['forgot', 'trying'] },
            vocabulary: { wrong: `<span class="err">i was trying to tell you</span>`, right: `<span class="fix">i should have told you first</span>`, from: `i was trying to`, to: `i should have` },
            content: { points: [ { ok: false, text: `The customer told him before you did. That's the one thing he hates.` }, { ok: false, text: `Open with it next time: i promised it, i forgot, it's sent now.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `i'd rather hear it from you than from her. we'll talk after the call.`, mood: `heads into the call, disappointed`, meter: 10, audio: V('timesup-t11') },
        ],
      },
    ],
  },

  results: {
    /* win: swap to his `relieved` sheet face once it's approved */
    faces: { fail: 'flow-assets/boss-meter-furious.png', win: 'flow-assets/boss-happy-avatar.png', neutral: 'boss.png' },
  },
};

(window.ROLEPLAYS = window.ROLEPLAYS || {})[roleplay.id] = roleplay;
})();
