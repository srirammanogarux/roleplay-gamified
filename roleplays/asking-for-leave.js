/* ════════════════════════════════════════════════════════════════
   Roleplay file · Asking for leave
   Game type: asking for something (you lose when he says no).

   The words and rules of one roleplay. The screens (story, conversation,
   results) read everything roleplay-specific from here; the engine stays
   the same for every roleplay. See GLOSSARY.md for the terms.
   ════════════════════════════════════════════════════════════════ */
(function () {
const OPENING = `hey make it quick. i've got a client meeting in 5 minutes. i hope your tasks are done? tomorrow we have a big day to nail!`;

const roleplay = {
  id: 'asking-for-leave',
  title: 'Asking for leave',
  gameType: 'asking-for-something',
  character: 'marcus',

  /* Row on the topics list */
  topic: { label: 'Asking for leave to a<br>rude boss', avatar: 'flow-assets/av-rude-boss.png', bg: '#746344' },

  /* AI-ready notes: enough for a live AI to play Marcus and judge the stars.
     The scripted paths below double as example answers for that judge. */
  ai: {
    personality: `marcus, the boss. serious, stressed, short on time. respects people who get to the point and show their work is covered. hates vagueness and arguing. softens when given a real reason and a plan. speaks in short, clipped, lowercase lines.`,
    facts: [
      `it's the evening before a big client handoff; marcus has a client meeting in 5 minutes.`,
      `your tasks for the week are finished, tested, and the docs are with the team.`,
      `you need tomorrow off to take your mom for a health checkup; she's had a fever for 2 days.`,
      `jack can cover for you; you'll keep your phone on.`,
    ],
    stars: [
      { id: 'work-done', rule: `answers his question first: says the work is done (tested, docs handed over).` },
      { id: 'ask-right', rule: `asks directly for tomorrow off and gives the real reason in one line. vague asks ("not here", "personal work") don't count.` },
      { id: 'cover-gap', rule: `offers the coverage plan (jack has everything, phone on) before he has to ask for it, without arguing.` },
    ],
    lose: `the anger meter reaches 100 (he says no and ends it), or the 5-minute clock runs out.`,
  },

  /* Story: scenes play in order, then the face-off and the mission.
     Times are seconds from the start of the scene. Sound cues use the
     story screen's small sound library (hum, pad, ticks, whoosh, …). */
  story: {
    title: 'Asking for Leave',
    scenes: [
      { videos: ['videos/slide1_deadline_silent.mp4'], dur: 8.0,
        ring: { at: 0.5, style: 'left:61%; top:7.5%; width:37%; height:26%;' },
        narrator: { at: 0.4, text: 'Your boss is generally serious & he has to hand off a client project tomorrow' },
        cloud: { at: 4.0, text: 'client handoff tomorrow... are we even ready?', tail: 'br', style: 'left:7%; top:24%;' },
        sound: [
          { at: 0, hum: { level: 0.05, freq: 280 }, id: 'hum' },
          { at: 0, ticks: 1000, id: 'tick' },
          { at: 4.0, whoosh: true },
          { at: 7.5, stop: 'hum' }, { at: 7.5, stop: 'tick', hard: true },
        ] },
      { videos: ['videos/slide2_workdone_silent.mp4'], dur: 8.0, transition: { type: 'crossfade', dur: 400 },
        narrator: { at: 0.4, text: "You've finished every task on your plate for the week" },
        cloud: { at: 3.5, text: 'finally, all done for the week.', tail: 'bl', style: 'right:7%; top:26%;' },
        sound: [
          { at: 0, pad: { freqs: [196, 247, 294], level: 0.05 }, id: 'pad' },
          { at: 0.8, creak: true },
          { at: 3.5, chime: 660 },
          { at: 7.5, stop: 'pad' },
        ] },
      { videos: ['videos/slide3_theask_silent.mp4'], dur: 9.0, tint: 'night', transition: { type: 'fadedark', dur: 400 },
        narrator: { at: 0.4, text: 'You need tomorrow off. Asking him is the hard part' },
        cloud: { at: 5.5, text: 'i need tomorrow off... but how do i even ask him?', tail: 'bl', style: 'right:6%; top:20%;' },
        sound: [
          { at: 0, hum: { level: 0.035, freq: 180 } },
          { at: 0.5, heartbeat: 1200 },
          { at: 7.0, silence: true },
        ] },
      /* two clips stitched on the door-open frame */
      { videos: ['videos/slide4a_walk_silent.mp4', 'videos/slide4_cabin_silent.mp4'], stitchAt: 5.7, dur: 14.0, transition: { type: 'fade', dur: 300 },
        narrator: { at: 0.4, text: 'That evening, you walk to his cabin to ask him face to face' },
        cloud: { at: 12.0, text: 'okay... here goes.', tail: 'down', style: 'left:50%; transform-origin:center; margin-left:-80px; bottom:22%;' },
        sound: [
          { at: 0, hum: { level: 0.04, freq: 240 }, id: 'hall' },
          { at: 0.8, footstep: true }, { at: 1.6, footstep: true }, { at: 2.4, footstep: true }, { at: 3.2, footstep: true },
          { at: 5.7, door: true }, { at: 5.7, stop: 'hall' },
          { at: 6.0, hum: { level: 0.03, freq: 320 } },
          { at: 6.0, pen: true },
          { at: 10.2, silence: true },
        ] },
    ],
    faceoff: {
      transition: { type: 'hardcut', dur: 0 },
      them: { name: 'the boss', img: 'img/boss-goal.png' },
      you: { name: 'you', img: 'img/you.png' },
      headline: 'YOU <span style="color:var(--yellow)">vs</span> THE BOSS',
      tagline: 'one shot. say it right.',
    },
    mission: {
      transition: { type: 'crossfade', dur: 400 },
      goal: 'Goal: Walk out with a <span class="hl">yes</span> for tomorrow off',
      stars: [
        { title: 'show your work is done', sub: 'your tasks for the week are finished' },
        { title: 'ask right', sub: 'name the day and the reason in one line' },
        { title: 'cover the gap', sub: "offer a plan before he asks, don't argue" },
      ],
      clock: "he's rushing to a meeting, you have <b>5 minutes</b> to convince him",
    },
  },

  /* Conversation: the meter, the clock, the character's moments, and the paths. */
  conversation: {
    eyebrow: 'Asking for leave · Rude boss',
    opening: OPENING,
    avatar: 'boss.png',
    meter: { start: 8, idle: 12, faces: 'flow-assets/boss-meter-{face}.png' },
    clock: {
      seconds: 300,
      /* when it runs out, he leaves for his meeting */
      exit: { line: `i've got to run to my meeting. we'll pick this up later.`, src: 'flow-assets/boss-meeting-exit.mp4', poster: 'flow-assets/boss-meeting-exit-poster.jpg', hold: 4.6, caption: `I've got a meeting.` },
    },
    /* takeover videos: the meter's face lifts to the centre and plays one */
    moments: {
      greeting: { src: 'flow-assets/boss-intro.mp4', poster: 'flow-assets/boss-intro-poster.jpg', caption: `Hello there!` },
      angry:    { src: 'flow-assets/boss-angry.mp4', poster: 'flow-assets/boss-angry-poster.jpg', hold: 2.0, caption: `Tomorrow?!` },
      kickout:  { src: 'flow-assets/boss-kickout.mp4', poster: 'flow-assets/boss-kickout-poster.jpg', hold: 4.6, caption: `We're done here.` },
    },
    hint: { video: 'flow-assets/sarah-hint.mp4', poster: 'flow-assets/sarah-hint-poster.jpg', avatar: 'flow-assets/av-introduction.png', card: `Asked right: the day and the reason` },
    defaultPath: 'poor',
    paths: [
      {
        id: 'poor', title: 'Poor response', tag: 'Fumbles the ask, argues, walks out with nothing', stars: 0, outcome: 'fail',
        turns: [
          { who: 'boss', text: OPENING, mood: `busy, short on patience`, morph: 'greeting', anger: 14, audio: 'flow-assets/voice/v-opening.mp3' },
          { who: 'user', text: `sir, actually... i wanted to talk about something. it's <span class="underline-y">kind of</span> important. i mean, if you have time.`, anger: 30, uaudio: 'flow-assets/voice/v-poor-u1.mp3', chips: [{ miss: true, label: `ignored his question, buried the ask` }], feedback: {
            grammar: { wrong: `it's <span class="err">kind of</span> important.`, right: `it's <span class="fix">important</span>.`, reason: `"kind of" softens your message until it disappears. if it matters, say it matters.` },
            pronunciation: { quote: `i wanted to talk about <span class="err">something</span>.`, words: ['something', 'important'] },
            vocabulary: { wrong: `talk about <span class="err">something</span>`, right: `ask <span class="fix">for a day off</span>`, from: `talk about something`, to: `ask for a day off` },
            content: { points: [ { ok: false, text: `He asked if your work is done. Answer that first.` }, { ok: false, text: `You hinted instead of asking. Say what you want.` } ] }
          } },
          { who: 'boss', text: `i asked about your tasks. is it done or not? i've got a client meeting to attend in sometime.`, mood: `pressed, patience thinning`, anger: 48, audio: 'flow-assets/voice/v-poor-b2.mp3' },
          { who: 'user', text: `yes yes, it's done. so... <span class="underline-y">can i not come in</span> tomorrow? i have some personal work.`, tag: `this angers the boss`, anger: 74, uaudio: 'flow-assets/voice/v-poor-u2.mp3', chips: [{ miss: true, label: `asked for the client day with no reason` }], feedback: {
            grammar: { wrong: `<span class="err">can i not come in</span> tomorrow?`, right: `<span class="fix">could i take tomorrow off</span>?`, reason: `"can i not come in" sounds like dodging work. ask for the day directly.` },
            pronunciation: { quote: `i have some <span class="err">personal</span> work.`, words: ['personal', 'tomorrow'] },
            vocabulary: { wrong: `some <span class="err">personal work</span>`, right: `a <span class="fix">family commitment</span>`, from: `personal work`, to: `family commitment` },
            content: { points: [ { ok: false, text: `On the day of a client handoff, "personal work" sounds like an excuse.` }, { ok: false, text: `Give a reason he can respect, then show the day is covered.` } ] }
          } },
          { who: 'boss', text: `are you kidding me! tomorrow we have the client handoff and you want to vanish for "personal work"? no. you'll be at your desk.`, mood: `furious, done being patient`, morph: 'angry', caption: `Tomorrow, what???`, anger: 86, audio: 'flow-assets/voice/v-poor-b3.mp3' },
          { who: 'user', text: `but sir, my work is finished! why does it even matter if i'm here?`, anger: 92, uaudio: 'flow-assets/voice/v-poor-u3.mp3', chips: [{ miss: true, label: `argued instead of helping him say yes` }] },
          { who: 'boss', text: `because tomorrow has to go perfectly. that's why. give me one reason i can defend to the client.`, mood: `cold, final warning`, anger: 90, audio: 'flow-assets/voice/v-poor-b4.mp3' },
          { who: 'user', text: `i just... really need the day, sir. i can't tell you everything.`, anger: 97, uaudio: 'flow-assets/voice/v-poor-u4.mp3', chips: [{ miss: true, label: `no reason, no plan, no trust` }] },
          { who: 'boss', text: `then the answer is no. we're done here. be at your desk tomorrow.`, mood: `shuts it down`, morph: 'kickout', anger: 100, audio: 'flow-assets/voice/v-poor-b5.mp3' },
        ],
      },
      {
        id: 'guided', title: 'Guided response', tag: 'Strong start, fumbled ask, Sarah steers it back', stars: 2,
        turns: [
          { who: 'boss', text: OPENING, mood: `busy, short on patience`, morph: 'greeting', anger: 14, audio: 'flow-assets/voice/v-opening.mp3' },
          { who: 'user', text: `yes sir, all done. tested everything this morning and the docs are with the team.`, anger: 8, flash: 'approving', flyStar: 0, uaudio: 'flow-assets/voice/v-guided-u1.mp3', card: `Showed your work is done` },
          { who: 'boss', text: `good. so, what do you need? quickly.`, mood: `eases a little, watching the clock`, anger: 8, audio: 'flow-assets/voice/v-guided-b2.mp3' },
          { who: 'user', text: `well, actually sir... is it okay if i'm, you know... <span class="underline-y">not here</span> tomorrow? something's come up.`, anger: 44, uaudio: 'flow-assets/voice/v-guided-u2.mp3', chips: [{ miss: true, label: `vague ask: no day named, no reason` }], feedback: {
            grammar: { wrong: `is it okay if i'm <span class="err">not here</span> tomorrow?`, right: `<span class="fix">could i take tomorrow off</span>?`, reason: `"not here" sounds like dodging work. name the day and ask directly.` },
            pronunciation: { quote: `<span class="err">something's</span> come up.`, words: ['something', 'tomorrow'] },
            vocabulary: { wrong: `<span class="err">something's come up</span>`, right: `<span class="fix">my mom has a health checkup</span>`, from: `something's come up`, to: `a concrete reason` },
            content: { points: [ { ok: false, text: `He still doesn't know what you're asking for.` }, { ok: false, text: `A reason is what makes a yes possible.` } ] }
          } },
          { who: 'boss', text: `not here? tomorrow? the client handoff is tomorrow. what is "something"?`, mood: `tensing up fast`, anger: 64, audio: 'flow-assets/voice/v-guided-b3.mp3' },
          { who: 'user', text: `it's... personal, sir. i just really need the day.`, tag: `this angers the boss`, anger: 82, uaudio: 'flow-assets/voice/v-guided-u3.mp3', chips: [{ miss: true, label: `"personal" won't survive the client day` }], feedback: {
            grammar: { wrong: `i just <span class="err">really need</span> the day.`, right: `i need tomorrow <span class="fix">to take my mom for a checkup</span>.`, reason: `a vague need invites a no. a concrete reason invites a yes.` },
            pronunciation: { quote: `it's <span class="err">personal</span>, sir.`, words: ['personal', 'really'] },
            vocabulary: { wrong: `it's <span class="err">personal</span>`, right: `it's <span class="fix">my mom's health</span>`, from: `personal`, to: `the real reason` },
            content: { points: [ { ok: false, text: `He asked for a reason and you hid it.` }, { ok: false, text: `When the stakes are his, vagueness reads as evasion.` } ] }
          } },
          { who: 'boss', text: `"personal" doesn't cut it. not tomorrow. give me a reason i can defend, or the answer is no.`, mood: `furious, done being patient`, morph: 'angry', caption: `What the hell?`, anger: 88, audio: 'flow-assets/voice/v-guided-b4.mp3' },
          { who: 'hint', video: 'sarah-hint', hintText: `don't argue. give him the real reason, simply: name the day, the why, and remind him your work is done.`, response: `sir! tomorrow i have to take my mom for a health checkup, she's been having a severe fever for the past 2 days and i have to be there for her. also, my work is finished and handed over to jack. can you consider this situation and give me an off tomorrow?`, stars: [1], card: `Asked right: the day and the reason`, anger: 42, uaudio: 'flow-assets/voice/v-guided-hint.mp3' },
          { who: 'boss', text: `i'm sorry to hear that, family comes first. but tell me straight, does jack know the full picture? if the client asks something tomorrow, can he answer it?`, mood: `sincere, yet worried about the handoff`, anger: 30, audio: 'flow-assets/voice/v-guided-b5.mp3' },
          { who: 'user', text: `yes sir, i walked jack through everything this evening and he has all the docs. i'll keep my phone on the whole day too.`, anger: 18, flash: 'approving', uaudio: 'flow-assets/voice/v-guided-u5.mp3' },
          { who: 'boss', text: `alright. take tomorrow and be with her. if anything comes up i'll call jack first, you second. get going.`, mood: `yields, settles the plan`, anger: 12, audio: 'flow-assets/voice/v-guided-b6.mp3' },
          { who: 'user', text: `thank you, sir. i hope tomorrow goes great.`, anger: 8, uaudio: 'flow-assets/voice/v-guided-u6.mp3' },
        ],
      },
      {
        id: 'perfect', title: 'Perfect response', tag: 'Reads the room, wins him over', stars: 3,
        turns: [
          { who: 'boss', text: OPENING, mood: `busy, short on patience`, morph: 'greeting', anger: 14, audio: 'flow-assets/voice/v-opening.mp3' },
          { who: 'user', text: `yes sir, all done. tested everything this morning and the docs are with the team.`, anger: 6, flash: 'approving', flyStar: 0, uaudio: 'flow-assets/voice/v-guided-u1.mp3', card: `Showed your work is done` },
          { who: 'boss', text: `good. at least someone's ahead of it. so, what do you need?`, mood: `eases up, still wound tight`, anger: 8, audio: 'flow-assets/voice/v-perfect-b2.mp3' },
          { who: 'user', text: `sir, i'd like tomorrow off. my mom's not been well and i have to take her for a health checkup.`, anger: 16, uaudio: 'flow-assets/voice/v-perfect-u2.mp3', flyStar: 1, card: `Asked right: the day and the reason` },
          { who: 'boss', text: `tomorrow? the day of the client handoff? that's a bold ask right now.`, mood: `pushes back, testing you`, anger: 38, audio: 'flow-assets/voice/v-perfect-b3.mp3' },
          { who: 'user', text: `i know the timing's hard. everything i own is done and handed over to jack, i'll keep my phone on all day, and the team can reach me in minutes if anything breaks. you won't feel the gap.`, anger: 12, flash: 'approving', flyStar: 2, uaudio: 'flow-assets/voice/v-perfect-u3.mp3', card: `Covered the gap before he had to ask` },
          { who: 'boss', text: `alright. health comes first, and you've actually thought the coverage through. that's rare. take tomorrow. keep that phone close.`, mood: `won over, a little impressed`, anger: 6, flash: 'approving', audio: 'flow-assets/voice/v-perfect-b4.mp3' },
          { who: 'user', text: `thank you, sir. good luck with the client.`, anger: 4, uaudio: 'flow-assets/voice/v-perfect-u4.mp3' },
        ],
      },
      {
        id: 'timesup', title: "Time's up", tag: 'Rambles, runs out the clock', stars: 1, outcome: 'timeout',
        turns: [
          { who: 'boss', text: OPENING, mood: `busy, short on patience`, morph: 'greeting', anger: 14, audio: 'flow-assets/voice/v-opening.mp3' },
          { who: 'user', text: `good evening sir! i hope your day went well. i actually came by earlier but you were busy, so i thought i'd come back when you're free...`, anger: 26, uaudio: 'flow-assets/voice/v-timesup-u1.mp3', chips: [{ miss: true, label: `small talk on a 5-minute clock` }] },
          { who: 'boss', text: `i'm not free, i'm in a rush. what is it?`, mood: `clipped, eyeing the clock`, anger: 40, timeJump: 72, audio: 'flow-assets/voice/v-timesup-b2.mp3' },
          { who: 'user', text: `right, yes. so first, about my tasks, everything is done. i tested everything and the docs are with the team.`, anger: 30, flyStar: 0, uaudio: 'flow-assets/voice/v-timesup-u2.mp3', card: `Showed your work is done` },
          { who: 'boss', text: `good. and? get to the point.`, mood: `hurrying you along`, anger: 36, audio: 'flow-assets/voice/v-timesup-b3.mp3' },
          { who: 'user', text: `so i was thinking, you know how my cousin visited last month? there's this family thing tomorrow and, well, i was wondering if maybe...`, anger: 52, uaudio: 'flow-assets/voice/v-timesup-u3.mp3', chips: [{ miss: true, label: `still circling, the clock is bleeding out` }], timeJump: 22 },
          { who: 'boss', text: `tomorrow? say it straight, i have to walk out the door.`, mood: `one foot out the door`, anger: 60, audio: 'flow-assets/voice/v-timesup-b4.mp3' },
          { who: 'user', text: `yes, um, so basically what i'm trying to ask is...`, anger: 64, uaudio: 'flow-assets/voice/v-timesup-u4.mp3' },
          { who: 'boss', text: `out with it. now.`, mood: `zero time left`, anger: 68, audio: 'flow-assets/voice/v-timesup-b5.mp3' },
          { who: 'user', text: `okay okay, so, the thing is, there's this whole situation at home...`, anger: 70, uaudio: 'flow-assets/voice/v-timesup-u5.mp3' },
        ],
      },
    ],
  },

  results: {
    faces: { fail: 'flow-assets/boss-meter-furious.png', win: 'flow-assets/boss-happy-avatar.png', neutral: 'boss.png' },
  },
};

(window.ROLEPLAYS = window.ROLEPLAYS || {})[roleplay.id] = roleplay;
})();
