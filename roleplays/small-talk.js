/* ════════════════════════════════════════════════════════════════
   Roleplay file · Small talk with a coworker
   Game type: small talk (you lose when he stops caring and drifts off).

   The words and rules of one roleplay, in the same shape as
   asking-for-leave.js plus the additions in the script format
   (meter kind, speakers, events, topics). See GLOSSARY.md for the terms.
   ════════════════════════════════════════════════════════════════ */
(function () {
const OPENING = `hey, morning. guess we're desk neighbors now. how was your weekend?`;
/* the surprise moment: his phone buzzes at about 0:45 on the clock */
const DRIFT = `anyway, i should get back to it.`;
const CLOCK_EXIT = `that's my coffee. good talking to you.`;
const HINT_TEXT = `don't fill the silence with your week. ask about something you saw, like the medal on his monitor.`;
const HINT_CARD = `Found a topic he cares about`;

const V = (line) => `media/small-talk/voice/${line}.mp3`;
const SHEET = 'characters/ryan/sheet';
const AVATAR = 'media/small-talk/stills/topic-avatar.png';

const roleplay = {
  id: 'small-talk',
  title: 'Small talk',
  gameType: 'small-talk',
  character: 'ryan',

  /* Row on the topics list */
  topic: { label: 'Small talk with a<br>coworker', avatar: AVATAR, bg: '#3f5470' },

  /* AI-ready notes: enough for a live AI to play Ryan and judge the stars.
     The scripted paths below double as example answers for that judge. */
  ai: {
    personality: `ryan, a coworker who just moved to the player's team and now sits two desks away. friendly, easy-going, a nice guy, but polite-distracted: half on his phone, answering on autopilot ("ha, good, good. can't complain.") until you say something specific. bored by "how's it going", weather and work complaints. lights up fast when you notice something that's his: he talks more, laughs easily and gets generous. speaks in short, relaxed, lowercase lines.`,
    facts: [
      `it's monday, 8:57 am, in the office kitchen. ryan is waiting for the coffee machine; his coffee takes 90 seconds.`,
      `ryan moved to the player's team this morning: he carried a cardboard box of his desk things in and took the empty desk two desks from the player. he used to sit on the other side of the floor; they've passed each other and said "hey" for months but never really talked.`,
      `medal: his half-marathon medal rode in on top of his box, and he hung it on the corner of his new monitor. he ran his first half marathon yesterday (sunday), 2 hours 4 minutes. his sister made him bring the medal in. his legs are wrecked; he took the stairs sideways this morning.`,
      `dog: his phone's lock screen is his dog, pickle, a scruffy rescue terrier in a yellow raincoat. pickle ran one mile with him in training, then sat down and refused to move.`,
      `move: today is his first day on the player's team. he asked to move over for the new projects and picked the desk by the window, but he doesn't really know anyone on this side of the floor yet. the box he carried in is still half unpacked.`,
      `the taco truck that parks out front: ryan goes every friday and always gets the brisket.`,
      `his phone buzzes at about 0:45 on the clock: it's his old team, still pinging him. he reads it ("oh, sorry, one sec. it's my old team.") and starts to drift. talking over it pushes him further away.`,
    ],
    stars: [
      { id: 'open-well', rule: `the first line answers his weekend question with something real (a detail, a shared thing like the taco truck, or one of his topics) and skips "how's it going", weather and work complaints.` },
      { id: 'find-topic', rule: `names one of the three things that are his (the medal on his monitor, pickle on his lock screen, his move to the team with that box) and asks about it. vague lines ("nice phone", "busy week?") don't count. the first topic unlock earns it.` },
      { id: 'hook', rule: `ends with a reason to talk again: a specific follow-up he can say yes to (lunch, 20 minutes, a run, how he trained). "see you around" doesn't count.` },
    ],
    spark: `spark starts at 50 and drains 1 point a second only while the mic waits on the player (it pauses during his lines, his clips and the phone). a specific detail or real question +15; unlocking a topic +25; a generic line (weather, "busy?", "how's it going") -10; talking over his phone -15; the phone buzz itself -20.`,
    lose: `spark reaches 0 (he says "${DRIFT}" and walks back to his desk), or the 90-second coffee clock runs out ("${CLOCK_EXIT}").`,
    endings: [
      { stamp: `LET'S GRAB LUNCH`, when: `3 stars and all 3 topics unlocked`, line: `let's grab lunch thursday. i'll tell you every mistake i made, and you can tell me who's who around here.` },
      { stamp: `NEW WORK FRIEND`, when: `3 stars but not every topic unlocked (no scripted path ends here)`, line: `this was fun. come find me at the taco truck friday.` },
      { stamp: `CLOSE CALL`, when: `won after taking sarah's hint (max 2 stars)`, line: `ha, thanks. good chatting. have a good one.` },
      { stamp: `TIME'S UP`, when: `the coffee is ready before spark hits 0`, line: CLOCK_EXIT },
      { stamp: `HE DRIFTED OFF`, when: `spark reaches 0`, line: DRIFT },
    ],
  },

  /* Story: scenes play in order, then the face-off and the mission.
     Times are seconds from the start of the scene. Sound cues use the
     story screen's small sound library (hum, pad, ticks, whoosh, …).
     Times and ring boxes are measured from the clips (each runs 6.04 s).
     `card` is drawn by the app on top of the video (never baked into it). */
  story: {
    title: 'Small talk',
    scenes: [
      /* hero shot: two of the hidden topics arrive with him. He carries in a box of his desk things
         (the move) with his medal on top, sets it down two desks away and hangs the medal on his monitor. */
      { id: 'story-1-monday', videos: ['media/small-talk/videos/story-1-monday.mp4'], poster: 'media/small-talk/stills/story-1-monday-start.png', dur: 7.5,
        ring: { at: 4.4, topic: 'medal', style: 'left:35%; top:49%; width:16%; height:19%;' },
        rings: [
          { at: 1.25, topic: 'move', style: 'left:52%; top:61%; width:44%; height:22%;' },
          { at: 4.4, topic: 'medal', style: 'left:35%; top:49%; width:16%; height:19%;' },
        ],
        narrator: { at: 0.3, text: 'Monday, 8:52 AM. Ryan just moved to your team, two desks away' },
        cloud: { at: 5.4, text: 'huh. is that a race medal?', tail: 'bl', style: 'left:5%; top:10%;' },
        sound: [
          { at: 0, hum: { level: 0.04, freq: 220 }, id: 'hum' },
          { at: 0, pad: { freqs: [174, 220, 262], level: 0.04 }, id: 'pad' },
          { at: 0.2, footstep: true }, { at: 0.6, footstep: true }, { at: 1.0, footstep: true },
          { at: 1.25, chime: 660 }, { at: 4.4, chime: 784 },
          { at: 7.1, stop: 'pad' },
        ] },
      { id: 'story-2-desk', videos: ['media/small-talk/videos/story-2-desk.mp4'], poster: 'media/small-talk/stills/story-2-desk-start.png', dur: 6.0, transition: { type: 'crossfade', dur: 400 },
        narrator: { at: 0.3, text: "You've passed him in the hallway for months. You've never really talked" },
        cloud: { at: 3.6, text: 'coffee... good excuse to say hi.', tail: 'bl', style: 'left:6%; top:10%;' },
        sound: [
          { at: 0, pad: { freqs: [196, 247, 294], level: 0.035 }, id: 'pad' },
          { at: 1.1, footstep: true }, { at: 1.8, footstep: true }, { at: 2.5, footstep: true }, { at: 3.2, footstep: true },
          { at: 5.6, stop: 'pad' },
        ] },
      /* the third topic: his lock screen. The video only shows a blank glow; the app draws the photo.
         The scene ends at 4.35 s: after that the clip glitches (a second Ryan walks into the camera). */
      { id: 'story-3-kitchen', videos: ['media/small-talk/videos/story-3-kitchen.mp4'], poster: 'media/small-talk/stills/story-3-kitchen-start.png', dur: 5.9, transition: { type: 'crossfade', dur: 400 },
        ring: { at: 2.8, topic: 'dog', style: 'left:1%; top:69%; width:35%; height:12%;' },
        card: { at: 1.4, kind: 'lockscreen', title: 'his lock screen', body: 'a scruffy dog in a yellow raincoat', img: 'media/small-talk/stills/card-dog-photo.png', style: 'left:6%; top:11%; width:40%;' },
        narrator: { at: 0.2, text: 'At the coffee machine, his phone lights up. That has to be his dog' },
        cloud: { at: 2.2, text: "okay... that's three things to talk about.", tail: 'bl', style: 'left:6%; top:52%;' },
        sound: [
          { at: 0, hum: { level: 0.035, freq: 200 }, id: 'hum' },
          { at: 1.4, chime: 880 },
          { at: 5.6, stop: 'hum' },
        ] },
      { id: 'story-4-brew', videos: ['media/small-talk/videos/story-4-brew.mp4'], poster: 'media/small-talk/stills/story-4-brew-start.png', dur: 6.0, transition: { type: 'crossfade', dur: 400 },
        narrator: { at: 0.3, text: "His coffee takes 90 seconds. That's all the time you get" },
        cloud: { at: 3.3, text: 'say something... but not "how\'s it going".', tail: 'down', style: 'left:50%; transform-origin:center; margin-left:-90px; bottom:22%;' },
        sound: [
          { at: 0.4, ticks: 1000, id: 'tick' },
          { at: 2.6, whoosh: true },
          { at: 5.0, stop: 'tick', hard: true },
          { at: 5.0, silence: true },
        ] },
    ],
    faceoff: {
      transition: { type: 'hardcut', dur: 0 },
      them: { name: 'ryan', img: AVATAR },
      you: { name: 'you', img: 'img/you.png' },
      headline: 'YOU <span style="color:var(--yellow)">with</span> RYAN',
      tagline: '90 seconds. make a work friend.',
    },
    mission: {
      transition: { type: 'crossfade', dur: 400 },
      goal: 'Goal: Turn <span class="hl">Ryan</span> into a work friend before his coffee is done',
      stars: [
        { title: 'open well', sub: 'skip "how\'s it going", start with something real' },
        { title: 'find his topic', sub: 'ask about something you noticed' },
        { title: 'leave with a hook', sub: 'end with a reason to talk again' },
      ],
      clock: "his coffee takes <b>90 seconds</b>. then he's back at his desk",
    },
  },

  /* Conversation: the meter, the clock, the event, Ryan's moments, and the paths. */
  conversation: {
    eyebrow: 'Small talk · Coworker',
    opening: OPENING,
    avatar: `${SHEET}/neutral.png`,
    meter: {
      kind: 'spark',
      start: 50,
      /* drains only while the mic waits on the player; pauses during his lines, clips and the phone */
      drainPerSecond: 1,
      drainWhile: 'mic-waiting',
      gains: { specific: 15, unlock: 25, generic: -10, talkOver: -15 },
      faces: `${SHEET}/{face}.png`,
      levels: [
        { face: 'bored', to: 25 },
        { face: 'neutral', to: 55 },
        { face: 'interested', to: 80 },
        { face: 'delighted', to: 100 },
      ],
      /* three empty slots under the meter; a slot unlocks when the player names the thing and asks about it */
      topics: [
        { id: 'medal', icon: 'medal', label: 'his first half marathon' },
        { id: 'dog', icon: 'paw', label: 'pickle, his rescue dog' },
        { id: 'move', icon: 'box', label: 'his move to your team' },
      ],
      /* spark hits 0: he drifts back to his desk */
      lose: { line: DRIFT, morph: 'leaves', caption: `Anyway...`, audio: V('awkward-t5') },
    },
    clock: {
      seconds: 90,
      hidden: true,   /* no countdown on screen: the coffee only decides when he leaves */
      /* when it runs out, the coffee is ready and he heads back politely (same clip, different caption) */
      exit: { line: CLOCK_EXIT, src: `${SHEET}/leaves.mp4`, poster: `${SHEET}/leaves-poster.jpg`, hold: 3.6, caption: `Coffee's ready.`, audio: V('coffee-ready') },
    },
    /* surprise moment, drawn by the app (never in a video) */
    events: {
      'phone-buzz': { card: false, title: 'his phone buzzes', body: `he's reading something. wait, then win him back with a real question.`, icon: 'phone', clockAt: 45, spark: -20 },
    },
    /* takeover videos from Ryan's character sheet */
    moments: {
      greeting:       { src: `${SHEET}/greeting.mp4`, poster: `${SHEET}/greeting-poster.jpg`, caption: `Hey, morning!` },
      laugh:          { src: `${SHEET}/laugh.mp4`, poster: `${SHEET}/laugh-poster.jpg`, hold: 2.0, caption: `Ha!` },
      'checks-phone': { src: `${SHEET}/checks-phone.mp4`, poster: `${SHEET}/checks-phone-poster.jpg`, hold: 2.4, caption: `One sec.` },
      leaves:         { src: `${SHEET}/leaves.mp4`, poster: `${SHEET}/leaves-poster.jpg`, hold: 3.6, caption: `Anyway...` },
    },
    /* Sarah shows up once, in Guided, when spark is close to 0 */
    hint: { video: 'flow-assets/sarah-hint.mp4', poster: 'flow-assets/sarah-hint-poster.jpg', avatar: 'flow-assets/av-introduction.png', card: HINT_CARD, when: { meterBelow: 10 }, text: HINT_TEXT, audio: V('hint') },
    defaultPath: 'awkward',
    paths: [
      {
        id: 'awkward', title: 'Awkward', tag: '"Fine", the weather, talks over his phone. He drifts off', stars: 0, outcome: 'fail',
        stamp: { text: 'HE DRIFTED OFF', color: 'red' },
        turns: [
          { who: 'them', speaker: 'ryan', text: OPENING, mood: `friendly, on autopilot`, morph: 'greeting', meter: 50, audio: V('opening') },
          { who: 'user', text: `yeah, it was fine. <span class="underline-y">i was just sitting in home</span>. how's it going?`, meter: 40, uaudio: V('awkward-u1'), chips: [{ miss: true, label: `answered "fine", then "how's it going"` }], feedback: {
            grammar: { wrong: `i was just sitting <span class="err">in home</span>.`, right: `i <span class="fix">just stayed home</span>.`, reason: `"home" doesn't take "in": say "at home", or just "stayed home". "sitting" also sounds like you never moved all weekend.` },
            pronunciation: { quote: `i was just <span class="err">sitting</span> in home.`, words: ['sitting', 'home'] },
            vocabulary: { wrong: `<span class="err">how's it going?</span>`, right: `<span class="fix">is that a race medal on your monitor?</span>`, from: `how's it going?`, to: `a question about something you noticed` },
            content: { points: [ { ok: false, text: `He asked about your weekend and got "fine". Give him one real detail.` }, { ok: false, text: `"How's it going" just hands the question back. Ask about something only he has.` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: `ha, good, good. can't complain.`, mood: `friendly, on autopilot, eyes on the machine`, meter: 40, audio: V('awkward-t2') },
          { who: 'user', text: `the weather is so cold today, no? <span class="underline-y">i almost didn't came</span> to office.`, meter: 28, uaudio: V('awkward-u2'), chips: [{ miss: true, label: `the weather: nothing to answer` }], feedback: {
            grammar: { wrong: `i almost <span class="err">didn't came</span> to <span class="err">office</span>.`, right: `i almost <span class="fix">didn't come</span> to <span class="fix">the office</span>.`, reason: `after "didn't", the verb goes back to its base form: didn't come, not didn't came. and it's "the office", with "the".` },
            pronunciation: { quote: `the <span class="err">weather</span> is so cold today`, words: ['weather', 'almost'] },
            vocabulary: { wrong: `so <span class="err">cold</span> today, <span class="err">no</span>?`, right: `<span class="fix">freezing</span> today, <span class="fix">right</span>?`, from: `so cold, no?`, to: `freezing, right?` },
            content: { points: [ { ok: false, text: `The weather gives him nothing to say except "yeah".` }, { ok: false, text: `You watched him unpack. The medal and the box were right there.` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: `yeah, it's chilly out there.`, mood: `polite, half listening`, meter: 28, audio: V('awkward-t3') },
          { who: 'them', speaker: 'ryan', text: `oh, sorry, one sec. it's my old team.`, mood: `reading his phone, drifting off`, event: { id: 'phone-buzz', at: 'before' }, morph: 'checks-phone', meter: 8, timeJump: 45, audio: V('awkward-t4') },
          { who: 'user', text: `so <span class="underline-y">you are working here since long time</span>?`, tag: `he was still on his phone`, meter: 0, uaudio: V('awkward-u3'), chips: [{ miss: true, label: `talked over his phone with a generic question` }], feedback: {
            grammar: { wrong: `you <span class="err">are working</span> here <span class="err">since long time</span>?`, right: `<span class="fix">have you been working</span> here <span class="fix">long</span>?`, reason: `for something that started in the past and is still going, use "have you been + -ing". "since" needs a start point (since 2022); for a length of time, say "for a long time", or just "long".` },
            pronunciation: { quote: `you are <span class="err">working</span> here since long time?`, words: ['working', 'since'] },
            vocabulary: { wrong: `<span class="err">since long time</span>`, right: `<span class="fix">for a while</span>`, from: `since long time`, to: `for a while` },
            content: { points: [ { ok: false, text: `He was reading his phone. Talking over it pushes him further away.` }, { ok: false, text: `"How long have you worked here?" is a question for anyone. Ask about something only he has, like the medal.` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: DRIFT, mood: `friendly, already gone`, morph: 'leaves', caption: `Anyway...`, meter: 0, audio: V('awkward-t5') },
        ],
      },
      {
        id: 'guided', title: 'Guided', tag: 'Good start, drifts into "busy week?", Sarah points out the medal', stars: 2, outcome: 'win',
        stamp: { text: 'CLOSE CALL', color: 'lavender' },
        turns: [
          { who: 'them', speaker: 'ryan', text: OPENING, mood: `friendly, on autopilot`, morph: 'greeting', meter: 50, audio: V('opening') },
          { who: 'user', text: `pretty quiet. i finally tried the taco truck that parks out front. have you been?`, meter: 63, flash: 'interested', flyStar: 0, uaudio: V('guided-u1'), card: `Opened with something real` },
          { who: 'them', speaker: 'ryan', text: `the one with the green awning? every friday. get the brisket.`, mood: `amused, a little more awake`, meter: 63, audio: V('guided-t2') },
          { who: 'user', text: `okay, nice. so... busy week? <span class="underline-y">mondays are always the most worst</span>.`, meter: 51, uaudio: V('guided-u2'), chips: [{ miss: true, label: `drifted into a generic "busy week?"` }], feedback: {
            grammar: { wrong: `mondays are always <span class="err">the most worst</span>.`, right: `mondays are always <span class="fix">the worst</span>.`, reason: `"worst" already means "most bad", so don't add "most": the worst, not the most worst.` },
            pronunciation: { quote: `mondays are always the most <span class="err">worst</span>.`, words: ['worst', 'always'] },
            vocabulary: { wrong: `<span class="err">busy week?</span>`, right: `<span class="fix">is that a race medal on your monitor?</span>`, from: `busy week?`, to: `a question about something you saw` },
            content: { points: [ { ok: true, text: `Great start: the taco truck is something you both share.` }, { ok: false, text: `"Busy week?" is the question he hears all day. Stay specific.` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: `always. oh, sorry, one sec. it's my old team.`, mood: `distracted, reading his phone`, event: { id: 'phone-buzz', at: 'before' }, morph: 'checks-phone', meter: 31, timeJump: 45, audio: V('guided-t3') },
          { who: 'user', text: `yeah, me too. i have meeting after meeting <span class="underline-y">whole day</span>, it's so boring.`, tag: `he was still on his phone`, meter: 6, uaudio: V('guided-u3'), chips: [{ miss: true, label: `talked over his phone, about your own day` }], feedback: {
            grammar: { wrong: `meeting after meeting <span class="err">whole day</span>`, right: `meeting after meeting <span class="fix">all day</span>`, reason: `say "all day" or "the whole day". "whole" needs "the" in front of it.` },
            pronunciation: { quote: `it's so <span class="err">boring</span>.`, words: ['boring', 'meeting'] },
            vocabulary: { wrong: `it's so <span class="err">boring</span>`, right: `it's <span class="fix">back-to-back</span>`, from: `so boring`, to: `back-to-back` },
            content: { points: [ { ok: false, text: `He was reading his phone. Wait until he looks up.` }, { ok: false, text: `Your meetings give him nothing to answer. Make it about him.` } ] }
          } },
          { who: 'hint', video: 'sarah-hint', hintText: HINT_TEXT, response: `sorry, before you go. is that a half-marathon medal on your monitor?`, topic: 'medal', stars: [1], card: HINT_CARD, meter: 31, audio: V('hint'), uaudio: V('guided-u4') },
          { who: 'them', speaker: 'ryan', text: `oh man, you saw that? yeah, my first half marathon. yesterday. my sister said i had to bring it in.`, mood: `looks up from his phone, grinning`, flash: 'interested', meter: 31, audio: V('guided-t4') },
          { who: 'user', text: `that's huge, congrats. <span class="underline-y">how much time you took</span> to finish?`, meter: 44, uaudio: V('guided-u5'), chips: [{ miss: true, label: `the question came out in the wrong order` }], feedback: {
            grammar: { wrong: `<span class="err">how much time you took</span> to finish?`, right: `<span class="fix">how long did it take you</span> to finish?`, reason: `questions about the past need "did": how long did it take you? after "did", the verb goes back to its base form: take, not took.` },
            pronunciation: { quote: `that's huge, <span class="err">congrats</span>.`, words: ['congrats', 'finish'] },
            vocabulary: { wrong: `<span class="err">how much time</span>`, right: `<span class="fix">how long</span>`, from: `how much time`, to: `how long` },
            content: { points: [ { ok: true, text: `A follow-up question kept him on his favorite topic.` }, { ok: false, text: `Fix the order so it sounds natural: how long did it take you...?` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: `two hours, four minutes. and i took the stairs sideways this morning.`, mood: `laughing a little, one eye on the coffee`, meter: 44, timeJump: 12, audio: V('guided-t5') },
          { who: 'user', text: `ha, that's amazing. okay, <span class="underline-y">take rest for your legs</span>!`, meter: 40, uaudio: V('guided-u6'), chips: [{ miss: true, label: `said goodbye with no hook` }], feedback: {
            grammar: { wrong: `<span class="err">take rest</span> for your legs!`, right: `<span class="fix">rest those legs</span>!`, reason: `"take rest" isn't used in american english. say "get some rest" or "rest your legs".` },
            pronunciation: { quote: `that's <span class="err">amazing</span>.`, words: ['amazing', 'legs'] },
            vocabulary: { wrong: `<span class="err">take rest for your legs</span>`, right: `<span class="fix">i'd love to hear how you trained sometime</span>`, from: `a goodbye`, to: `a hook` },
            content: { points: [ { ok: true, text: `You kept him on the race, the thing he cares about.` }, { ok: false, text: `You said goodbye without a reason to talk again.` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: `ha, thanks. good chatting. have a good one.`, mood: `friendly, already heading back to his desk`, meter: 40, audio: V('guided-t6') },
        ],
      },
      {
        id: 'perfect', title: 'Perfect', tag: 'The medal, Pickle, the move, and a hook. He suggests lunch', stars: 3, outcome: 'win',
        stamp: { text: "LET'S GRAB LUNCH", color: 'gold' },
        turns: [
          { who: 'them', speaker: 'ryan', text: OPENING, mood: `friendly, on autopilot`, morph: 'greeting', meter: 50, audio: V('opening') },
          { who: 'user', text: `quiet, honestly. but i'm guessing yours wasn't. is that a half-marathon medal on your monitor?`, topic: 'medal', meter: 75, flash: 'interested', uaudio: V('perfect-u1'), chips: [{ ok: true, star: 0, label: `opened with something real` }], flyStar: 1, card: `Found a topic he cares about` },
          { who: 'them', speaker: 'ryan', text: `ha, you noticed! yeah, my first one, yesterday. my sister made me bring it in.`, mood: `surprised, warming up fast`, meter: 75, audio: V('perfect-t2') },
          { who: 'user', text: `that's huge. and the dog on your lock screen, the one in the yellow raincoat, is he yours?`, topic: 'dog', meter: 96, flash: 'delighted', uaudio: V('perfect-u2') },
          { who: 'them', speaker: 'ryan', text: `ha! that's pickle. rescue terrier. he ran one mile with me in training, then sat down and refused to move.`, mood: `laughing, delighted`, morph: 'laugh', caption: `Ha!`, meter: 96, audio: V('perfect-t3') },
          { who: 'them', speaker: 'ryan', text: `oh, sorry, one sec. it's my old team.`, mood: `reading his phone, apologetic`, event: { id: 'phone-buzz', at: 'before' }, morph: 'checks-phone', meter: 76, timeJump: 45, audio: V('perfect-t4') },
          { who: 'user', text: `no worries. i saw you carry that box in. did you just move to our team?`, topic: 'move', meter: 99, flash: 'delighted', uaudio: V('perfect-u3'), chips: [{ ok: true, label: `waited out his phone, then came back with a real question` }] },
          { who: 'them', speaker: 'ryan', text: `yep, day one. i asked to move over for the new projects. but honestly, i don't know anyone on this side of the floor yet.`, mood: `animated, leaning in`, meter: 99, audio: V('perfect-t5') },
          { who: 'user', text: `i've been meaning to start running. i'd love to hear how you trained for it, if you ever have 20 minutes.`, meter: 100, flash: 'delighted', flyStar: 2, uaudio: V('perfect-u4'), card: `Left with a hook` },
          { who: 'them', speaker: 'ryan', text: `let's grab lunch thursday. i'll tell you every mistake i made, and you can tell me who's who around here.`, mood: `delighted, means it`, flash: 'delighted', meter: 100, audio: V('perfect-t6') },
        ],
      },
      {
        id: 'timesup', title: "Time's up", tag: 'Good start, then rambles about the forecast and a slow laptop', stars: 1, outcome: 'timeout',
        stamp: { text: "TIME'S UP", color: 'amber' },
        turns: [
          { who: 'them', speaker: 'ryan', text: OPENING, mood: `friendly, on autopilot`, morph: 'greeting', meter: 50, audio: V('opening') },
          { who: 'user', text: `pretty quiet. i finally tried the taco truck that parks out front. have you been?`, meter: 63, flash: 'interested', flyStar: 0, uaudio: V('guided-u1'), card: `Opened with something real` },
          { who: 'them', speaker: 'ryan', text: `the one with the green awning? every friday. get the brisket.`, mood: `amused, a little more awake`, meter: 63, audio: V('guided-t2') },
          { who: 'user', text: `yeah, i go there when marcus keeps me late. <span class="underline-y">i am handling the client forecast since last month</span>, and it has like twelve tabs, and...`, meter: 53, uaudio: V('timesup-u2'), chips: [{ miss: true, label: `talked about your work, asked him nothing` }], feedback: {
            grammar: { wrong: `i <span class="err">am handling</span> the client forecast since last month`, right: `i<span class="fix">'ve been handling</span> the client forecast since last month`, reason: `"since last month" means it started then and is still going. that needs "have been + -ing", not "am + -ing".` },
            pronunciation: { quote: `the client <span class="err">forecast</span>`, words: ['forecast', 'handling'] },
            vocabulary: { wrong: `it has <span class="err">like</span> twelve tabs`, right: `it has <span class="fix">about</span> twelve tabs`, from: `like`, to: `about` },
            content: { points: [ { ok: false, text: `He made one friendly comment and got a work update. Keep your part short.` }, { ok: false, text: `Turn it back to him: ask about something you noticed.` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: `sounds intense. oh, sorry, one sec. it's my old team.`, mood: `polite, then reading his phone`, event: { id: 'phone-buzz', at: 'before' }, morph: 'checks-phone', meter: 33, timeJump: 45, audio: V('timesup-t3') },
          { who: 'user', text: `no problem. and on top of that, my laptop is <span class="underline-y">so much slow</span> today. it took ten minutes to start.`, meter: 23, uaudio: V('timesup-u3'), chips: [{ miss: true, label: `still about you: your laptop` }], feedback: {
            grammar: { wrong: `my laptop is <span class="err">so much slow</span> today.`, right: `my laptop is <span class="fix">so slow</span> today.`, reason: `before an adjective, use "so" on its own: so slow. "so much" goes before a noun: so much work.` },
            pronunciation: { quote: `my <span class="err">laptop</span> is so much slow`, words: ['laptop', 'minutes'] },
            vocabulary: { wrong: `ten minutes <span class="err">to start</span>`, right: `ten minutes <span class="fix">to boot up</span>`, from: `to start`, to: `to boot up` },
            content: { points: [ { ok: true, text: `You waited while he read his phone. Good.` }, { ok: false, text: `Then more about you. He still knows nothing worth remembering.` } ] }
          } },
          { who: 'them', speaker: 'ryan', text: `ugh, the worst. probably the update.`, mood: `polite, watching his coffee pour`, meter: 23, timeJump: 18, audio: V('timesup-t4') },
          { who: 'user', text: `yes! and this machine is <span class="underline-y">more slower than</span> my laptop, no?`, meter: 13, uaudio: V('timesup-u4'), chips: [{ miss: true, label: `spent the last seconds on the coffee machine` }], feedback: {
            grammar: { wrong: `this machine is <span class="err">more slower than</span> my laptop`, right: `this machine is <span class="fix">even slower than</span> my laptop`, reason: `"slower" already means "more slow". to make it stronger, use "even": even slower.` },
            pronunciation: { quote: `this <span class="err">machine</span> is more slower`, words: ['machine', 'slower'] },
            vocabulary: { wrong: `my laptop, <span class="err">no</span>?`, right: `my laptop, <span class="fix">right</span>?`, from: `, no?`, to: `, right?` },
            content: { points: [ { ok: false, text: `Last seconds, and the topic is the coffee machine.` }, { ok: false, text: `End with a hook, like asking about the medal on his monitor.` } ] }
          } },
        ],
      },
    ],
  },

  results: {
    faces: { win: `${SHEET}/delighted.png`, fail: `${SHEET}/bored.png`, neutral: `${SHEET}/neutral.png` },
  },
};

(window.ROLEPLAYS = window.ROLEPLAYS || {})[roleplay.id] = roleplay;
})();
