// ── Shared Data ──

const SPEAKERS = ['Vivian', 'Serena', 'Uncle_Fu', 'Dylan', 'Eric', 'Ryan', 'Aiden', 'Ono_Anna', 'Sohee'];

const LANGUAGES = ['Auto', 'Chinese', 'English', 'Japanese', 'Korean', 'German', 'French', 'Russian', 'Portuguese', 'Spanish', 'Italian'];

const SPEAKER_INFO = {
  Vivian:   { desc_en: 'Bright, slightly edgy young female',   desc_zh: '明亮、略带锐利的年轻女声', native: 'Chinese',          gender: 'F' },
  Serena:   { desc_en: 'Warm, gentle young female',            desc_zh: '温暖、柔和的年轻女声',     native: 'Chinese',          gender: 'F' },
  Uncle_Fu: { desc_en: 'Seasoned male, low mellow timbre',     desc_zh: '沉稳低沉的成熟男声',       native: 'Chinese',          gender: 'M' },
  Dylan:    { desc_en: 'Youthful Beijing male, clear natural', desc_zh: '清朗自然的北京青年男声',   native: 'Chinese (Beijing)',  gender: 'M' },
  Eric:     { desc_en: 'Lively Chengdu male, slightly husky',  desc_zh: '活泼略带沙哑的成都男声',   native: 'Chinese (Sichuan)', gender: 'M' },
  Ryan:     { desc_en: 'Dynamic male, strong rhythmic drive',  desc_zh: '动感十足、节奏感强的男声', native: 'English',           gender: 'M' },
  Aiden:    { desc_en: 'Sunny American male, clear midrange',  desc_zh: '阳光美式男声、中频清晰',   native: 'English',           gender: 'M' },
  Ono_Anna: { desc_en: 'Playful Japanese female, light nimble',desc_zh: '俏皮轻盈的日语女声',       native: 'Japanese',          gender: 'F' },
  Sohee:    { desc_en: 'Warm Korean female, rich emotion',     desc_zh: '温暖富有情感的韩语女声',   native: 'Korean',            gender: 'F' },
};

const SAMPLE_TEXTS = {
  Chinese:    '其实我真的有发现，我是一个特别善于观察别人情绪的人。',
  English:    "Then by the end of the movie, when Dorothy clicks her heels and says, there's no place like home, I got a little bit teary.",
  Japanese:   'やばい、明日のプレゼン資料まだ完成してない… 助けて！',
  Korean:     '야, 오늘 점심에 뭐 먹을지 생각해 봤어? 근처에 새로 생긴 분식집 어때?',
  German:     'Ich habe heute Morgen einen wunderschönen Sonnenaufgang gesehen.',
  French:     'La vie est belle quand on prend le temps de regarder autour de soi.',
  Russian:    'Сегодня прекрасный день для прогулки в парке.',
  Portuguese: 'A vida é uma jornada, não um destino.',
  Spanish:    'La música es el lenguaje universal de la humanidad.',
  Italian:    'La bellezza salverà il mondo, diceva Dostoevskij.',
};

const INSTRUCT_EXAMPLES = [
  'Speak with a very sad and tearful voice',
  'Very happy and excited',
  'Whisper softly',
  'Speak with authority and confidence',
  '用特别愤怒的语气说',
  '用开心愉悦的语气',
];

const VOICE_DESIGN_PRESETS = [
  { label: '🎀 Cute Loli (萝莉)',  text: '哥哥，你回来啦，人家等了你好久好久了，要抱抱！',                                      lang: 'Chinese', instruct: '体现撒娇稚嫩的萝莉女声，音调偏高且起伏明显，营造出黏人、做作又刻意卖萌的听觉效果。' },
  { label: '🎭 Sarcastic Teen',    text: "Blah, blah, blah. We're all very fascinated, but we'd like to get paid.",           lang: 'English', instruct: 'Speak as a sarcastic, assertive teenage girl: crisp enunciation, controlled volume, with vocal emphasis that conveys disdain.' },
  { label: '👑 Imperial Drama',    text: '皇上啊！臣妾一片真心可昭日月，为何您竟信那毒妇谗言，将我打入冷宫？',                    lang: 'Chinese', instruct: '展现出悲苦沙哑的声音质感，语速偏慢，情绪浓烈且带有哭腔，以标准普通话缓慢诉说，情感强烈，语调哀怨高亢。' },
  { label: '🎙️ Announcer',         text: "Coming up next, the moment you've all been waiting for! Stay tuned, we'll be right back!", lang: 'English', instruct: 'A bright, agile male voice with a natural upward lift, delivering lines at a brisk, energetic pace. Pitch leans high, volume projects clearly.' },
  { label: '😢 Sad Narrator',      text: '有些事，只要国家需要，就得有人扛起来。我们那一代人，是背着泥土铺路的。',                  lang: 'Chinese', instruct: '以极度悲伤、带着明显哭腔的语气，用较小的音量缓缓诉说，语速缓慢，声音颤抖而压抑。' },
  { label: '🗣️ Confident Male',    text: 'Older gentleman, 110, maybe 111 years old, sort of a surly Elvis thing happening with him.', lang: 'English', instruct: 'gender: Male. pitch: Low. speed: Deliberate pace. volume: Loud. emotion: Commanding. tone: Authoritative. personality: Confident.' },
];

// ── i18n ──

const TRANSLATIONS = {
  en: {
    subtitle: 'Custom Voice · Voice Design · Voice Clone · Tokenizer',
    offload_gpu: 'Offload GPU', api_docs: 'API Docs',
    sidebar_speakers: 'Speakers', sidebar_gpu: 'GPU Info',
    tab_cv: 'Custom Voice', tab_vd: 'Voice Design', tab_vc: 'Voice Clone', tab_tk: 'Tokenizer',
    desc_cv: 'Generate speech with 9 preset premium voices. Add instructions to control emotion, speed, tone, and style.',
    lbl_text: 'Text to synthesize', lbl_language: 'Language', lbl_speaker: 'Speaker',
    btn_sample: 'Sample Text', lbl_instruct: 'Instruction (optional)',
    ph_instruct: 'e.g. Speak with a sad voice / 用愤怒的语气说',
    lbl_examples: 'Examples:',
    lbl_stream: 'Streaming mode (PCM)', lbl_adv: 'Advanced Settings',
    btn_generate: 'Generate Speech', btn_download: 'Download WAV',
    lbl_speed: 'Speech Rate',
    desc_vd: 'Design a new voice by describing its characteristics in natural language. Supports acoustic attributes, persona, age, and emotion control.',
    lbl_presets: 'Quick Presets', lbl_voice_desc: 'Voice Description',
    ph_voice_desc: 'Describe the voice: gender, pitch, emotion, speed, accent, personality...',
    desc_vc: 'Clone any voice from a reference audio clip. Supports cross-lingual cloning across 10 languages.',
    btn_direct: 'Direct Clone', btn_prompt_flow: 'Prompt Flow',
    lbl_ref_audio: 'Reference Audio (3s+ recommended)', ph_ref_drop: 'Click or drag audio file here',
    lbl_ref_text: 'Reference Text (transcript of ref audio, optional)', ph_ref_text: 'Transcript of the reference audio...',
    lbl_xvec: 'X-Vector Only mode (no ref text needed, lower quality)',
    lbl_text_clone: 'Text to synthesize', ph_text_clone: 'Enter new text to speak in the cloned voice...',
    btn_clone: 'Clone Voice & Generate',
    step1_title: 'Step 1 — Save Voice Prompt', step2_title: 'Step 2 — Generate from Saved Prompt',
    lbl_ref_text_opt: 'Reference Text (optional)', ph_ref_text_opt: 'Transcript of reference audio...',
    btn_save_prompt: 'Save Voice Prompt (.pt)',
    btn_save_to_lib: 'Save to Library', btn_download_prompt: 'Download',
    lbl_pt_file: 'Voice Prompt File (.pt)', ph_pt_drop: 'Click or drag .pt file here',
    desc_tk: 'Encode audio to speech tokens and decode tokens back to audio using Qwen3-TTS-Tokenizer-12Hz.',
    tk_enc_title: 'Encode — Audio to Tokens', tk_dec_title: 'Decode — Tokens to Audio',
    ph_audio_drop: 'Click or drag audio file here',
    btn_encode: 'Encode', lbl_token_codes: 'Token Codes (JSON)',
    btn_copy: 'Copy', btn_copy_to_dec: 'Copy to Decode',
    ph_token_input: 'Paste token codes from encode output...',
    btn_decode: 'Decode', btn_download_tk: 'Download WAV',
    m_load: 'Model Load', m_gen: 'Generation', m_total: 'Total Time',
    m_dur: 'Audio Duration', m_size: 'Data Size',
    footer_note: 'AI-generated audio for personal use only. Not for impersonation or illegal use.',
    lbl_paper: 'Paper',
    tab_pt: 'Prompts', desc_pt: 'Manage saved voice prompts. Load directly into Voice Clone without re-uploading.',
    lbl_prompt_name: 'Save name', ph_prompt_name: 'e.g. Recording 1',
    btn_import_pt: 'Import .pt', pt_empty: 'No saved prompts',
    btn_use_prompt: 'Use', btn_del_prompt: 'Delete',
  },
  'zh-CN': {
    subtitle: '自定义语音 · 语音设计 · 语音克隆 · 分词器',
    offload_gpu: '释放显存', api_docs: 'API 文档',
    sidebar_speakers: '发音人', sidebar_gpu: 'GPU 信息',
    tab_cv: '自定义语音', tab_vd: '语音设计', tab_vc: '语音克隆', tab_tk: '分词器',
    desc_cv: '使用 9 种预设高品质声音生成语音，可通过指令控制情感、语速、语调和风格。',
    lbl_text: '合成文本', lbl_language: '语言', lbl_speaker: '发音人',
    btn_sample: '示例文本', lbl_instruct: '指令（可选）',
    ph_instruct: '例如：用悲伤的语气说 / Speak in an angry tone',
    lbl_examples: '示例：',
    lbl_stream: '流式模式（PCM）', lbl_adv: '高级设置',
    btn_generate: '生成语音', btn_download: '下载 WAV',
    lbl_speed: '语速',
    desc_vd: '用自然语言描述声音特征来设计全新声音，支持声学属性、人设、年龄和情感控制。',
    lbl_presets: '快捷预设', lbl_voice_desc: '声音描述',
    ph_voice_desc: '描述声音：性别、音调、情感、语速、口音、个性……',
    desc_vc: '从参考音频片段克隆任意声音，支持 10 种语言的跨语言克隆。',
    btn_direct: '直接克隆', btn_prompt_flow: 'Prompt 工作流',
    lbl_ref_audio: '参考音频（建议 3 秒以上）', ph_ref_drop: '点击或拖拽音频文件到此处',
    lbl_ref_text: '参考文本（参考音频的文字内容，可选）', ph_ref_text: '参考音频的文字内容……',
    lbl_xvec: '仅声纹模式（无需参考文本，质量较低）',
    lbl_text_clone: '合成文本', ph_text_clone: '输入要用克隆声音朗读的新文本……',
    btn_clone: '克隆声音并生成',
    step1_title: '第一步 — 保存声音 Prompt', step2_title: '第二步 — 使用已保存的 Prompt 生成',
    lbl_ref_text_opt: '参考文本（可选）', ph_ref_text_opt: '参考音频的文字内容……',
    btn_save_prompt: '保存声音 Prompt（.pt）',
    btn_save_to_lib: '保存到音色库', btn_download_prompt: '下载到本地',
    lbl_pt_file: '声音 Prompt 文件（.pt）', ph_pt_drop: '点击或拖拽 .pt 文件到此处',
    desc_tk: '使用 Qwen3-TTS-Tokenizer-12Hz 将音频编码为语音 token，或将 token 解码回音频。',
    tk_enc_title: '编码 — 音频转 Token', tk_dec_title: '解码 — Token 转音频',
    ph_audio_drop: '点击或拖拽音频文件到此处',
    btn_encode: '编码', lbl_token_codes: 'Token 码（JSON）',
    btn_copy: '复制', btn_copy_to_dec: '复制到解码区',
    ph_token_input: '将编码结果的 token 粘贴到此处……',
    btn_decode: '解码', btn_download_tk: '下载 WAV',
    m_load: '模型加载', m_gen: '生成耗时', m_total: '总耗时',
    m_dur: '音频时长', m_size: '数据大小',
    footer_note: 'AI 生成音频仅供个人使用，禁止用于冒充他人或非法用途。',
    lbl_paper: '论文',
    tab_pt: 'Prompt 库', desc_pt: '管理已保存的声音 Prompt，可直接在「语音克隆 → Prompt 工作流」中使用，无需重复上传。',
    lbl_prompt_name: '保存名称', ph_prompt_name: '例如：妈妈的声音',
    btn_import_pt: '导入 .pt', pt_empty: '暂无已保存的 Prompt',
    btn_use_prompt: '使用', btn_del_prompt: '删除',
  },
};

let currentLang = 'zh-CN';

function t(key) {
  return (TRANSLATIONS[currentLang] || TRANSLATIONS.en)[key] || TRANSLATIONS.en[key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  const tr = TRANSLATIONS[lang] || TRANSLATIONS.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (tr[key] !== undefined) el.textContent = tr[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (tr[key] !== undefined) el.placeholder = tr[key];
  });
  document.querySelectorAll('[data-i18n-upload]').forEach(el => {
    const key = el.dataset.i18nUpload;
    if (tr[key] !== undefined) el.textContent = tr[key];
  });

  // Re-render speaker sidebar so descriptions switch language
  initSpeakerSidebar();
  if (typeof refreshPromptList === 'function') refreshPromptList();

  const sel = document.getElementById('langSelect');
  if (sel && sel.value !== lang) sel.value = lang;
}

// ── Audio blob storage ──
const audioBlobs = {};

// ── Status & progress ──

function showStatus(prefix, type, msg) {
  const el = document.getElementById(prefix + '_status');
  if (!el) return;
  el.style.display = 'flex';
  el.className = 'status-bar ' + type;
  while (el.firstChild) el.removeChild(el.firstChild);
  if (type === 'loading') {
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    el.appendChild(spinner);
  }
  el.appendChild(document.createTextNode(msg));
}

function setProgress(prefix, pct) {
  const el = document.getElementById(prefix + '_progress_fill');
  if (el) el.style.width = pct + '%';
}

function showMetrics(prefix, { load, gen, total, dur, size, rtf }) {
  const panel = document.getElementById(prefix + '_metrics');
  if (!panel) return;
  panel.style.display = 'block';
  const setText = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  setText(prefix + '_m_load',  load.toFixed(3) + 's');
  setText(prefix + '_m_gen',   gen.toFixed(3) + 's');
  setText(prefix + '_m_total', total.toFixed(3) + 's');
  setText(prefix + '_m_dur',   dur.toFixed(2) + 's');
  setText(prefix + '_m_size',  (size / 1024).toFixed(0) + ' KB');
  setText(prefix + '_m_rtf',   rtf.toFixed(3) + 'x');
}

function showAudio(prefix, blob) {
  audioBlobs[prefix] = blob;
  const player = document.getElementById(prefix + '_player');
  const audio  = document.getElementById(prefix + '_audio');
  if (!player || !audio) return;
  player.style.display = 'block';
  AudioHelper.playBlob(blob, audio);
}

function downloadAudio(prefix) {
  const blob = audioBlobs[prefix];
  if (blob) AudioHelper.downloadBlob(blob, 'tts-' + prefix + '-' + Date.now() + '.wav');
}

function toggleCollapse(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}

function getAdv(prefix) {
  const num = (id, d) => { const v = parseFloat(document.getElementById(id)?.value); return isNaN(v) ? d : v; };
  const int = (id, d) => { const v = parseInt(document.getElementById(id)?.value);   return isNaN(v) ? d : v; };
  return {
    top_k:              int(prefix + '_top_k', 50),
    top_p:              num(prefix + '_top_p', 0.9),
    temperature:        num(prefix + '_temp',  1.0),
    repetition_penalty: num(prefix + '_rep',   1.05),
    max_new_tokens:     int(prefix + '_mnt',   2048),
  };
}

// Returns a speed instruction prefix to prepend to instruct, or '' if speed == 1.0
function speedInstruct(speedVal, ttsLang) {
  const s = parseFloat(speedVal);
  if (isNaN(s) || Math.abs(s - 1.0) < 0.01) return '';
  const isEast = ['Chinese', 'Japanese', 'Korean'].includes(ttsLang);
  if (isEast) return '以' + s.toFixed(1) + '倍语速说，';
  return 'Speak at ' + s.toFixed(1) + 'x speed. ';
}

// ── Shared generate response handlers ──

async function handleStandardResponse(resp, prefix) {
  setProgress(prefix, 80);
  const t0 = performance.now();
  const blob = await resp.blob();
  const elapsed = (performance.now() - t0) / 1000;
  const sLoad  = parseFloat(resp.headers.get('X-Time-Load'))      || 0;
  const sGen   = parseFloat(resp.headers.get('X-Time-Gen'))       || elapsed;
  const sTotal = parseFloat(resp.headers.get('X-Time-Total'))     || elapsed;
  let   dur    = parseFloat(resp.headers.get('X-Audio-Duration'))  || 0;
  if (!dur) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const decoded = await ctx.decodeAudioData(await blob.slice().arrayBuffer());
      dur = decoded.duration;
      ctx.close();
    } catch { dur = blob.size / (24000 * 2); }
  }
  showAudio(prefix, blob);
  setProgress(prefix, 100);
  showMetrics(prefix, { load: sLoad, gen: sGen, total: sTotal, dur, size: blob.size, rtf: sGen / (dur || 1) });
  showStatus(prefix, 'success',
    '✅ ' + dur.toFixed(1) + 's · ' + (blob.size / 1024).toFixed(0) + ' KB · ' + sGen.toFixed(2) + 's gen');
  refreshGpu();
}

async function handleStreamResponse(resp, prefix) {
  const t0 = performance.now();
  const chunksEl = document.getElementById(prefix + '_chunks');
  setProgress(prefix, 30);

  const { wavBlob, totalBytes, chunkCount, ttfbMs, duration } =
    await AudioHelper.collectPcmStream(resp, ({ chunkCount, totalBytes, ttfbMs }) => {
      if (chunksEl) chunksEl.textContent =
        'Chunks: ' + chunkCount + ' · ' + (totalBytes / 1024).toFixed(0) + ' KB · TTFB: ' + (ttfbMs / 1000).toFixed(3) + 's';
      setProgress(prefix, 30 + Math.min(60, chunkCount * 3));
    });

  const genTime = (performance.now() - t0) / 1000;
  showAudio(prefix, wavBlob);
  setProgress(prefix, 100);
  showMetrics(prefix, { load: 0, gen: genTime, total: genTime, dur: duration, size: totalBytes, rtf: genTime / (duration || 1) });
  showStatus(prefix, 'success',
    '✅ Streamed · ' + duration.toFixed(1) + 's · ' + chunkCount + ' chunks · TTFB: ' + (ttfbMs / 1000).toFixed(3) + 's');
  refreshGpu();
}

// ── GPU status ──

async function refreshGpu() {
  try {
    const d = await API.getGpuStatus();
    const dot    = document.getElementById('gpuDot');
    const txt    = document.getElementById('gpuText');
    const detail = document.getElementById('gpuDetail');
    if (dot) dot.className = 'dot' + (d.loaded ? '' : ' off');
    if (txt) txt.textContent = d.loaded ? d.model_type + ' · ' + d.memory_allocated_mb + 'MB' : 'No model';
    if (detail) {
      while (detail.firstChild) detail.removeChild(detail.firstChild);
      const lines = [
        d.gpu_name || '--',
        'VRAM: ' + (d.memory_allocated_mb || 0) + 'MB / ' + (d.memory_reserved_mb || 0) + 'MB',
        d.loaded ? 'Model: ' + d.model_type : '💤 Idle',
        d.idle_seconds != null ? 'Idle: ' + d.idle_seconds + 's' : '',
      ].filter(Boolean);
      lines.forEach((line, i) => {
        detail.appendChild(document.createTextNode(line));
        if (i < lines.length - 1) detail.appendChild(document.createElement('br'));
      });
    }
  } catch (e) { console.error('GPU status error:', e); }
}

async function offloadGpu() {
  try { await API.offloadGpu(); await refreshGpu(); }
  catch (e) { console.error('GPU offload error:', e); }
}

// ── Tab switching ──

function switchTab(id) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('tab_' + id).classList.add('active');
  document.getElementById('panel_' + id).classList.add('active');
}

// ── Speaker sidebar ──

function initSpeakerSidebar() {
  const container = document.getElementById('speakerList');
  if (!container) return;
  while (container.firstChild) container.removeChild(container.firstChild);
  const useChinese = currentLang.startsWith('zh') || currentLang === 'ja';
  SPEAKERS.forEach((name, i) => {
    const info = SPEAKER_INFO[name];
    const card = document.createElement('div');
    card.className = 'speaker-card' + (i === 0 ? ' active' : '');
    card.onclick = () => selectSpeaker(name, card);

    const nameEl = document.createElement('div');
    nameEl.className = 'name';
    nameEl.textContent = name + (info.gender === 'F' ? ' ♀' : ' ♂');

    const metaEl = document.createElement('div');
    metaEl.className = 'meta';
    metaEl.textContent = info.native + ' · ' + (useChinese ? info.desc_zh : info.desc_en);

    card.appendChild(nameEl);
    card.appendChild(metaEl);
    container.appendChild(card);
  });
}

function selectSpeaker(name, el) {
  document.querySelectorAll('.speaker-card').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  const sel = document.getElementById('cv_speaker');
  if (sel) sel.value = name;
}

// ── File upload drag & drop ──

function setupDragDrop(dropEl, fileInput, onFile) {
  if (!dropEl) return;
  dropEl.addEventListener('dragover', e => { e.preventDefault(); dropEl.classList.add('drag-over'); });
  dropEl.addEventListener('dragleave', () => dropEl.classList.remove('drag-over'));
  dropEl.addEventListener('drop', e => {
    e.preventDefault();
    dropEl.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && fileInput) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
    }
    if (file && onFile) onFile(file);
  });
  if (fileInput) fileInput.addEventListener('change', () => {
    if (fileInput.files[0] && onFile) onFile(fileInput.files[0]);
  });
}

function markFileUploaded(dropEl, file) {
  if (!dropEl) return;
  dropEl.classList.add('has-file');
  const icon = dropEl.querySelector('.upload-icon');
  const text = dropEl.querySelector('.upload-text');
  if (icon) icon.textContent = '✅';
  if (text) text.textContent = file.name;
}

function fillSample(textareaId, langSelectId) {
  const lang   = document.getElementById(langSelectId)?.value;
  const sample = SAMPLE_TEXTS[lang] || '';
  const ta     = document.getElementById(textareaId);
  if (ta) ta.value = sample;
}

// ── Speed slider helper ──

function syncSpeedDisplay(sliderId, displayId) {
  const slider = document.getElementById(sliderId);
  const display = document.getElementById(displayId);
  if (!slider || !display) return;
  const update = () => { display.textContent = parseFloat(slider.value).toFixed(1) + '×'; };
  slider.addEventListener('input', update);
  update();
}
