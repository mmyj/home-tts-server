function initVoiceDesign() {
  // Populate language select
  const langSel = document.getElementById('vd_lang');
  if (langSel) {
    LANGUAGES.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l;
      opt.textContent = l;
      langSel.appendChild(opt);
    });
  }

  // Preset chips
  const presetsEl = document.getElementById('vd_presets');
  if (presetsEl) {
    VOICE_DESIGN_PRESETS.forEach((preset, i) => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = preset.label;
      chip.onclick = () => applyVoiceDesignPreset(i);
      presetsEl.appendChild(chip);
    });
  }
}

function applyVoiceDesignPreset(i) {
  const preset = VOICE_DESIGN_PRESETS[i];
  if (!preset) return;
  const textEl    = document.getElementById('vd_text');
  const instructEl = document.getElementById('vd_instruct');
  const langSel   = document.getElementById('vd_lang');
  if (textEl)     textEl.value     = preset.text;
  if (instructEl) instructEl.value = preset.instruct;
  if (langSel)    langSel.value    = preset.lang;
}

function fillSampleVD() {
  fillSample('vd_text', 'vd_lang');
}

async function generateVD() {
  const text     = document.getElementById('vd_text')?.value.trim();
  const instruct = document.getElementById('vd_instruct')?.value.trim();
  if (!text)     { showStatus('vd', 'error', '❌ Please enter text'); return; }
  if (!instruct) { showStatus('vd', 'error', '❌ Please enter a voice description'); return; }

  const streaming = document.getElementById('vd_stream')?.checked;
  const language  = document.getElementById('vd_lang')?.value || 'Auto';
  const speed     = document.getElementById('vd_speed')?.value || '1.0';
  const body = {
    text,
    language,
    instruct: speedInstruct(speed, language) + instruct,
    ...getAdv('vd'),
  };

  const btn = document.getElementById('btn_gen_vd');
  if (btn) btn.disabled = true;
  setProgress('vd', 10);
  showStatus('vd', 'loading', streaming ? 'Generating (streaming)...' : 'Generating...');

  try {
    if (await tryParallelGenerate(text, seg => API.ttsVoiceDesign({...body, text: seg}), 'vd')) {
      if (btn) btn.disabled = false;
      return;
    }
    const resp = streaming
      ? await API.ttsVoiceDesignStream(body)
      : await API.ttsVoiceDesign(body);
    if (!resp.ok) throw new Error(await resp.text());
    if (streaming) await handleStreamResponse(resp, 'vd');
    else           await handleStandardResponse(resp, 'vd');
  } catch (e) {
    showStatus('vd', 'error', '❌ ' + e.message);
    setProgress('vd', 0);
  }

  if (btn) btn.disabled = false;
}
