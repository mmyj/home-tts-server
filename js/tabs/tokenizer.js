function initTokenizer() {
  const encFile  = document.getElementById('tk_enc_file');
  const encDrop  = document.getElementById('tk_enc_drop');
  const decInput = document.getElementById('tk_dec_input');

  setupDragDrop(encDrop, encFile, file => markFileUploaded(encDrop, file));

  // Allow copy button on codes textarea
  const copyBtn = document.getElementById('btn_copy_codes');
  if (copyBtn) {
    copyBtn.onclick = () => {
      const ta = document.getElementById('tk_codes');
      if (!ta || !ta.value) return;
      navigator.clipboard.writeText(ta.value).then(() => {
        copyBtn.textContent = '✅ Copied';
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
      });
    };
  }

  // Auto-fill decode input from encode result
  const copyToDecBtn = document.getElementById('btn_copy_to_dec');
  if (copyToDecBtn) {
    copyToDecBtn.onclick = () => {
      const src = document.getElementById('tk_codes');
      const dst = document.getElementById('tk_dec_input');
      if (src && dst && src.value) dst.value = src.value;
    };
  }
}

async function encodeAudio() {
  const fileInput = document.getElementById('tk_enc_file');
  if (!fileInput?.files.length) {
    document.getElementById('tk_enc_status').textContent = '❌ Please upload an audio file';
    return;
  }

  const btn = document.getElementById('btn_encode');
  if (btn) btn.disabled = true;
  document.getElementById('tk_enc_status').textContent = 'Converting audio...';

  try {
    const refAudio = await AudioHelper.ensureWav(fileInput.files[0]);
    const fd = new FormData();
    fd.append('ref_audio', refAudio);

    document.getElementById('tk_enc_status').textContent = 'Encoding...';
    const resp = await API.tokenizerEncode(fd);
    if (!resp.ok) throw new Error(await resp.text());
    const data = await resp.json();
    const ta = document.getElementById('tk_codes');
    if (ta) ta.value = JSON.stringify(data, null, 2);
    document.getElementById('tk_enc_status').textContent =
      '✅ Encoded — ' + (Array.isArray(data) ? data.flat().length : '?') + ' tokens';
  } catch (e) {
    document.getElementById('tk_enc_status').textContent = '❌ ' + e.message;
  }

  if (btn) btn.disabled = false;
}

async function decodeTokens() {
  const ta = document.getElementById('tk_dec_input');
  if (!ta?.value.trim()) {
    document.getElementById('tk_dec_status').textContent = '❌ Please paste token codes';
    return;
  }

  let codes;
  try {
    codes = JSON.parse(ta.value.trim());
  } catch {
    document.getElementById('tk_dec_status').textContent = '❌ Invalid JSON — paste the codes array from encode output';
    return;
  }

  const btn = document.getElementById('btn_decode');
  if (btn) btn.disabled = true;
  document.getElementById('tk_dec_status').textContent = 'Decoding...';

  try {
    const resp = await API.tokenizerDecode(codes);
    if (!resp.ok) throw new Error(await resp.text());
    const blob = await resp.blob();
    const player = document.getElementById('tk_dec_player');
    const audio  = document.getElementById('tk_dec_audio');
    if (player) player.style.display = 'block';
    if (audio) AudioHelper.playBlob(blob, audio);
    audioBlobs['tk'] = blob;
    document.getElementById('tk_dec_status').textContent =
      '✅ Decoded — ' + (blob.size / 1024).toFixed(0) + ' KB';
  } catch (e) {
    document.getElementById('tk_dec_status').textContent = '❌ ' + e.message;
  }

  if (btn) btn.disabled = false;
}

function downloadTokenizerAudio() {
  const blob = audioBlobs['tk'];
  if (blob) AudioHelper.downloadBlob(blob, 'tts-tokenizer-' + Date.now() + '.wav');
}
