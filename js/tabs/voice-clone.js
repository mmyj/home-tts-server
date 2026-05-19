function initVoiceClone() {
  // Populate language selects for both modes
  ['vc_lang', 'vcp_lang'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    LANGUAGES.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l;
      opt.textContent = l;
      sel.appendChild(opt);
    });
  });

  // Direct clone: ref audio drag & drop with preview
  setupDragDrop(
    document.getElementById('vc_ref_drop'),
    document.getElementById('vc_ref_file'),
    file => {
      markFileUploaded(document.getElementById('vc_ref_drop'), file);
      const preview = document.getElementById('vc_ref_preview');
      if (preview) {
        const prev = preview.src;
        if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
      }
    }
  );

  // Prompt flow step 1: ref audio drag & drop with preview
  setupDragDrop(
    document.getElementById('vcp_ref_drop'),
    document.getElementById('vcp_ref_file'),
    file => {
      markFileUploaded(document.getElementById('vcp_ref_drop'), file);
      const preview = document.getElementById('vcp_ref_preview');
      if (preview) {
        const prev = preview.src;
        if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
      }
    }
  );

  // Prompt flow step 2: .pt file drag & drop
  setupDragDrop(
    document.getElementById('vcp_pt_drop'),
    document.getElementById('vcp_pt_file'),
    file => markFileUploaded(document.getElementById('vcp_pt_drop'), file)
  );
}

function switchCloneMode(mode) {
  const directEl = document.getElementById('vc_direct_mode');
  const promptEl = document.getElementById('vc_prompt_mode');
  const btnDirect = document.getElementById('clone_mode_direct');
  const btnPrompt = document.getElementById('clone_mode_prompt');

  if (mode === 'direct') {
    if (directEl) directEl.style.display = 'block';
    if (promptEl) promptEl.style.display = 'none';
    if (btnDirect) { btnDirect.classList.add('active'); }
    if (btnPrompt) { btnPrompt.classList.remove('active'); }
  } else {
    if (directEl) directEl.style.display = 'none';
    if (promptEl) promptEl.style.display = 'block';
    if (btnDirect) { btnDirect.classList.remove('active'); }
    if (btnPrompt) { btnPrompt.classList.add('active'); }
  }
}

function fillSampleVC() {
  fillSample('vc_text', 'vc_lang');
}

function fillSampleVCP() {
  fillSample('vcp_text', 'vcp_lang');
}

// Direct clone — POST /api/tts/voice-clone (multipart)
async function generateVC() {
  const text      = document.getElementById('vc_text')?.value.trim();
  const fileInput = document.getElementById('vc_ref_file');
  if (!text) { showStatus('vc', 'error', '❌ Please enter text'); return; }
  if (!fileInput?.files.length) { showStatus('vc', 'error', '❌ Please upload reference audio'); return; }

  const streaming = document.getElementById('vc_stream')?.checked;
  const btn = document.getElementById('btn_gen_vc');
  if (btn) btn.disabled = true;
  setProgress('vc', 5);
  showStatus('vc', 'loading', 'Converting audio...');

  try {
    const refAudio = await AudioHelper.ensureWav(fileInput.files[0]);
    const fd = new FormData();
    fd.append('text', text);
    fd.append('language', document.getElementById('vc_lang')?.value || 'Auto');
    fd.append('ref_text', document.getElementById('vc_ref_text')?.value.trim() || '');
    fd.append('x_vector_only_mode', String(document.getElementById('vc_xvec')?.checked || false));
    fd.append('ref_audio', refAudio);
    Object.entries(getAdv('vc')).forEach(([k, v]) => fd.append(k, String(v)));

    setProgress('vc', 10);
    showStatus('vc', 'loading', streaming ? 'Cloning voice (streaming)...' : 'Cloning voice...');
    const resp = streaming
      ? await API.ttsVoiceCloneStream(fd)
      : await API.ttsVoiceClone(fd);
    if (!resp.ok) throw new Error(await resp.text());
    if (streaming) await handleStreamResponse(resp, 'vc');
    else           await handleStandardResponse(resp, 'vc');
  } catch (e) {
    showStatus('vc', 'error', '❌ ' + e.message);
    setProgress('vc', 0);
  }

  if (btn) btn.disabled = false;
}

// Save voice prompt — POST /api/voice-prompt/save → download .pt
async function savePromptVC() {
  const fileInput = document.getElementById('vcp_ref_file');
  if (!fileInput?.files.length) {
    showStatus('vcp_save', 'error', '❌ Please upload reference audio');
    return;
  }

  const btn = document.getElementById('btn_save_prompt');
  if (btn) btn.disabled = true;
  showStatus('vcp_save', 'loading', 'Converting audio...');

  try {
    const refAudio = await AudioHelper.ensureWav(fileInput.files[0]);
    const fd = new FormData();
    fd.append('ref_audio', refAudio);
    fd.append('ref_text', document.getElementById('vcp_ref_text')?.value.trim() || '');
    fd.append('x_vector_only_mode', String(document.getElementById('vcp_xvec')?.checked || false));

    showStatus('vcp_save', 'loading', 'Saving voice prompt...');
    const resp = await API.saveVoicePrompt(fd);
    if (!resp.ok) throw new Error(await resp.text());
    const blob = await resp.blob();
    AudioHelper.downloadBlob(blob, 'voice_prompt.pt');
    showStatus('vcp_save', 'success', '✅ Saved — voice_prompt.pt downloaded');
  } catch (e) {
    showStatus('vcp_save', 'error', '❌ ' + e.message);
  }

  if (btn) btn.disabled = false;
}

// Generate from saved prompt — POST /api/tts/voice-clone-from-prompt (multipart)
async function generateFromPromptVC() {
  const text      = document.getElementById('vcp_text')?.value.trim();
  const ptInput   = document.getElementById('vcp_pt_file');
  if (!text) { showStatus('vcp', 'error', '❌ Please enter text'); return; }
  if (!ptInput?.files.length) { showStatus('vcp', 'error', '❌ Please upload a voice prompt (.pt) file'); return; }

  const fd = new FormData();
  fd.append('text', text);
  fd.append('language', document.getElementById('vcp_lang')?.value || 'Auto');
  fd.append('voice_prompt', ptInput.files[0]);
  Object.entries(getAdv('vcp')).forEach(([k, v]) => fd.append(k, String(v)));

  const btn = document.getElementById('btn_gen_vcp');
  if (btn) btn.disabled = true;
  setProgress('vcp', 10);
  showStatus('vcp', 'loading', 'Generating from voice prompt...');

  try {
    const resp = await API.ttsVoiceCloneFromPrompt(fd);
    if (!resp.ok) throw new Error(await resp.text());
    await handleStandardResponse(resp, 'vcp');
  } catch (e) {
    showStatus('vcp', 'error', '❌ ' + e.message);
    setProgress('vcp', 0);
  }

  if (btn) btn.disabled = false;
}
