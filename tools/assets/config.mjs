// The one place to edit model ids, endpoints, output formats and the shared prompt rules.
// Model ids were checked against the official docs on 2026-09-30; if an API rejects one, fix it here.

export const MODELS = {
  // Stills. Flash takes up to 4 character reference images, Pro up to 5.
  image: 'gemini-3.1-flash-image',
  imagePro: 'gemini-3-pro-image',
  // Video. Hero shots always use the full model at 1080p; everything else uses `video` at 720p.
  videoHero: 'veo-3.1-generate-preview',
  video: 'veo-3.1-fast-generate-preview',
  // Voice. Same model + settings every time, per character.
  voice: 'eleven_v4',
};

export const MAX_CHARACTER_REFS = { [MODELS.image]: 4, [MODELS.imagePro]: 5 };
export const MAX_VIDEO_REFS = 3;

export const GEMINI = {
  base: 'https://generativelanguage.googleapis.com/v1beta',
  imageSize: '2K',
  pollEverySeconds: 10,
  pollTimeoutMinutes: 15,
  // Veo documents negativePrompt in `parameters`. If the API ever rejects it, set this to false.
  sendNegativePrompt: true,
  // Required by Veo when a first/last frame or reference image is sent.
  personGeneration: 'allow_adult',
};

export const ELEVENLABS = {
  base: 'https://api.elevenlabs.io',
  outputFormat: 'mp3_44100_128',
  // Used when a character's voice.settings is empty. Once a voice sounds right, copy these into
  // characters/<name>/character.json and never change them again for that character.
  defaultSettings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 1 },
};

// The player has no character folder: one voice everywhere.
export const PLAYER_VOICE = { id: 'Xdk5eWaS3lO6Yz2HBOBv', model: 'eleven_v4', settings: { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, speed: 1 }, pronunciationDictionaries: [] }; // Gabriel Blanco, picked 2026-10-07 (closest to Leave's player)

// Every voice line is normalised to this after synthesis (the existing Leave lines sit at about -17 to -20 LUFS).
export const LOUDNESS = { I: -16, TP: -1.5, LRA: 11, sampleRate: 44100, bitrate: '128k', channels: 1 };

export const HERO_RESOLUTION = '1080p';
export const DEFAULT_RESOLUTION = '720p';
// Veo only takes 4/6/8 s, and needs 8 s for 1080p, for first+last frame, and for reference images.
export const VIDEO_DURATIONS = [4, 6, 8];

export const FFMPEG = process.env.FFMPEG || '/opt/homebrew/bin/ffmpeg';
export const FFPROBE = process.env.FFPROBE || '/opt/homebrew/bin/ffprobe';

// Marcus's illustration style. New characters (Elena, Ryan) and all scenes follow it; Sarah keeps her own.
export const MARCUS_STYLE =
  'Hand-drawn 2D cartoon illustration in exactly the style of the Marcus reference images: bold, clean, dark ink outlines of even weight; ' +
  'semi-realistic adult proportions; soft cel shading with gentle gradients; warm, slightly muted office palette; ' +
  'detailed but uncluttered backgrounds. Not photorealistic, not 3D, not anime, not chibi.';

export const STILL_RULES = [
  'STRICT RULES FOR THIS IMAGE:',
  '1. No text anywhere: no letters, numbers, words, signs, labels, logos, captions or watermarks. Screens, papers, calendars, mugs and signs are blank or show only abstract shapes.',
  '2. Everyone wears office clothes exactly as described in their character notes. No outfit changes.',
  '3. Hands stay out of close-ups: in any chest-up or tighter framing, hands are below the frame. In wider shots hands are relaxed, simple and correctly formed with five fingers.',
  '4. Faces match the character reference images exactly: same face shape, hair, age, skin tone, eye colour and outfit.',
  '5. One single image, no panels, no borders, no split screens.',
].join('\n');

export const VIDEO_RULES = [
  'STRICT RULES FOR THIS CLIP (apply to every frame):',
  '1. No text anywhere: no letters, numbers, words, signs, labels, logos, captions, subtitles, watermarks or UI. Screens, papers, calendars and door signs are blank or abstract. The app draws all text on top.',
  '2. Move the camera, not the face: motion comes from slow, smooth camera moves (gentle push-in, pull-back, pan or parallax). Faces stay stable and on-model; expressions change slowly and only as described. No warping, morphing, flicker or jitter in eyes, mouths, teeth or facial features.',
  '3. No talking: mouths stay closed or still. Nobody speaks, lip-syncs or mouths words.',
  'Audio: distant keyboard clicks and the soft hum of an air conditioner in an office. No voices, no dialogue, no music.',
  '4. Hands stay out of close-ups: in any chest-up or tighter framing, hands stay below the frame. In wider shots hands are relaxed, simple, correctly formed with five fingers, and never the focus.',
  '5. Start exactly on the provided first frame and end exactly on the provided last frame. Keep the same characters, outfits, set, lighting and colours throughout. One continuous shot: no cuts, no transitions, no flashes, no zoom blur.',
  '6. Everyone wears office clothes as described in their character notes. No outfit changes.',
  '7. Style: keep exactly the illustration style described under STYLE and shown in the provided frames. No drift towards photorealism or 3D.',
  '8. Vertical 9:16 frame with the subject centred; keep the key action away from the very top and bottom edges.',
].join('\n');

export const VIDEO_NEGATIVE =
  'text, letters, numbers, words, captions, subtitles, logo, watermark, signage, user interface, talking, lip sync, speech, ' +
  'mouth movement, face morphing, face jitter, flicker, extra fingers, deformed hands, hands in close-up, camera cut, scene change, ' +
  'flash, photorealistic, 3D render, anime';

// Faces and angles on a character sheet share one framing so they can be swapped in the meter.
export const SHEET_RULES =
  'Character sheet image: plain pure black background (#000000), no props, no shadows on the background. ' +
  'Chest-up bust, centred, facing the camera unless the angle says otherwise. In a 9:16 frame the head and shoulders sit inside the centred square ' +
  'so the image can be cropped square for avatars and meter faces, and the clip frames line up. ' +
  'Keep the face, hair and outfit identical to the reference images; only the expression or angle changes.';
