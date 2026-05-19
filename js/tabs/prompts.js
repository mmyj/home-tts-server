function initPrompts() {
  const importInput = document.getElementById('pt_import_file');
  if (importInput) {
    importInput.addEventListener('change', async () => {
      const file = importInput.files[0];
      if (!file) return;
      const name = file.name.replace(/\.pt$/i, '');
      try { await PromptDB.save(name, file); }
      catch (e) { alert('Import failed: ' + e.message); return; }
      importInput.value = '';
      refreshPromptList();
    });
  }
  refreshPromptList();
}

async function refreshPromptList() {
  const container = document.getElementById('pt_list');
  if (!container) return;
  while (container.firstChild) container.removeChild(container.firstChild);

  let items;
  try { items = await PromptDB.list(); }
  catch (e) {
    const err = document.createElement('div');
    err.className = 'pt-empty';
    err.textContent = '⚠️ 无法连接服务器，请通过 python server.py 启动后访问。';
    container.appendChild(err);
    return;
  }

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'pt-empty';
    empty.textContent = t('pt_empty');
    container.appendChild(empty);
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'prompt-card';

    const info = document.createElement('div');
    info.className = 'prompt-info';

    const nameEl = document.createElement('div');
    nameEl.className = 'prompt-name';
    nameEl.textContent = item.name;

    const metaEl = document.createElement('div');
    metaEl.className = 'prompt-meta';
    const d = new Date(item.created_at);
    metaEl.textContent =
      d.toLocaleDateString() + ' ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
      ' · ' + (item.size / 1024).toFixed(0) + ' KB';

    info.appendChild(nameEl);
    info.appendChild(metaEl);

    const actions = document.createElement('div');
    actions.className = 'prompt-actions';

    const useBtn = document.createElement('button');
    useBtn.className = 'btn btn-sm btn-primary';
    useBtn.textContent = t('btn_use_prompt');
    useBtn.onclick = () => loadPromptIntoClone(item.id, item.name);

    const dlBtn = document.createElement('button');
    dlBtn.className = 'btn btn-sm btn-outline';
    dlBtn.textContent = '↓';
    dlBtn.title = 'Download';
    dlBtn.onclick = async () => {
      try {
        const blob = await PromptDB.get(item.id);
        AudioHelper.downloadBlob(blob, item.name + '.pt');
      } catch (e) { alert('Download failed: ' + e.message); }
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-sm btn-outline';
    delBtn.style.cssText = 'color:var(--red);border-color:var(--red)';
    delBtn.textContent = t('btn_del_prompt');
    delBtn.onclick = async () => {
      if (!confirm('Delete "' + item.name + '"?')) return;
      try { await PromptDB.remove(item.id); }
      catch (e) { alert('Delete failed: ' + e.message); return; }
      refreshPromptList();
    };

    actions.appendChild(useBtn);
    actions.appendChild(dlBtn);
    actions.appendChild(delBtn);

    card.appendChild(info);
    card.appendChild(actions);
    container.appendChild(card);
  });
}

async function importPrompt() {
  document.getElementById('pt_import_file').click();
}

async function loadPromptIntoClone(id, name) {
  let blob;
  try { blob = await PromptDB.get(id); }
  catch (e) { alert('Failed to load prompt: ' + e.message); return; }

  switchTab('vc');
  switchCloneMode('prompt');

  const file  = new File([blob], name + '.pt', { type: 'application/octet-stream' });
  const input = document.getElementById('vcp_pt_file');
  const drop  = document.getElementById('vcp_pt_drop');
  const dt    = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;
  markFileUploaded(drop, file);
}
