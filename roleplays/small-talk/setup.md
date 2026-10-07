# Small talk with a coworker: setup

Setup and path list. The full script lives in `roleplays/small-talk.js`; this page explains it.

## 1. Pitch

Ryan just moved to your team. 90 seconds by the coffee machine on his first morning. Find something he cares about, and turn him into a work friend.

- **Id:** `small-talk` · **Game type:** small talk (you lose when he stops caring and drifts off)
- **Ryan:** a coworker who moved to your team this morning and now sits two desks away. Friendly and easy-going, but polite-distracted: half on his phone, answering on autopilot until you say something specific.
- **Sarah:** the guide, once, in the Guided path.
- **The player:** no name, faceless purple silhouette. Nobody uses the player's name.
- **Setting:** same office, same week as the other roleplays. Ryan used to sit on the other side of the floor, so you've said "hey" for months but never really talked. Marcus is mentioned once, by the player in Time's up.

## 2. Situation and facts

Monday, 8:52 AM. Ryan carries in a box of his desk things, sets it down two desks from you and goes to make coffee. You follow him to the kitchen. His coffee takes 90 seconds.

To win, the player has to notice these three things in the story (the hidden topics):

| Topic | What the story shows | What Ryan will talk about |
|---|---|---|
| Medal | his half-marathon medal rides in on top of the box; he hangs it on his monitor | his first half marathon, yesterday: 2:04, legs wrecked, his sister made him bring it in |
| Dog | his phone lights up on the counter: a scruffy dog in a yellow raincoat (the app draws the lock-screen card) | Pickle, his rescue terrier, who ran one mile in training and then sat down |
| Move | he carries in a cardboard box and takes the empty desk two away | day one on your team; he asked to move for the new projects, but doesn't know anyone on this side of the floor yet |

The videos show no words or labels. The narrator says he just moved to your team.

## 3. Story

| # | What we see | Narrator | Thought bubble | Sound |
|---|---|---|---|---|
| 1 (hero) | Ryan arrives with a cardboard box of desk things, the medal on top. He sets it down at the empty desk two away and hangs the medal on his monitor. Rings on the box, then the medal. | Monday, 8:52 AM. Ryan just moved to your team, two desks away | huh. is that a race medal? | hum, soft pad, footsteps, a chime per ring |
| 2 | He takes an empty mug out of the box and heads for the kitchen. The player stands up with their own mug and follows. | You've passed him in the hallway for months. You've never really talked | coffee... good excuse to say hi. | pad, footsteps |
| 3 | At the coffee machine he sets his mug down; his phone lights up on the counter. Ring on the phone; the app draws the lock-screen card (the dog). | At the coffee machine, his phone lights up. That has to be his dog | okay... that's three things to talk about. | kitchen hum, one chime |
| 4 | He presses brew, the coffee starts to pour, and he glances over at you. | His coffee takes 90 seconds. That's all the time you get | say something... but not "how's it going". | ticks start, whoosh, then silence |

The story screen draws only `ring` today (the medal in scene 1); `rings` lists both scene-1 rings for when it can draw more than one.

**Face-off:** `YOU with RYAN` ("with" in yellow, where Leave puts "vs"). Tagline: *90 seconds. make a work friend.*

**Mission**
- Goal: *Turn <span class="hl">Ryan</span> into a work friend before his coffee is done*
- Stars:
  1. **open well**: skip "how's it going", start with something real
  2. **find his topic**: ask about something you noticed
  3. **leave with a hook**: end with a reason to talk again
- Clock: *his coffee takes <b>90 seconds</b>. then he's back at his desk*

## 4. Conversation pieces

**Spark meter** (Leave's anger meter flipped, and it drains)
- Starts at 50 out of 100.
- Drains by 1 point every second, only while the mic waits for the player. It pauses during his lines, his clips and the phone.
- Refills: a specific detail or a real question gives +15, unlocking a topic gives +25.
- Drops: a generic line (weather, "busy?", "how's it going") takes -10, talking over his phone takes -15.
- You lose at 0. He plays his leaves clip and says *"anyway, i should get back to it."*
- Faces by level: bored (0-25), neutral (26-55), interested (56-80), delighted (81-100).
- In scripted paths each turn sets the spark value, the same way Leave's turns set anger.

**Three topic slots:** three empty slots under the meter: a medal (*his first half marathon*), a paw (*pickle, his rescue dog*) and a box (*his move to your team*). A slot unlocks when the player names the thing and asks about it, e.g. "is that a half-marathon medal on your monitor?" Something vague like "nice phone" doesn't count. The first unlock earns star 2.

**Coffee clock:** 1:30, counting down like Leave's meeting clock. When it hits zero the coffee is ready and he heads back politely, reusing his leaves clip with a different caption. Line: *"that's my coffee. good talking to you."*

**Surprise moment: his phone buzzes.** At about 0:45 on the clock, the checks-phone clip plays and spark drops by 20. His line: *"oh, sorry, one sec. it's my old team."* The player has to wait, then win him back with a specific question.

**Sarah's hint** (Guided only, when spark drops below 10):
- Hint text: *"don't fill the silence with your week. ask about something you saw, like the medal on his monitor."*
- Card: `Found a topic he cares about`
- Taking the hint gives star 2 but caps the run at 2 stars.

**Ryan assets** (on his character sheet, `characters/ryan/character.json`)
- Meter faces: bored, neutral, interested, delighted (also the results faces).
- Clips: greeting (his opening), laugh (Pickle), checks-phone (the surprise moment), leaves (spark at 0, and again when the clock runs out).

**Opening line (Ryan):** *"hey, morning. guess we're desk neighbors now. how was your weekend?"*

## 5. Paths

| id | Title | What happens | Stars | Ending | Turns |
|---|---|---|---|---|---|
| `awkward` | Awkward | "Fine", then "how's it going", the weather, and talks over his phone. He drifts off | 0 | HE DRIFTED OFF | 8 |
| `guided` | Guided | Good open (the taco truck), then "busy week?". After the phone he's slipping away; Sarah points out the medal, and the race talk saves it | 2 | CLOSE CALL | 12 |
| `perfect` | Perfect | Asks about the medal first, makes him laugh about Pickle, waits out the phone, asks about his move to the team, and ends with a hook. He suggests lunch | 3 | LET'S GRAB LUNCH | 10 |
| `timesup` | Time's up | Good open, then rambles about the client forecast, a slow laptop and the coffee machine. Never asks about him | 1 | TIME'S UP | 8 |

- `defaultPath`: `awkward`, the same way Leave defaults to Poor.
- LET'S GRAB LUNCH needs 3 stars and all 3 topics; Perfect is the only scripted path that gets both.

**Perfect path, outline**
1. "is that a half-marathon medal on your monitor?" unlocks the medal and earns stars 1 and 2.
2. "the dog on your lock screen, the one in the yellow raincoat, is he yours?" unlocks the dog and plays the laugh clip.
3. His phone buzzes and the player waits.
4. "i saw you carry that box in. did you just move to our team?" unlocks the move. *"yep, day one. ... i don't know anyone on this side of the floor yet."*
5. Hook, star 3: "i'd love to hear how you trained for it, if you ever have 20 minutes."

## 6. Endings

| Stamp | Colour | Path | Ryan's last line |
|---|---|---|---|
| LET'S GRAB LUNCH | gold (win, secret) | perfect | "let's grab lunch thursday. i'll tell you every mistake i made, and you can tell me who's who around here." |
| CLOSE CALL | lavender | guided | "ha, thanks. good chatting. have a good one." |
| HE DRIFTED OFF | red (fail) | awkward | "anyway, i should get back to it." |
| TIME'S UP | amber | timesup | "that's my coffee. good talking to you." |
| NEW WORK FRIEND | gold (win) | none in the script | "this was fun. come find me at the taco truck friday." Kept in the AI notes for a 3-star run that misses a topic. |
