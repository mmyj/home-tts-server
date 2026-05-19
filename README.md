# home-tts-server

Qwen3-TTS 的本地 Web UI，连接部署在局域网的 TTS 服务（默认 `http://qwen3-tts.m4yj.home`）。

## 功能

- **Custom Voice** — 使用 9 种预设音色生成语音，支持流式输出
- **Voice Design** — 用自然语言描述音色（音调、情感、风格等）生成语音，支持流式输出
- **Voice Clone** — 上传参考音频克隆声音，支持直接克隆和 Prompt 工作流两种模式
- **音色库** — 管理已保存的声音 Prompt（.pt 文件），支持导入/导出
- **Tokenizer** — 音频编解码（encode/decode）

## 快速开始

```bash
pip install -r requirements.txt
python server.py
```

打开 http://localhost:8080

`server.py` 是一个轻量 FastAPI 服务，负责：
1. 托管静态页面
2. 管理音色库（SQLite + `prompts/` 目录存储 .pt 文件）

## Voice Clone 工作流

**直接克隆**：上传参考音频 → 输入文本 → Generate

**Prompt 工作流**（推荐，可复用音色）：

1. Step 1：上传参考音频 → 点击「保存到音色库」或「下载到本地」，生成 `.pt` 文件
2. Step 2：从音色库选择，或上传 `.pt` 文件 → 输入文本 → Generate

## 文件结构

```
.
├── index.html
├── server.py          # 本地服务器（静态托管 + 音色库 API）
├── requirements.txt
├── prompts.db         # SQLite（音色库元数据，自动生成）
├── prompts/           # .pt 文件存储目录（自动生成）
├── css/
│   └── style.css
└── js/
    ├── api.js         # TTS 服务 API 封装
    ├── audio.js       # 音频处理（格式转换、PCM→WAV、播放、下载）
    ├── db.js          # 音色库本地 API 封装
    ├── ui.js          # 公共 UI 工具（i18n、状态显示、拖拽上传）
    └── tabs/
        ├── custom-voice.js
        ├── voice-design.js
        ├── voice-clone.js
        ├── prompts.js
        └── tokenizer.js
```

## 注意事项

- 参考音频支持任意浏览器可解码格式（m4a、mp3、wav 等），上传前会自动转换为 WAV
- 需要先启动 `python server.py` 才能使用音色库功能；直接打开 `index.html` 文件则音色库不可用
- `prompts/` 目录和 `prompts.db` 可以提交到 git，实现音色库的版本管理和多机共享
