function initCustomVoice() {
  // Populate language select
  const langSel = document.getElementById('cv_lang');
  if (langSel) {
    LANGUAGES.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l;
      opt.textContent = l;
      langSel.appendChild(opt);
    });
  }

  // Populate speaker select (mirrors sidebar)
  const spkSel = document.getElementById('cv_speaker');
  if (spkSel) {
    SPEAKERS.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      spkSel.appendChild(opt);
    });
  }

  // Instruction example chips
  const chipsEl = document.getElementById('cv_inst_chips');
  if (chipsEl) {
    INSTRUCT_EXAMPLES.forEach(text => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = text;
      chip.onclick = () => {
        const ta = document.getElementById('cv_instruct');
        if (ta) ta.value = text;
      };
      chipsEl.appendChild(chip);
    });
  }
}

function fillSampleCV() {
  fillSample('cv_text', 'cv_lang');
}

async function generateCV() {
  const text = document.getElementById('cv_text')?.value.trim();
  if (!text) { showStatus('cv', 'error', '❌ Please enter text'); return; }

  const streaming = document.getElementById('cv_stream')?.checked;
  const language  = document.getElementById('cv_lang')?.value || 'Auto';
  const rawInstruct = document.getElementById('cv_instruct')?.value.trim() || '';
  const speed     = document.getElementById('cv_speed')?.value || '1.0';
  const body = {
    text,
    language,
    speaker:  document.getElementById('cv_speaker')?.value || 'Vivian',
    instruct: speedInstruct(speed, language) + rawInstruct,
    ...getAdv('cv'),
  };

  const btn = document.getElementById('btn_gen_cv');
  if (btn) btn.disabled = true;
  setProgress('cv', 10);
  showStatus('cv', 'loading', streaming ? 'Generating (streaming)...' : 'Generating...');

  try {
    if (await tryParallelGenerate(text, seg => API.ttsCustomVoice({...body, text: seg}), 'cv')) {
      if (btn) btn.disabled = false;
      return;
    }
    const resp = streaming
      ? await API.ttsCustomVoiceStream(body)
      : await API.ttsCustomVoice(body);
    if (!resp.ok) throw new Error(await resp.text());
    if (streaming) await handleStreamResponse(resp, 'cv');
    else           await handleStandardResponse(resp, 'cv');
  } catch (e) {
    showStatus('cv', 'error', '❌ ' + e.message);
    setProgress('cv', 0);
  }

  if (btn) btn.disabled = false;
}
