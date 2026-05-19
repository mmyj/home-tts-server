# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the project

```bash
pip install -r requirements.txt
python server.py        # → http://localhost:8080
```

`server.py` is a FastAPI app that serves the static frontend and provides the prompt library API (`/api/prompts`). It must be running for the voice prompt library tab to work. The TTS service itself is external and configured separately.

## Configuration

`config.js` (loaded first by `index.html`) defines `TTS_BASE_URL`, the address of the external Qwen3-TTS backend. All `js/api.js` calls reference this constant.

## Architecture

The frontend is plain HTML/JS with no build step. Script load order in `index.html` matters:

```
config.js → js/api.js → js/audio.js → js/db.js → js/ui.js → js/tabs/*.js
```

**`js/ui.js`** is the shared globals file. It defines:
- `SPEAKERS`, `LANGUAGES`, `SPEAKER_INFO`, `SAMPLE_TEXTS`, `TRANSLATIONS` — data constants used by all tabs
- `showStatus(prefix, type, msg)` — updates `#{prefix}_status` element; types: `loading`, `success`, `error`
- `setProgress(prefix, pct)` — updates `#{prefix}_progress_fill` width
- `handleStandardResponse(resp, prefix)` / `handleStreamResponse(resp, prefix)` — shared post-fetch handlers that decode audio, show metrics, and call `showAudio()`
- `getAdv(prefix)` — reads advanced params (top_k, top_p, temperature, etc.) from `#{prefix}_top_k` etc.
- `speedInstruct(speedVal, lang)` — converts speed number to instruct-field prefix; CJK gets Chinese phrasing
- `setupDragDrop(dropEl, fileInput, onFile)` / `markFileUploaded(dropEl, file)` — drag-and-drop upload helpers
- `setLanguage(lang)` / `currentLang` — i18n; applies `data-i18n` (textContent) and `data-i18n-ph` (placeholder) across the DOM

**`js/api.js`** — thin fetch wrappers for every TTS backend endpoint. Returns raw `Response` objects (callers check `.ok` and handle errors themselves).

**`js/audio.js`** (`AudioHelper`) — audio utilities:
- `ensureWav(file)` — converts any browser-decodable format (m4a, mp3, etc.) to WAV using Web Audio API before upload; required because the TTS server only accepts WAV
- `pcmToWav(float32samples, sampleRate)` — packages PCM s16le data into a WAV blob
- `streamPcmChunks(response)` — reads a streaming PCM response and returns a WAV blob when complete

**`js/db.js`** (`PromptDB`) — HTTP client for the local prompt library API (`GET/POST/DELETE /api/prompts`). All DOM manipulation uses `createElement`/`textContent`/`appendChild` — no `innerHTML`.

**`js/tabs/*.js`** — one file per tab. Each exports an `init*()` function called on `DOMContentLoaded`. Tab prefixes (`cv`, `vd`, `vc`, `vcp`, `tk`) are used as ID namespaces throughout the HTML and JS.

### Voice Clone tab internals

`voice-clone.js` handles two sub-modes (toggled by `switchCloneMode()`):
- **Direct** (`vc_*` prefix): uploads ref audio via `AudioHelper.ensureWav()` then calls `API.ttsVoiceClone()`
- **Prompt flow** (`vcp_*` prefix): Step 1 calls `_buildPromptBlob()` which hits `API.saveVoicePrompt()` and returns a `.pt` blob; Step 2 loads a `.pt` from the library via `loadLibPromptIntoStep2()` (uses `DataTransfer` API to set file input programmatically) then calls `API.ttsVoiceCloneFromPrompt()`

### Prompt library persistence

`server.py` stores `.pt` files in `prompts/` (UUID filenames) with metadata in `prompts.db` (SQLite). Both are `.gitignore`d.
