# home-tts-server

Qwen3-TTS 的本地 Web UI，连接部署在局域网的 TTS 服务。

## 功能

- **Custom Voice** — 使用 9 种预设音色生成语音，支持流式输出
- **Voice Design** — 用自然语言描述音色（音调、情感、风格等）生成语音，支持流式输出
- **Voice Clone** — 上传参考音频克隆声音，支持直接克隆和 Prompt 工作流两种模式
- **音色库** — 管理已保存的声音 Prompt（.pt 文件），支持导入/导出
- **Tokenizer** — 音频编解码（encode/decode）
- **并发 TTS** — 将长文本分句后并发请求，完成后合并为完整音频（在设置页开启）

## 启动步骤

### 第一步：启动 TTS 后端

后端使用 Docker 镜像 `neosun/qwen3-tts:2.0.0`，以下为参考 `docker-compose.yml`：

```yaml
services:
  qwen3-tts:
    container_name: qwen3-tts
    image: neosun/qwen3-tts:2.0.0
    ports:
      - "8766:8766"
    environment:
      - PORT=8766
      - QWEN_TTS_MODEL_DIR=/app/models
      - HF_HUB_OFFLINE=1
    volumes:
      - ./data:/tmp/qwen3-tts
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              device_ids: ["0"]
              capabilities: [gpu]
    restart: unless-stopped
```

```bash
docker compose up -d
```

服务启动后监听 `http://localhost:8766`，可通过 `http://localhost:8766/docs` 查看 API 文档。

> `device_ids: ["0"]` 指定使用第一块 GPU，按实际情况修改。  
> `HF_HUB_OFFLINE=1` 表示离线模式，模型需提前下载到 `QWEN_TTS_MODEL_DIR`。

### 第二步：配置 UI

编辑 `config.js`，将 `TTS_BASE_URL` 改为 TTS 服务的地址：

```js
const TTS_BASE_URL = 'http://localhost:8766';
```

如果 TTS 服务部署在局域网其他机器上，填写对应 IP 或主机名。

### 第三步：启动 UI 服务器

```bash
pip install -r requirements.txt
python server.py
```

打开 http://localhost:8080

`server.py` 是一个轻量 FastAPI 服务，负责托管静态页面并管理音色库（SQLite + `prompts/` 目录）。

## Voice Clone 工作流

**直接克隆**：上传参考音频 → 输入文本 → Generate

**Prompt 工作流**（推荐，可复用音色）：

1. Step 1：上传参考音频 → 点击「保存到音色库」或「下载到本地」，生成 `.pt` 文件
2. Step 2：从音色库选择，或上传 `.pt` 文件 → 输入文本 → Generate

## 文件结构

```
.
├── index.html
├── config.js          # TTS 服务地址配置
├── server.py          # 本地服务器（静态托管 + 音色库 API）
├── requirements.txt
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
        ├── settings.js
        └── tokenizer.js
```

## 注意事项

- 参考音频支持任意浏览器可解码格式（m4a、mp3、wav 等），上传前会自动转换为 WAV
- 需要先启动 `python server.py` 才能使用音色库功能；直接打开 `index.html` 文件则音色库不可用
- `prompts/` 目录和 `prompts.db` 已加入 `.gitignore`，不会被提交到远程
