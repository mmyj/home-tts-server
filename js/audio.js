const AudioHelper = {
  pcmToWav(samples, sampleRate) {
    const buf = new ArrayBuffer(44 + samples.length * 2);
    const v = new DataView(buf);
    const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); str(8, 'WAVE');
    str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * 2, true);
    v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    str(36, 'data'); v.setUint32(40, samples.length * 2, true);
    for (let i = 0; i < samples.length; i++) {
      v.setInt16(44 + i * 2, Math.max(-32768, Math.min(32767, samples[i] * 32768)), true);
    }
    return new Blob([buf], { type: 'audio/wav' });
  },

  playBlob(blob, audioEl) {
    const prev = audioEl.src;
    if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
    audioEl.src = URL.createObjectURL(blob);
    audioEl.play().catch(() => {});
  },

  downloadBlob(blob, filename) {
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  async convertToWav(file) {
    const arrayBuf = await file.arrayBuffer();
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let audioBuf;
    try { audioBuf = await ctx.decodeAudioData(arrayBuf); }
    finally { ctx.close(); }
    const samples = audioBuf.getChannelData(0);
    const wavBlob = this.pcmToWav(samples, audioBuf.sampleRate);
    return new File([wavBlob], file.name.replace(/\.[^.]+$/, '.wav'), { type: 'audio/wav' });
  },

  async ensureWav(file) {
    const name = file.name.toLowerCase();
    if (file.type === 'audio/wav' || name.endsWith('.wav')) return file;
    return this.convertToWav(file);
  },

  async collectPcmStream(response, onChunk) {
    const sr = parseInt(response.headers.get('X-Sample-Rate')) || 24000;
    const reader = response.body.getReader();
    const chunks = [];
    let totalBytes = 0, chunkCount = 0, ttfbMs = null;
    const t0 = performance.now();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (ttfbMs === null) ttfbMs = performance.now() - t0;
      chunks.push(value);
      totalBytes += value.length;
      chunkCount++;
      if (onChunk) onChunk({ chunkCount, totalBytes, ttfbMs });
    }

    const pcm = new Uint8Array(totalBytes);
    let offset = 0;
    for (const c of chunks) { pcm.set(c, offset); offset += c.length; }

    const samples = new Float32Array(totalBytes / 2);
    const view = new DataView(pcm.buffer);
    for (let i = 0; i < samples.length; i++) {
      samples[i] = view.getInt16(i * 2, true) / 32768;
    }

    return {
      wavBlob: this.pcmToWav(samples, sr),
      totalBytes,
      chunkCount,
      ttfbMs: ttfbMs || 0,
      duration: samples.length / sr,
    };
  },
};
