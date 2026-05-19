// Prompt storage — backed by the local server.py (SQLite + prompts/ directory).
// Falls back gracefully when the server isn't running.

const PromptDB = {
  async list() {
    const resp = await fetch('/api/prompts');
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json(); // [{id, name, filename, size, created_at}]
  },

  async save(name, blob) {
    const file = blob instanceof File
      ? blob
      : new File([blob], name + '.pt', { type: 'application/octet-stream' });
    const fd = new FormData();
    fd.append('name', name);
    fd.append('pt_file', file);
    const resp = await fetch('/api/prompts', { method: 'POST', body: fd });
    if (!resp.ok) throw new Error(await resp.text());
    return resp.json(); // {id, name, size}
  },

  async get(id) {
    const resp = await fetch('/api/prompts/' + id + '/download');
    if (!resp.ok) throw new Error(await resp.text());
    return resp.blob();
  },

  async remove(id) {
    const resp = await fetch('/api/prompts/' + id, { method: 'DELETE' });
    if (!resp.ok) throw new Error(await resp.text());
  },
};
