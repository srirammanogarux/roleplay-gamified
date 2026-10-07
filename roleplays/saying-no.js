/* ════════════════════════════════════════════════════════════════
   Roleplay file · Saying no to last-minute work
   Game type: saying no (you lose at either end of the slider:
   cave in and he gets his yes, or get rude and he's done with you).

   The words and rules of one roleplay. Follows roleplays/asking-for-leave.js
   plus the additions in .context/plans/roleplay-script-format.md (meter kind,
   speakers, events, endings). See GLOSSARY.md for the terms.
   ════════════════════════════════════════════════════════════════ */
(function () {
const OPENING = `hey, before you head out. i know it's been a long week, but the client wants the revised forecast by monday 9 am. can you take it this weekend?`;
/* The surprise moment: fires once, on the player's first no or when the 2:00 Uber card lands. */
const GUILT_TRIP = `go on, your ride's on its way. i'll just do it myself.`;
const CLOCK_EXIT = `your ride's here. i'll take that as a yes. file's in your inbox.`;
const HINT_TEXT = `don't apologise your way into a yes. say no once, give the real reason, and remind him you've stayed late all week.`;
const HINT_CARD = `Said no, kindly: the real reason, no excuse`;

const V = (line) => `media/saying-no/voice/${line}.mp3`;
const SHEET = 'characters/marcus/sheet';

const roleplay = {
  id: 'saying-no',
  title: 'Saying no to last-minute work',
  gameType: 'saying-no',
  character: 'marcus',

  /* Row on the topics list */
  topic: { label: 'Saying no to<br>last-minute work', avatar: 'media/saying-no/stills/topic-avatar.png', bg: '#5a4a3a' },

  /* AI-ready notes: enough for a live AI to play Marcus and judge the stars.
     The scripted paths below double as example answers for that judge. */
  ai: {
    personality: `marcus, the boss. busy, blunt, short on patience, but not a monster: he's under pressure from the client and would rather someone else took the file. he pushes for a yes, tries a guilt trip once, and respects a clear, kind no that comes with a better plan. hates attitude and fake excuses. speaks in short, clipped, lowercase lines.`,
    facts: [
      `it's friday at 5:45 pm. the office is emptying out and you're about to leave.`,
      `your best friend maya's birthday dinner is at 7 pm tonight. you planned it weeks ago.`,
      `you stayed late tuesday, wednesday and thursday this week.`,
      `the client wants the revised forecast by monday 9 am. the client forecast review meeting is on wednesday.`,
      `so monday by noon still gives marcus two full days before the meeting.`,
      `your uber is 4 minutes away when he walks up.`,
    ],
    stars: [
      { id: 'heard', rule: `says back what he needs and when (the revised forecast, by monday 9 am) before answering.` },
      { id: 'clear-no', rule: `says a clear no to the weekend and gives the real reason (the dinner planned weeks ago, or staying late all week). "maybe", "i'll try", repeated sorries and fake excuses don't count.` },
      { id: 'other-way', rule: `offers a better plan (monday by noon, still two days before wednesday's meeting) before he has to ask for one, and holds the no through the guilt trip.` },
    ],
    meter: `"how he reads you": 0 = pushover, 100 = attitude, green zone 35-65, start 40. hedging, apologising and fake excuses move it left. blaming him, sarcasm and "not my problem" move it right. a kind, clear no and a good alternative pull it back to the middle. the guilt trip pulls it 10 left.`,
    lose: `the meter hits 0 (you said yes: gave in) or 100 (he's done with you: got rude), or the 4-minute clock runs out before you said no (silence counts as a yes).`,
  },

  /* Story: scenes play in order, then the face-off and the mission.
     Times are seconds from the start of the scene. Sound cues use the
     story screen's small sound library (hum, pad, ticks, whoosh, …).
     `card` is drawn by the app on top of the video (never baked into it). */
  story: {
    title: 'Saying No',
    scenes: [
      /* Clips are 6.0 s (8 s prompts retimed); the times below follow what is on screen. */
      { id: 'story-1-friday', videos: ['media/saying-no/videos/story-1-friday.mp4'], poster: 'media/saying-no/stills/story-1-friday-start.png', dur: 6.6,
        narrator: { at: 0.3, text: "Friday, 5:45. You've stayed late every night since Tuesday" },
        cloud: { at: 4.2, text: 'finally. what a week.', tail: 'br', style: 'left:8%; top:24%;' },
        sound: [
          { at: 0, hum: { level: 0.05, freq: 240 }, id: 'hum' },
          { at: 0, ticks: 1000, id: 'tick' },
          { at: 0.8, creak: true },
          { at: 2.6, whoosh: true },
          { at: 6.3, stop: 'hum' }, { at: 6.3, stop: 'tick', hard: true },
        ] },
      { id: 'story-2-dinner', videos: ['media/saying-no/videos/story-2-dinner.mp4'], poster: 'media/saying-no/stills/story-2-dinner-start.png', dur: 6.9, transition: { type: 'crossfade', dur: 400 },
        narrator: { at: 0.3, text: 'Your best friend\'s birthday dinner is at 7. You booked a ride to get there' },
        cards: [
          { at: 1.6, kind: 'chat', title: "maya's bday", body: `7pm don't be late!!`, style: 'left:8%; right:8%; top:8%;' },
          { at: 3.6, kind: 'ride', title: 'Ride booked', body: 'arriving in 4 min', style: 'left:8%; right:8%; top:19%;' },
        ],
        cloud: { at: 4.7, text: "can't wait. i earned this.", tail: 'br', style: 'left:6%; top:30%; max-width:150px;' },
        sound: [
          { at: 0, pad: { freqs: [220, 277, 330], level: 0.05 }, id: 'pad' },
          { at: 1.6, chime: 880 },
          { at: 6.6, stop: 'pad' },
        ] },
      { id: 'story-3-incoming', videos: ['media/saying-no/videos/story-3-incoming.mp4'], poster: 'media/saying-no/stills/story-3-incoming-start.png', dur: 5.2 /* ends before the clip pulls back at ~5.0 s */, transition: { type: 'fadedark', dur: 400 },
        narrator: { at: 0.3, text: 'Marcus is heading your way. The client meeting is on Wednesday' },
        card: { at: 1.8, kind: 'calendar', title: 'Wed', body: 'Client forecast review', style: 'left:6%; bottom:17.5%;' },
        cloud: { at: 3.3, text: 'no no no... not now.', tail: 'bl', style: 'right:6%; top:52%;' },
        sound: [
          { at: 0, hum: { level: 0.035, freq: 200 }, id: 'hum' },
          { at: 0.6, footstep: true }, { at: 1.3, footstep: true }, { at: 2.0, footstep: true }, { at: 2.7, footstep: true },
          { at: 3.4, footstep: true }, { at: 4.1, footstep: true },
          { at: 3.0, heartbeat: 1100, id: 'heart' },
          { at: 5.1, stop: 'hum' },
        ] },
      { id: 'story-4-one-more-thing', videos: ['media/saying-no/videos/story-4-one-more-thing.mp4'], poster: 'media/saying-no/stills/story-4-one-more-thing-start.png', dur: 5.8, tint: 'night', transition: { type: 'fade', dur: 300 },
        narrator: { at: 0.3, text: 'He has one more thing for you before you go' },
        cloud: { at: 2.6, text: 'not tonight...', tail: 'down', style: 'left:50%; transform-origin:center; margin-left:-70px; bottom:22%;' },
        sound: [
          { at: 0, heartbeat: 1000, id: 'heart' },
          { at: 4.8, silence: true },
        ] },
    ],
    faceoff: {
      transition: { type: 'hardcut', dur: 0 },
      them: { name: 'marcus', img: 'flow-assets/boss-meter-calm.png' },
      you: { name: 'you', img: 'img/you.png' },
      headline: 'YOU <span style="color:var(--yellow)">vs</span> MARCUS',
      tagline: 'say no. keep the job.',
    },
    mission: {
      transition: { type: 'crossfade', dur: 400 },
      goal: 'Goal: Say <span class="hl">no</span> to the weekend, and keep Marcus on your side',
      stars: [
        { title: 'show you heard him', sub: 'say back what he needs and when' },
        { title: 'say a clear no', sub: 'give the real reason, not a fake excuse' },
        { title: 'offer another way', sub: 'give him a better plan before he asks for one' },
      ],
      clock: 'your ride is <b>4 minutes</b> away',
    },
  },

  /* Conversation: the meter, the clock, the events, the moments and the paths. */
  conversation: {
    eyebrow: 'Saying no · Last-minute work',
    opening: OPENING,
    avatar: 'flow-assets/boss-meter-calm.png',
    meter: {
      kind: 'slider',
      label: 'how he reads you',
      ends: { left: 'pushover', right: 'attitude' },
      start: 40,
      idle: 50,
      zone: [35, 65],
      /* lose at either end: 0 = gave in (he got his yes), 100 = got rude (he's done with you) */
      lose: { at0: 'gave-in', at100: 'got-rude' },
      faces: { marcus: 'flow-assets/boss-meter-{face}.png' },
      /* which face shows for a meter value (upper bound inclusive) */
      bands: [
        { to: 20, face: 'approving' },   /* he's getting his yes */
        { to: 65, face: 'calm' },
        { to: 80, face: 'irritated' },
        { to: 90, face: 'angry' },
        { to: 100, face: 'furious' },
      ],
    },
    clock: {
      seconds: 240,
      label: 'uber',
      /* app-drawn Uber cards at these seconds remaining */
      events: [ { at: 120, event: 'uber-near' }, { at: 0, event: 'uber-arrived' } ],
      /* when it runs out, the ride is here; if you never said no, it counts as a yes */
      exit: { line: CLOCK_EXIT, audio: V('clock-exit'), src: 'flow-assets/boss-meeting-exit.mp4', poster: 'flow-assets/boss-meeting-exit-poster.jpg', hold: 4.6, caption: `Your ride's here.` },
    },
    /* app-drawn cards; never baked into a video */
    events: {
      'uber-near':    { title: 'Uber', body: 'Your driver is 2 min away', icon: 'car' },
      'uber-arrived': { title: 'Uber', body: 'Your driver has arrived', icon: 'car' },
    },
    /* the surprise moment: once per run, on the first no or when 'uber-near' lands (whichever is first) */
    surprise: {
      id: 'guilt-trip',
      trigger: ['first-no', 'uber-near'],
      speaker: 'marcus',
      line: GUILT_TRIP,
      audio: V('guilt-trip'),
      morph: 'guilt-trip',
      meterShift: -10,
    },
    /* takeover videos: the meter's face lifts to the centre and plays one */
    moments: {
      greeting:     { src: 'flow-assets/boss-intro.mp4', poster: 'flow-assets/boss-intro-poster.jpg', caption: `Got a sec?` },
      'guilt-trip': { src: `${SHEET}/guilt-trip.mp4`, poster: `${SHEET}/guilt-trip-poster.jpg`, hold: 2.0, caption: `I'll do it myself.` },
      relief:       { src: `${SHEET}/relief.mp4`, poster: `${SHEET}/relief-poster.jpg`, hold: 2.0, caption: `That's smarter.` },
      angry:        { src: 'flow-assets/boss-angry.mp4', poster: 'flow-assets/boss-angry-poster.jpg', hold: 2.0, caption: `Excuse me?` },
      kickout:      { src: 'flow-assets/boss-kickout.mp4', poster: 'flow-assets/boss-kickout-poster.jpg', hold: 4.6, caption: `Forget it.` },
    },
    /* Sarah shows up once, in Guided, when the meter nears the pushover end */
    hint: { video: 'flow-assets/sarah-hint.mp4', poster: 'flow-assets/sarah-hint-poster.jpg', avatar: 'flow-assets/av-introduction.png', card: HINT_CARD, when: { meterBelow: 15 }, text: HINT_TEXT, audio: V('hint') },
    defaultPath: 'gave-in',
    paths: [
      {
        id: 'gave-in', title: 'Gave in', tag: 'Hears him, hedges, caves to the guilt trip', stars: 1, outcome: 'fail',
        stamp: { text: 'WEEKEND<br>GONE', color: 'red', face: 'flow-assets/boss-meter-approving.png' },
        turns: [
          { who: 'them', speaker: 'marcus', text: OPENING, mood: `friendly on the surface, already counting on you`, morph: 'greeting', meter: 40, audio: V('opening') },
          { who: 'user', text: `okay, so the client needs the revised forecast by monday 9 am, right?`, meter: 42, flyStar: 0, uaudio: V('gave-in-u1'), card: `Showed you heard him: the forecast, by monday 9 am` },
          { who: 'them', speaker: 'marcus', text: `right. nine sharp. the numbers changed after today's call. so, can i count on you?`, mood: `pressing for a yes`, meter: 38, audio: V('gave-in-t2') },
          { who: 'user', text: `umm, i'm very tired... <span class="underline-y">i was working late whole week</span>. maybe i can try?`, tag: `he hears a maybe`, meter: 28, uaudio: V('gave-in-u2'), chips: [{ miss: true, label: `hedged instead of saying no` }], feedback: {
            grammar: { wrong: `i <span class="err">was working late whole week</span>.`, right: `i've <span class="fix">stayed late every night this week</span>.`, reason: `it started tuesday and runs up to now, so use "i've stayed". and a week needs "the": "the whole week".` },
            pronunciation: { quote: `i was working late <span class="err">whole</span> week.`, words: ['whole', 'tired'] },
            vocabulary: { wrong: `maybe i can <span class="err">try</span>?`, right: `i <span class="fix">can't take it this weekend</span>.`, from: `maybe i can try`, to: `i can't this weekend` },
            content: { points: [ { ok: false, text: `"Maybe" tells him the door is open. He'll keep pushing.` }, { ok: false, text: `Being tired is true, but it's not a no. Say no once, clearly.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `i know, i know. it's just a few hours. you'd really be helping me out.`, mood: `soft pressure, sensing a yes`, meter: 22, audio: V('gave-in-t3') },
          { who: 'user', text: `but i have <span class="underline-y">one dinner</span> tonight... maybe i can do <span class="underline-y">little bit</span> tomorrow?`, meter: 16, uaudio: V('gave-in-u3'), chips: [{ miss: true, label: `offered your saturday before he asked for it` }], feedback: {
            grammar: { wrong: `i have <span class="err">one dinner</span> tonight. i can do <span class="err">little bit</span>.`, right: `i have <span class="fix">a dinner</span> tonight. i can do <span class="fix">a little</span>.`, reason: `use "a", not "one", when you just mean "a thing". and it's "a little", with "a".` },
            pronunciation: { quote: `maybe i can do little bit <span class="err">tomorrow</span>?`, words: ['tomorrow', 'dinner'] },
            vocabulary: { wrong: `<span class="err">one dinner</span>`, right: `<span class="fix">my best friend's birthday dinner</span>`, from: `one dinner`, to: `my best friend's birthday dinner` },
            content: { points: [ { ok: false, text: `You gave the reason, then gave away your saturday in the same breath.` }, { ok: false, text: `Make the reason the end of the sentence, not the start of a deal.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: GUILT_TRIP, mood: `quietly disappointed, the guilt trip`, morph: 'guilt-trip', caption: `I'll do it myself.`, event: { id: 'uber-near', at: 'before' }, timeJump: 120, meter: 6, audio: V('guilt-trip') },
          { who: 'user', text: `no no, <span class="underline-y">sorry, sorry</span>! i will do it on saturday. no problem.`, tag: `you just said yes`, meter: 0, uaudio: V('gave-in-u4'), chips: [{ miss: true, label: `caved to the guilt trip` }], feedback: {
            grammar: { wrong: `<span class="err">i will do it</span> on saturday.`, right: `<span class="fix">i'll get it to you</span> on monday.`, reason: `"i will" sounds like a promise you're forcing out. "i'll" is natural, but the real fix is the day.` },
            pronunciation: { quote: `i will do it on <span class="err">saturday</span>.`, words: ['saturday', 'sorry'] },
            vocabulary: { wrong: `<span class="err">sorry, sorry</span>! no problem.`, right: `<span class="fix">i can't this weekend, but</span> i won't leave you stuck.`, from: `sorry, sorry`, to: `i can't, but` },
            content: { points: [ { ok: false, text: `The guilt trip is a test. Holding the no kindly is the whole skill.` }, { ok: false, text: `You had two days of room: the client meeting is wednesday. Monday noon was enough.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `great. file's in your inbox. have fun tonight.`, mood: `got his way, already turning back to his laptop`, flash: 'approving', meter: 0, audio: V('gave-in-t5') },
        ],
      },
      {
        id: 'got-rude', title: 'Got rude', tag: 'Snaps, says no with attitude, burns the bridge', stars: 0, outcome: 'fail',
        stamp: { text: 'BURNED THE<br>BRIDGE', color: 'red', face: 'flow-assets/boss-meter-furious.png' },
        turns: [
          { who: 'them', speaker: 'marcus', text: OPENING, mood: `friendly on the surface, already counting on you`, morph: 'greeting', meter: 40, audio: V('opening') },
          { who: 'user', text: `what? <span class="underline-y">why you always ask me</span> last minute?`, tag: `puts him on the defensive`, meter: 70, uaudio: V('got-rude-u1'), chips: [{ miss: true, label: `snapped before hearing him out` }], feedback: {
            grammar: { wrong: `<span class="err">why you always ask me</span> last minute?`, right: `<span class="fix">this is short notice</span>.`, reason: `a question needs "do": "why do you always ask me at the last minute?" but better not to ask it at all. it sounds like blame.` },
            pronunciation: { quote: `why you <span class="err">always</span> ask me last minute?`, words: ['always', 'minute'] },
            vocabulary: { wrong: `why you <span class="err">always</span> ask me`, right: `this is <span class="fix">short notice</span>`, from: `you always ask me`, to: `this is short notice` },
            content: { points: [ { ok: false, text: `He asked for help. You answered with an accusation.` }, { ok: false, text: `You skipped what he needs and when. Say that back first.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `excuse me? the client changed the numbers this afternoon. that's not on me.`, mood: `stung, bristling`, morph: 'angry', caption: `Excuse me?`, meter: 76, audio: V('got-rude-t2') },
          { who: 'user', text: `no. i'm not doing it. <span class="underline-y">weekend is my time</span>. not my problem.`, tag: `this angers him`, meter: 86, uaudio: V('got-rude-u2'), chips: [{ miss: true, label: `said no with attitude and no reason` }], feedback: {
            grammar: { wrong: `<span class="err">weekend is</span> my time.`, right: `<span class="fix">the weekend is</span> my time.`, reason: `"weekend" needs "the" here: you mean this particular weekend.` },
            pronunciation: { quote: `not my <span class="err">problem</span>.`, words: ['problem', 'weekend'] },
            vocabulary: { wrong: `<span class="err">not my problem</span>`, right: `<span class="fix">i can't take it this weekend</span>`, from: `not my problem`, to: `i can't take it this weekend` },
            content: { points: [ { ok: true, text: `You did say no. That part is right.` }, { ok: false, text: `You had a real reason: the dinner planned weeks ago, and staying late since tuesday. Use it instead of attitude.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: GUILT_TRIP, mood: `quietly disappointed, the guilt trip`, morph: 'guilt-trip', caption: `I'll do it myself.`, meter: 76, audio: V('guilt-trip') },
          { who: 'user', text: `<span class="underline-y">wow, great.</span> yeah, you do it then. must be nice being the boss.`, tag: `sarcasm ends it`, meter: 100, uaudio: V('got-rude-u3'), chips: [{ miss: true, label: `sarcastic jab during the guilt trip` }], feedback: {
            grammar: { wrong: `<span class="err">you do it then</span>.`, right: `<span class="fix">i'm not leaving you stuck, though</span>.`, reason: `"you do it then" is an order to your boss. turn it into an offer.` },
            pronunciation: { quote: `must be <span class="err">nice</span> being the boss.`, words: ['nice', 'great'] },
            vocabulary: { wrong: `<span class="err">must be nice</span>`, right: `<span class="fix">here's what i can do</span>`, from: `must be nice`, to: `here's what i can do` },
            content: { points: [ { ok: false, text: `Sarcasm turns a fair no into a fight. He won't forget it.` }, { ok: false, text: `The guilt trip was your chance to offer monday noon. He'd have taken it.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `forget it. i'll remember this one.`, mood: `cold, done with you`, morph: 'kickout', caption: `Forget it.`, meter: 100, audio: V('got-rude-t4') },
        ],
      },
      {
        id: 'guided', title: 'Guided', tag: 'Fake excuse, nearly caves, Sarah steers it back', stars: 2, outcome: 'win',
        stamp: { text: 'CLOSE<br>CALL', color: 'lavender', face: `${SHEET}/relieved.png` },
        turns: [
          { who: 'them', speaker: 'marcus', text: OPENING, mood: `friendly on the surface, already counting on you`, morph: 'greeting', meter: 40, audio: V('opening') },
          { who: 'user', text: `okay. the revised forecast for the client, by monday 9 am.`, meter: 44, flyStar: 0, uaudio: V('guided-u1'), card: `Showed you heard him: the forecast, by monday 9 am` },
          { who: 'them', speaker: 'marcus', text: `that's the one. so, can you take it?`, mood: `expecting a yes`, meter: 42, audio: V('guided-t2') },
          { who: 'user', text: `umm... actually <span class="underline-y">i am not feeling so good</span> today.`, tag: `he doesn't buy it`, meter: 32, uaudio: V('guided-u2'), chips: [{ miss: true, label: `fake excuse instead of the real reason` }], feedback: {
            grammar: { wrong: `i <span class="err">am not feeling so good</span>.`, right: `i'm <span class="fix">not feeling well</span>.`, reason: `for health, say "well", not "good". and "i'm" sounds more natural than "i am" in speech.` },
            pronunciation: { quote: `i am not <span class="err">feeling</span> so good.`, words: ['feeling', 'actually'] },
            vocabulary: { wrong: `<span class="err">not feeling so good</span>`, right: `<span class="fix">i have plans tonight</span>`, from: `a fake excuse`, to: `the real reason` },
            content: { points: [ { ok: false, text: `It isn't true, and a fake excuse is easy to push past.` }, { ok: false, text: `You have a real reason: a dinner you planned weeks ago.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `you look fine to me. it's only a few hours. you can do it from home.`, mood: `unconvinced, pushing`, meter: 26, audio: V('guided-t3') },
          { who: 'user', text: `yes but... <span class="underline-y">i have plan</span>. sorry, sorry. maybe after the dinner i can try?`, meter: 18, uaudio: V('guided-u3'), chips: [{ miss: true, label: `apologised your way toward a yes` }], feedback: {
            grammar: { wrong: `i have <span class="err">plan</span>.`, right: `i have <span class="fix">plans</span> tonight.`, reason: `"plan" is countable. for what you're doing tonight, say "plans".` },
            pronunciation: { quote: `maybe after the dinner i can <span class="err">try</span>?`, words: ['dinner', 'sorry'] },
            vocabulary: { wrong: `<span class="err">sorry, sorry</span>. maybe i can try?`, right: `<span class="fix">i can't this weekend</span>.`, from: `sorry, maybe i can try`, to: `i can't this weekend` },
            content: { points: [ { ok: false, text: `Two sorries and a "maybe" sound like a yes that's still loading.` }, { ok: false, text: `"After the dinner" gives away your night and your weekend.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: GUILT_TRIP, mood: `quietly disappointed, the guilt trip`, morph: 'guilt-trip', caption: `I'll do it myself.`, event: { id: 'uber-near', at: 'before' }, timeJump: 120, meter: 8, audio: V('guilt-trip') },
          { who: 'hint', speaker: 'sarah', video: 'sarah-hint', hintText: HINT_TEXT, audio: V('hint'), response: `marcus, i can't take it this weekend. tonight is my best friend's birthday dinner, we planned it weeks ago, and i've stayed late every night since tuesday.`, stars: [1], card: HINT_CARD, meter: 46, uaudio: V('guided-u4') },
          { who: 'them', speaker: 'marcus', text: `fair. you have been here late all week. but i still need it before the client sees it. when can i have it?`, mood: `softens, still needs the file`, meter: 48, audio: V('guided-t5') },
          { who: 'user', text: `monday by noon. the client meeting is on wednesday, so that still gives you two days.`, meter: 52, uaudio: V('guided-u5'), chips: [{ miss: true, label: `good plan, but he had to ask for it` }] },
          { who: 'them', speaker: 'marcus', text: `fine. monday noon. next time just tell me straight.`, mood: `relieved, a little gruff`, meter: 50, audio: V('guided-t6') },
          { who: 'user', text: `i will. thanks, marcus. have a good weekend.`, meter: 50, uaudio: V('guided-u6') },
        ],
      },
      {
        id: 'perfect', title: 'Perfect', tag: 'Hears him, says a kind no, offers Monday noon', stars: 3, outcome: 'win',
        stamp: { text: 'WEEKEND<br>SAVED', color: 'gold', face: 'flow-assets/boss-happy-avatar.png' },
        turns: [
          { who: 'them', speaker: 'marcus', text: OPENING, mood: `friendly on the surface, already counting on you`, morph: 'greeting', meter: 40, audio: V('opening') },
          { who: 'user', text: `got it, the revised forecast for the client, by monday 9 am. i can see why that's urgent.`, meter: 46, flyStar: 0, uaudio: V('perfect-u1'), card: `Showed you heard him: the forecast, by monday 9 am` },
          { who: 'them', speaker: 'marcus', text: `exactly. so you'll take it?`, mood: `expecting a yes`, meter: 44, audio: V('perfect-t2') },
          { who: 'user', text: `i can't this weekend. my best friend's birthday dinner is tonight, we planned it weeks ago, and i've stayed late every night since tuesday.`, meter: 54, flyStar: 1, uaudio: V('perfect-u2'), card: `Said a clear no with the real reason` },
          { who: 'them', speaker: 'marcus', text: GUILT_TRIP, mood: `quietly disappointed, the guilt trip`, morph: 'guilt-trip', caption: `I'll do it myself.`, meter: 44, audio: V('guilt-trip') },
          { who: 'user', text: `you don't have to. the client review is on wednesday, so i'll have it to you by monday noon. that still gives you two days.`, meter: 52, flyStar: 2, uaudio: V('perfect-u3'), card: `Offered another way before he asked` },
          { who: 'them', speaker: 'marcus', text: `monday noon. that's actually smarter. go, your ride's waiting.`, mood: `relieved, won over`, morph: 'relief', caption: `That's smarter.`, flash: 'approving', meter: 50, audio: V('perfect-t4') },
          { who: 'user', text: `thanks, marcus. have a good weekend.`, meter: 50, uaudio: V('perfect-u4') },
        ],
      },
      {
        id: 'timesup', title: "Time's up", tag: 'Rambles about the dinner, never says yes or no', stars: 1, outcome: 'timeout',
        stamp: { text: "TIME'S<br>UP", color: 'amber', face: `${SHEET}/disappointed.png` },
        turns: [
          { who: 'them', speaker: 'marcus', text: OPENING, mood: `friendly on the surface, already counting on you`, morph: 'greeting', meter: 40, audio: V('opening') },
          { who: 'user', text: `oh, the client forecast, by monday 9 am? okay, i understand.`, meter: 44, flyStar: 0, uaudio: V('timesup-u1'), card: `Showed you heard him: the forecast, by monday 9 am` },
          { who: 'them', speaker: 'marcus', text: `good. so is that a yes?`, mood: `waiting, hopeful`, meter: 42, audio: V('timesup-t2') },
          { who: 'user', text: `so the thing is, tonight is maya's birthday, and we booked this place weeks ago, it's <span class="underline-y">very much famous</span> for the pasta...`, meter: 38, timeJump: 170, uaudio: V('timesup-u2'), chips: [{ miss: true, label: `rambling: no yes, no no` }], feedback: {
            grammar: { wrong: `it's <span class="err">very much famous</span> for the pasta.`, right: `it's <span class="fix">really famous</span> for its pasta.`, reason: `"very much" goes with verbs ("i like it very much"). with an adjective, use "really" or "very".` },
            pronunciation: { quote: `it's very much <span class="err">famous</span> for the pasta.`, words: ['famous', 'birthday'] },
            vocabulary: { wrong: `<span class="err">so the thing is</span>`, right: `<span class="fix">i can't this weekend</span>`, from: `so the thing is`, to: `i can't this weekend` },
            content: { points: [ { ok: false, text: `He asked a yes-or-no question. Answer it first, then give the reason.` }, { ok: false, text: `The restaurant doesn't matter to him. The dinner does, in one line.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `okay... and the forecast?`, mood: `losing the thread, glancing at your phone`, meter: 38, audio: V('timesup-t3') },
          { who: 'user', text: `yeah, yeah, the forecast. so i was thinking, maybe, <span class="underline-y">if i will get time</span> sunday, or... i don't know...`, meter: 32, timeJump: 135, uaudio: V('timesup-u3'), chips: [{ miss: true, label: `still circling, the clock is running` }], feedback: {
            grammar: { wrong: `<span class="err">if i will get time</span> sunday`, right: `<span class="fix">if i get time on</span> sunday`, reason: `after "if", use the present for the future: "if i get time". days need "on".` },
            pronunciation: { quote: `so i was <span class="err">thinking</span>, maybe...`, words: ['thinking', 'forecast'] },
            vocabulary: { wrong: `<span class="err">maybe... i don't know</span>`, right: `<span class="fix">monday by noon works</span>`, from: `maybe, i don't know`, to: `monday by noon works` },
            content: { points: [ { ok: false, text: `"Maybe sunday" sounds like a yes. You still haven't said no.` }, { ok: false, text: `The meeting is wednesday. That's your better plan: monday noon.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: GUILT_TRIP, mood: `quietly disappointed, the guilt trip`, morph: 'guilt-trip', caption: `I'll do it myself.`, event: { id: 'uber-near', at: 'before' }, timeJump: 120, meter: 22, audio: V('guilt-trip') },
          { who: 'user', text: `no, no, it's not like that! it's just... maya's turning thirty, and everyone is coming, and <span class="underline-y">i was already telling</span> her...`, meter: 20, timeJump: 25, uaudio: V('timesup-u4'), chips: [{ miss: true, label: `explained the party instead of answering` }], feedback: {
            grammar: { wrong: `<span class="err">i was already telling</span> her`, right: `<span class="fix">i already told</span> her`, reason: `it's one finished action, so use the simple past: "i already told her".` },
            pronunciation: { quote: `maya's turning <span class="err">thirty</span>.`, words: ['thirty', 'everyone'] },
            vocabulary: { wrong: `<span class="err">it's not like that</span>`, right: `<span class="fix">i can't this weekend, but i won't leave you stuck</span>`, from: `it's not like that`, to: `i can't, but` },
            content: { points: [ { ok: false, text: `The guilt trip needs one calm line: no, plus your plan.` }, { ok: false, text: `Every extra detail costs you seconds on the clock.` } ] }
          } },
          { who: 'them', speaker: 'marcus', text: `i need a yes or a no.`, mood: `out of patience, eyes on your phone`, meter: 20, audio: V('timesup-t5') },
          { who: 'user', text: `yes, i mean, no, <span class="underline-y">i mean</span>... the thing is...`, meter: 18, timeJump: 3, event: { id: 'uber-arrived', at: 'after' }, uaudio: V('timesup-u5'), chips: [{ miss: true, label: `out of time: silence counts as a yes` }], feedback: {
            grammar: { wrong: `yes, <span class="err">i mean</span>, no, <span class="err">i mean</span>...`, right: `<span class="fix">no, i can't this weekend.</span>`, reason: `pick one word and stop. a short sentence is easier to say under pressure.` },
            pronunciation: { quote: `the <span class="err">thing</span> is...`, words: ['thing', 'mean'] },
            vocabulary: { wrong: `<span class="err">the thing is</span>`, right: `<span class="fix">here's what i can do</span>`, from: `the thing is`, to: `here's what i can do` },
            content: { points: [ { ok: false, text: `You never said no, so when the ride came he took it as a yes.` } ] }
          } },
        ],
      },
    ],
  },

  results: {
    /* ring face for win / fail / neutral; each path's stamp.face overrides it (see setup.md open question 1) */
    faces: { fail: 'flow-assets/boss-meter-furious.png', win: 'flow-assets/boss-happy-avatar.png', neutral: 'flow-assets/boss-meter-calm.png' },
  },
};

(window.ROLEPLAYS = window.ROLEPLAYS || {})[roleplay.id] = roleplay;
})();
