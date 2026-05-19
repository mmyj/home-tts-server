#!/usr/bin/env python3
"""
Local UI server — serves static files and manages saved voice prompts.

Usage:
    pip install -r requirements.txt
    python server.py
Then open http://localhost:8080
"""

import sqlite3
import uuid
from pathlib import Path
from contextlib import contextmanager

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

ROOT        = Path(__file__).parent
PROMPTS_DIR = ROOT / 'prompts'
DB_PATH     = ROOT / 'prompts.db'

PROMPTS_DIR.mkdir(exist_ok=True)

app = FastAPI(title='home-tts-server UI')


# ── DB helpers ──────────────────────────────────────────────────────────────

@contextmanager
def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS prompts (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                name       TEXT    NOT NULL,
                filename   TEXT    NOT NULL UNIQUE,
                size       INTEGER NOT NULL,
                created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%S', 'now', 'localtime'))
            )
        ''')


# ── Prompt API ───────────────────────────────────────────────────────────────

@app.get('/api/prompts')
def list_prompts():
    with db() as conn:
        rows = conn.execute(
            'SELECT id, name, filename, size, created_at FROM prompts ORDER BY created_at DESC'
        ).fetchall()
    return [dict(r) for r in rows]


@app.post('/api/prompts')
async def save_prompt(name: str = Form(...), pt_file: UploadFile = File(...)):
    data     = await pt_file.read()
    filename = uuid.uuid4().hex + '.pt'
    (PROMPTS_DIR / filename).write_bytes(data)
    with db() as conn:
        cur = conn.execute(
            'INSERT INTO prompts (name, filename, size) VALUES (?, ?, ?)',
            (name, filename, len(data)),
        )
        row_id = cur.lastrowid
    return {'id': row_id, 'name': name, 'size': len(data)}


@app.get('/api/prompts/{prompt_id}/download')
def download_prompt(prompt_id: int):
    with db() as conn:
        row = conn.execute('SELECT * FROM prompts WHERE id = ?', (prompt_id,)).fetchone()
    if not row:
        raise HTTPException(404, 'Prompt not found')
    path = PROMPTS_DIR / row['filename']
    if not path.exists():
        raise HTTPException(404, 'File missing on disk')
    return FileResponse(path, filename=row['name'] + '.pt',
                        media_type='application/octet-stream')


@app.delete('/api/prompts/{prompt_id}')
def delete_prompt(prompt_id: int):
    with db() as conn:
        row = conn.execute('SELECT filename FROM prompts WHERE id = ?', (prompt_id,)).fetchone()
        if not row:
            raise HTTPException(404, 'Prompt not found')
        (PROMPTS_DIR / row['filename']).unlink(missing_ok=True)
        conn.execute('DELETE FROM prompts WHERE id = ?', (prompt_id,))
    return {'ok': True}


# ── Static files (must come after API routes) ────────────────────────────────

app.mount('/', StaticFiles(directory=str(ROOT), html=True), name='static')


if __name__ == '__main__':
    init_db()
    print('UI →  http://localhost:8080')
    uvicorn.run(app, host='0.0.0.0', port=8080)
