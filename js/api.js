const BASE = TTS_BASE_URL;

const API = {
  async getSpeakers() {
    const r = await fetch(`${BASE}/api/speakers`);
    if (!r.ok) throw new Error('Failed to fetch speakers');
    return r.json();
  },
  async getLanguages() {
    const r = await fetch(`${BASE}/api/languages`);
    if (!r.ok) throw new Error('Failed to fetch languages');
    return r.json();
  },
  async getSampleTexts() {
    const r = await fetch(`${BASE}/api/sample-texts`);
    if (!r.ok) throw new Error('Failed to fetch sample texts');
    return r.json();
  },
  async getGpuStatus() {
    const r = await fetch(`${BASE}/api/gpu-status`);
    if (!r.ok) throw new Error('Failed to fetch GPU status');
    return r.json();
  },
  async offloadGpu() {
    const r = await fetch(`${BASE}/api/gpu-offload`, { method: 'POST' });
    if (!r.ok) throw new Error('Failed to offload GPU');
  },

  async ttsCustomVoice(body) {
    return fetch(`${BASE}/api/tts/custom-voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
  async ttsCustomVoiceStream(body) {
    return fetch(`${BASE}/api/tts/custom-voice/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },

  async ttsVoiceDesign(body) {
    return fetch(`${BASE}/api/tts/voice-design`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
  async ttsVoiceDesignStream(body) {
    return fetch(`${BASE}/api/tts/voice-design/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },

  async ttsVoiceClone(fd) {
    return fetch(`${BASE}/api/tts/voice-clone`, { method: 'POST', body: fd });
  },
  async ttsVoiceCloneStream(fd) {
    return fetch(`${BASE}/api/tts/voice-clone/stream`, { method: 'POST', body: fd });
  },

  async saveVoicePrompt(fd) {
    return fetch(`${BASE}/api/voice-prompt/save`, { method: 'POST', body: fd });
  },
  async ttsVoiceCloneFromPrompt(fd) {
    return fetch(`${BASE}/api/tts/voice-clone-from-prompt`, { method: 'POST', body: fd });
  },

  async tokenizerEncode(fd) {
    return fetch(`${BASE}/api/tokenizer/encode`, { method: 'POST', body: fd });
  },
  async tokenizerDecode(codes) {
    return fetch(`${BASE}/api/tokenizer/decode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(codes),
    });
  },
};
