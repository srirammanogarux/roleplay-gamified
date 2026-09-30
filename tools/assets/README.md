# Asset pipeline

Makes the stills, videos and voices for each roleplay. Plain Node (v24), no npm install. Needs `ffmpeg` and `ffprobe` (Homebrew paths are set in `config.mjs`).

## Where things live

- `characters/<name>/character.json`: the character's look, personality, voice id and the list of angles, faces and clips to make (`sheet`).
- `media/<roleplay-id>/assets.json`: every asset of one roleplay, in story order, with its prompt, settings, output path and status (`draft`, `approved` or `redo:<note>`).
- `media/<roleplay-id>/queue.json`: the to-do list the review page writes to.
- `media/<roleplay-id>/paper-board.json`: which Paper card shows which item, plus the prompt and status at the last sync.
- `media/characters/assets.json`: the character sets (Elena, Ryan, and the missing Marcus and Sarah faces).
- `tools/assets/config.mjs`: model ids, voice settings, the loudness target and the shared prompt rules. If a model id is wrong, fix it here and nowhere else.

## Run it

1. **Add the keys.** Copy `.env.example` to `.env` at the repo root and fill in `GEMINI_API_KEY` and `ELEVENLABS_API_KEY`. `.env` is gitignored, and the scripts never print keys.
2. **Find the voice ids.**
   `node tools/assets/generate.mjs --list-voices`
   Put Marcus's and Sarah's ids in their `character.json` (`voice.id`). Put the player's voice in `config.mjs` (`PLAYER_VOICE`). Once a voice sounds right, copy its settings into `voice.settings` and don't change them again.
3. **See what would happen.** This needs no keys and spends nothing.
   `node tools/assets/generate.mjs asking-for-leave --dry-run`
   Add `--verbose` to see the full prompt text, or `--only id1,id2` to pick items.
4. **Generate.** This makes every item whose file is missing.
   `node tools/assets/generate.mjs <roleplay-id>`
   Stills come first. A video only runs once its first and last stills are approved, so you usually run this twice: once for the stills, then again for the videos after approving the stills.
5. **Review.**
   `node tools/assets/review-server.mjs`, then open http://localhost:4178/
   Watch the clips, play the voices of each path in order, and use Redo, Improve prompt, Replace or Add scene after. These buttons only add to the to-do list. They never generate anything.
6. **Work through the to-do list.**
   `node tools/assets/generate.mjs <roleplay-id> --queue` (try `--dry-run` first).
   Redo and Improve prompt make a new take next to the file, for example `clip.take2.mp4`. Replace and Add scene need a prompt first: write the item in `assets.json`, then set `"ready": true` on the queue entry. For Add scene, also set `"newItemId"`.
7. **Promote a take** once you like it better than the current file:
   `node tools/assets/generate.mjs <roleplay-id> --promote <id> 2`
   The two files swap places, so the old version is kept as take 2. Promoting again swaps them back.

## Rules the script enforces

- **It never overwrites an existing file.** Anything remade becomes a new take.
- **Stills first.** A video is blocked until its first and last stills exist and are approved. For Elena and Ryan, nothing else is drawn until their `base` portrait is approved.
- **Video.** 9:16 (square clips are made at 9:16 and cropped). The sound Veo adds is always removed. First- and last-frame posters are saved next to each clip. Hero shots are 1080p on the full Veo model; everything else is 720p. Veo needs 8 s whenever it gets a last frame or makes 1080p, so set `fitSeconds` to retime a clip to 4 or 6 s.
- **Voice.** The same voice id, model and settings are used every time. Tags like `[sighs]` go only on key lines (`params.emotion`). Every line is loudness-normalised to -16 LUFS.
- **Watermarks.** Everything is generated through the paid API. If a visible mark appears, regenerate. The invisible SynthID is never touched.

## One place to edit

- **Paper owns everything before video:** scenes, stills and video prompts. The main agent reads the board back into the pipeline with `--sync-from`:
  `node tools/assets/generate.mjs <roleplay-id> --sync-from <exported-board.json>`
  The file has the same shape as `paper-board.json`. `--init-board` writes a first one from `assets.json`.
- **Once a scene's video exists, its prompt moves to the review page.** From then on `--sync-from` refuses prompt changes for that scene, and the review page refuses edits to prompts that Paper still owns.
- **Voice lines are only edited on the review page.** Their text should match the roleplay file.
