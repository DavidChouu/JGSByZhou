// ai-chat.js 自动化自注册组件
(function () {
  // 样式注入
  const style = document.createElement('style');
  style.textContent = `
.ai-chat-fab {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 9999;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #2d8cf0;
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  font-size: 28px;
  cursor: pointer;
  transition: background 0.2s;
}
.ai-chat-fab:hover { background: #1766c2; }
.ai-chat-window {
  position: fixed;
  right: 32px;
  bottom: 100px;
  width: 340px;
  max-height: 480px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  z-index: 10000;
  overflow: hidden;
  font-family: system-ui, sans-serif;
  border: 1px solid #e5e5e5;
  animation: ai-chat-fadein 0.18s;
}
@keyframes ai-chat-fadein { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none;} }
.ai-chat-header {
  padding: 14px 18px;
  background: #f7f9fa;
  border-bottom: 1px solid #e5e5e5;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ai-chat-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #888;
  cursor: pointer;
  padding: 0;
}
.ai-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fafbfc;
  font-size: 15px;
}
.ai-chat-message {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
}
.ai-chat-message.ai { align-items: flex-start; }
.ai-chat-message.user { align-items: flex-end; }
.ai-chat-bubble {
  max-width: 90%;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f0f4fa;
  color: #222;
  word-break: break-word;
  font-size: 15px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.ai-chat-message.ai .ai-chat-bubble {
  background: #f0f4fa;
  color: #222;
}
.ai-chat-message.user .ai-chat-bubble {
  background: #2d8cf0;
  color: #fff;
}
.ai-chat-input-area {
  display: flex;
  padding: 12px 14px;
  border-top: 1px solid #e5e5e5;
  background: #fff;
}
.ai-chat-input {
  flex: 1;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 15px;
  outline: none;
  resize: none;
  min-height: 34px;
  max-height: 80px;
  background: #fafbfc;
}
.ai-chat-send {
  margin-left: 8px;
  background: #2d8cf0;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0 18px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}
.ai-chat-send:disabled { background: #b3d2f6; cursor: not-allowed; }
.ai-chat-markdown pre {
  background: #222;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 14px;
  margin: 8px 0;
}
.ai-chat-markdown code {
  background: #f4f4f4;
  color: #c7254e;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 14px;
}
.ai-chat-markdown h1 { font-size: 1.3em; margin: 0.7em 0 0.4em; }
.ai-chat-markdown h2 { font-size: 1.15em; margin: 0.6em 0 0.3em; }
.ai-chat-markdown h3 { font-size: 1em; margin: 0.5em 0 0.2em; }
.ai-chat-markdown ul, .ai-chat-markdown ol { margin: 0.5em 0 0.5em 1.2em; }
.ai-chat-markdown a { color: #2d8cf0; text-decoration: underline; }
`;
  document.head.appendChild(style);

  // DOM结构
  const fab = document.createElement('button');
  fab.className = 'ai-chat-fab';
  fab.title = 'AI助手';
  fab.innerHTML = '&#129302;'; // 🤖

  const chatWindow = document.createElement('div');
  chatWindow.className = 'ai-chat-window';
  chatWindow.style.display = 'none';
  chatWindow.innerHTML = `
    <div class="ai-chat-header">
      <span>AI 对话</span>
      <button class="ai-chat-close" title="关闭">&times;</button>
    </div>
    <div class="ai-chat-messages"></div>
    <form class="ai-chat-input-area">
      <textarea class="ai-chat-input" rows="1" placeholder="请输入..."></textarea>
      <button class="ai-chat-send" type="submit" disabled>发送</button>
    </form>
  `;

  document.body.appendChild(fab);
  document.body.appendChild(chatWindow);

  // 事件绑定
  fab.onclick = () => {
    chatWindow.style.display = '';
    fab.style.display = 'none';
    setTimeout(() => {
      chatWindow.querySelector('.ai-chat-input').focus();
    }, 100);
  };
  chatWindow.querySelector('.ai-chat-close').onclick = () => {
    chatWindow.style.display = 'none';
    fab.style.display = '';
  };

  // 输入区逻辑
  const input = chatWindow.querySelector('.ai-chat-input');
  const sendBtn = chatWindow.querySelector('.ai-chat-send');
  input.addEventListener('input', () => {
    sendBtn.disabled = !input.value.trim();
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 80) + 'px';
  });

  // 消息区
  const messages = chatWindow.querySelector('.ai-chat-messages');

  // Markdown渲染器（简易，支持常见语法）
  function renderMarkdown(md) {
    let html = md
      // 代码块 ```code```
      .replace(/```([\s\S]*?)```/g, (_, code) =>
        `<pre><code>${escapeHtml(code)}</code></pre>`)
      // 行内代码 `code`
      .replace(/`([^`\n]+?)`/g, (_, code) =>
        `<code>${escapeHtml(code)}</code>`)
      // 标题
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      // 粗体
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      // 斜体
      .replace(/\*(.+?)\*/g, '<i>$1</i>')
      // 有序列表
      .replace(/^\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>')
      // 无序列表
      .replace(/^\s*[-*]\s+(.*)$/gm, '<ul><li>$1</li></ul>')
      // 链接
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // 换行
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br>');
    // 合并连续ul/ol
    html = html.replace(/(<ul>(?:<li>.*?<\/li>)+<\/ul>)/gs, m => m.replace(/<\/ul>\s*<ul>/g, ''))
               .replace(/(<ol>(?:<li>.*?<\/li>)+<\/ol>)/gs, m => m.replace(/<\/ol>\s*<ol>/g, ''));
    return `<div class="ai-chat-markdown"><p>${html}</p></div>`;
  }
  function escapeHtml(str) {
    return str.replace(/[<>&"]/g, c => ({
      '<': '<', '>': '>', '&': '&', '"': '"'
    }[c]));
  }

  // 消息渲染
  function appendMessage(role, text, isMarkdown, stream = false) {
    const msg = document.createElement('div');
    msg.className = 'ai-chat-message ' + role;
    const bubble = document.createElement('div');
    bubble.className = 'ai-chat-bubble';
    if (isMarkdown) {
      bubble.innerHTML = stream ? '' : renderMarkdown(text);
    } else {
      bubble.textContent = text;
    }
    msg.appendChild(bubble);
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  }

  // 流式输出模拟
  function streamMarkdownReply(md, cb) {
    let i = 0, out = '';
    const chars = [...md];
    function step() {
      if (i < chars.length) {
        out += chars[i++];
        cb(renderMarkdown(out));
        setTimeout(step, 18 + Math.random() * 30);
      }
    }
    step();
  }

  // 发送消息
  chatWindow.querySelector('.ai-chat-input-area').onsubmit = function (e) {
    e.preventDefault();
    const userText = input.value.trim();
    if (!userText) return;
    appendMessage('user', userText, false);
    input.value = '';
    sendBtn.disabled = true;
    input.style.height = 'auto';

    // AI回复（流式Markdown演示）
    const aiMd = demoAiReply(userText);
    const bubble = appendMessage('ai', '', true, true);
    streamMarkdownReply(aiMd, html => {
      bubble.innerHTML = html;
      messages.scrollTop = messages.scrollHeight;
    });
  };

  // 示例AI回复（可替换为实际API调用）
  function demoAiReply(userText) {
    if (/markdown/i.test(userText)) {
      return `# Markdown 示例
**粗体**、*斜体*、\`代码\`、[链接](https://www.example.com)

- 列表项一
- 列表项二

\`\`\`js
console.log('代码块');
\`\`\`
`;
    }
    return `你好！我是AI助手，有什么可以帮您？\n\n你刚才说：\n> ${userText}`;
  }

  // 自动加载模型配置，预留API集成接口
  let modelConfig = null;
  let modelConfigLoaded = false;
  let modelConfigError = null;

  function getModelConfig() {
    return modelConfig;
  }
  function isModelConfigLoaded() {
    return modelConfigLoaded;
  }
  function getModelConfigError() {
    return modelConfigError;
  }

  // 动态加载 loadModelConfig
  (function loadConfig() {
    // 支持直接script引入，无需ESM
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import { loadModelConfig } from '../../utils/modelConfig.js';
      window.__aiChatModelConfigPromise = loadModelConfig()
        .then(cfg => { window.__aiChatModelConfig = cfg; })
        .catch(e => { window.__aiChatModelConfigError = e; });
    `;
    document.head.appendChild(script);

    // 轮询window变量，兼容所有浏览器
    let tries = 0;
    (function poll() {
      tries++;
      if (window.__aiChatModelConfig) {
        modelConfig = window.__aiChatModelConfig;
        modelConfigLoaded = true;
      } else if (window.__aiChatModelConfigError) {
        modelConfigError = window.__aiChatModelConfigError;
        modelConfigLoaded = true;
      } else if (tries < 50) {
        setTimeout(poll, 100);
      }
    })();
  })();

  // 预留全局只读接口（可选，便于后续API集成）
  window.aiChat = {
    getModelConfig,
    isModelConfigLoaded,
    getModelConfigError
  };
})();