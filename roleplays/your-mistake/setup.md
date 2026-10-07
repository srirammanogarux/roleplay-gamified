# Telling your boss about your mistake · setup

id `your-mistake` · game type **Confessing** (you lose if he finds out first, or if he stops trusting you)

## 1. Pitch

You promised an important customer something yesterday and forgot. She's calling your boss in 5 minutes. Tell him before she does.

Who's in it: **Marcus** (the boss), **Sarah** (one hint, Guided path only), **Linda Park** (the customer, only ever seen as app-drawn message cards), the player (no name, never addressed by name).

The mistake is kept job-neutral on purpose so it fits retail, support, sales, healthcare or office work: "the details you promised", "the confirmation", "the customer". No industry words, no decks, no numbers.

## 2. Situation and facts

11:55 AM. At 12:00 Linda Park, one of the team's most important customers, calls Marcus.

Facts the story gives you (you need all of them to win):
- **Yesterday** you promised Linda the **confirmed details by end of day**. You **forgot**. Nothing went out.
- At 11:50 her follow-up lands in your inbox: *"still waiting on the details you promised yesterday?"* (app card, story scene 1).
- You've **already sent them now**, with a short apology. She has everything.
- She's **calling Marcus at noon**.
- Marcus **hates surprises more than mistakes**. This hints at the winning move: tell him now, plainly.

## 3. Story

| # | What we see (no text in video) | Narrator | Thought bubble | App card | Sound |
|---|---|---|---|---|---|
| 1 | Open office, late morning. The player's silhouette at a desk, working on a laptop (abstract grey bars on screen). A soft blue bar slides in at the top of the list. Wall clock (no digits) at ten to twelve; ring on the clock. | 11:50. Linda Park, one of your biggest customers, just wrote to you | yesterday...? | **Linda Park** · *Following up* · "still waiting on the details you promised yesterday?" | office hum, soft ticks, chime |
| 2 | Over the shoulder (hero): the player's eyes drift to a small **blank** yellow sticky note on the screen frame, it freezes, the camera pushes in on the note and the light cools. | Yesterday you promised her the confirmed details by end of day. You forgot | oh no. no no no. | | hum drops out, heartbeat |
| 3 | The player types fast, one last tap, sits back, then looks across the floor to Marcus in his glass office, getting ready for the call (closed notebook, phone face-down). | You've just sent them. But she's calling your boss at noon | maybe she won't bring it up...? | | pad, whoosh on send, ticks speed up |
| 4 | Walk across the floor to his glass door (two clips stitched on the door frame, like Leave scene 4). | Your boss hates surprises more than mistakes | he's going to kill me. | | footsteps, glass door, silence |

**Face-off:** `YOU vs THE BOSS` (same name as Leave) · tagline *tell him. before she does.*

**Mission**
- Goal: `Goal: Tell him what you forgot and walk out with his <span class="hl">trust</span>`
- Stars:
  1. **say it first** · tell him before the customer's message does
  2. **own it** · say "i forgot", no excuses
  3. **bring the fix** · it's sent now, give him a line for the call
- Clock: `the customer calls him at noon, you have <b>5 minutes</b> to tell him`

## 4. Conversation pieces

**Opening (Marcus):** `long week. tell me this is good news. linda park is calling me in 5 minutes.`
This is the one nod to the other roleplays: "long week" fits whichever one you played first.

**Meter: trust** (new label, same gauge; can run as anger = 100 − trust so the gauge code stays the same)
- Starts at **70**.
- **Drains while you stall:** about 2 points every 10 seconds of clock until you've said what you forgot (a turn marked `confessed`). The drain stops once you've said it.
- Hedging or small talk: −10 to −15. Excuses, blaming a busy day or the customer, "can we not bring it up": −15 to −25.
- **Refills:** owning it plainly +15, saying it's already sent +10 to +15, offering him a line for the call +10.
- **You lose** when trust hits **0** (he takes you off the account), or when Linda's message reaches him before you've said it.
- Faces: reuse `boss-meter-{calm,approving,irritated,angry,furious}`, read high trust = calm/approving, low = angry/furious.

**Clock:** 300 seconds from 11:55, same as Leave. Scripted paths jump it with `timeJump` (seconds left). When it hits 0, the clock's exit is the surprise moment below (her message lands right before the call), not Leave's meeting-exit video.

**Surprise moment: Linda's message lights up his phone** (`phone-email`)
- When: at 0:00 in Time's up, where it ends the run. In Guided and Perfect it lands at the end, after you've already told him, as the payoff.
- Video: Marcus's `reads-phone` clip (head tips down, screen glow on his chin). No phone or text in the video.
- Card the app draws over it: **Linda Park · customer** · *Before our call* · "i was promised the details yesterday. they only came this morning. can we talk about it at noon?"
- His line if you haven't told him: `"they only came this morning." ...were you going to tell me?`
- His line if you have: `that's her now. good thing i heard it from you first.` (Guided) / `there she is. "they only came this morning." and i already know why.` (Perfect)

**Sarah's hint** (Guided only, trust near 15): she says *"stop explaining. say 'i forgot', then tell him it's already sent."* Card: `Owned it, no excuses`. It grants star 2 and caps the run at 2 stars.

**Marcus clips and faces**

| Use | Asset | Status |
|---|---|---|
| greeting at the opening | `boss-intro.mp4` | reuse |
| you say it, his face drops | `goes-steely.mp4` (surprised → steely), caption *"Yesterday?"* | new, on his sheet |
| excuses land badly | `boss-angry.mp4`, caption *"Not your fault?"* | reuse |
| trust hits 0 | `boss-kickout.mp4`, caption *"You're off the account."* | reuse |
| Linda's message | `reads-phone.mp4` (calm → reading phone), caption *"It's linda."* | new, on his sheet |
| you bring the fix | `exhale.mp4` (steely → relieved) | new, on his sheet |
| meter faces | `boss-meter-*.png` | reuse |
| topic avatar | `av-your-mistake.png` | new |

## 5. Paths

Default path: `excuses`.

| id | Title | What happens | Stars | Ending | Turns |
|---|---|---|---|---|---|
| `excuses` | Made excuses | You shrink it ("a little bit late"), blame a busy day ("nobody reminded me"), then ask him not to bring it up. Trust hits 0. | 0 | OFF THE ACCOUNT | 9 |
| `guided` | Guided | You tell him right away (star 1), then blame your calls and the customer. Trust near 15, Sarah steps in, you say "i forgot", it's sent, you give him a line, and her message lands after. | 2 | CLOSE CALL | 11 |
| `perfect` | Perfect | First line: "i promised linda the details yesterday and i forgot to send them." Then "that's on me", it's sent, and a line he can open the call with. Her message lands, he's ready. | 3 | TRUST EARNED | 9 |
| `timesup` | Time's up | Small talk, then "i sent linda the details" (star 3) without saying what went wrong. He asks "was something wrong?", you circle, the clock hits 0, her message tells him first. | 1 | HE FOUND OUT FIRST | 11 |

Learner-English mistakes in the failing lines (each with Leave-style feedback cards and a miss chip):
- `she won't <span class="err">mind probably</span>` → `she probably won't mind` (and the content card: she will. she chased you for it.)
- `i <span class="err">have promised</span> her the details yesterday` → `i promised her the details yesterday`
- `i didn't <span class="err">forgot</span> on purpose` → `i didn't forget on purpose`
- `she <span class="err">has everything since</span> this morning` → `she has had everything since this morning`
- `it <span class="err">was slipped from</span> my mind` → `it slipped my mind`
- `she could have <span class="err">remind</span> me` → `she could have reminded me`
- `i <span class="err">sended</span> it a bit late` → `i sent it a bit late`
- `the details, they <span class="err">was</span>...` → `they were...`
- `it's not <span class="err">totally my fault</span>` → `it's my mistake` (vocabulary: from blame to ownership)

## 6. Endings

| Ending | Stamp | Colour | Marcus's last line |
|---|---|---|---|
| Perfect | TRUST EARNED | gold (win) | `that's how you handle it. see something, tell me first. every time.` |
| Guided | CLOSE CALL | lavender (close call) | `next time lead with "i forgot." the rest is noise.` |
| Made excuses | OFF THE ACCOUNT | red (fail) | `i can't get on a call with a customer and not know what my own team promised her. you're off the account.` |
| Time's up | HE FOUND OUT FIRST | amber (time's up) | `i'd rather hear it from you than from her. we'll talk after the call.` |

Results faces: fail `boss-meter-furious.png`, win `boss-happy-avatar.png` (swap to his new `relieved` face once approved), neutral `boss.png`.

## 7. Open questions

1. **Stamps on wins.** Today the results screen only stamps fail (red, MISSION FAILED) and time's up (amber, TIME'S UP), with fixed text; wins show no stamp. **Recommend:** each path supplies its stamp text and one of four colours (gold, red, amber, lavender). That's the only results change, and the other roleplays need it too.
2. **Story cards.** Scene 1 needs the app to draw Linda's follow-up as an email card over the video (`story.scenes[0].card`, same look as the `phone-email` event card). Until the story screen draws cards, the narrator line carries it ("Linda Park ... just wrote to you").
3. **The customer's name.** "Linda Park" makes the cards and Marcus's lines concrete without naming an industry. If a name feels too specific for some markets, the lines read the same with "the customer".
