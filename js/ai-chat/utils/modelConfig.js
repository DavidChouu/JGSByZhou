// js/ai-chat/utils/modelConfig.js

/**
 * 异步读取并解析 config/ai-model.yaml，返回 { api_key, endpoint, model } 对象
 * 仅支持 key: "value" 的简单 YAML 格式
 */
export async function loadModelConfig() {
  const response = await fetch('/config/ai-model.yaml');
  if (!response.ok) throw new Error('无法获取模型配置文件');
  const text = await response.text();
  const config = {};
  // 支持 CRLF 和 LF，两种换行都处理
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    // 去掉行尾可能残留的回车，便于正则匹配
    let line = lines[i].replace(/\r$/, '');
    // 先匹配 block scalar: key: |
    const blockMatch = line.match(/^\s*(\w+):\s*\|\s*$/);
    if (blockMatch) {
      const key = blockMatch[1];
      let j = i + 1;
      const parts = [];
      // 收集后续缩进行，直到遇到下一个顶层 key（从列首开始的 key:）或文件结束
      while (j < lines.length) {
        let l = lines[j].replace(/\r$/, '');
        // 如果下一行是新的顶层 key（列首开始的 key:）则停止
        if (/^[A-Za-z0-9_]+:\s*/.test(l)) break;
        // 去掉最小的缩进（空格或制表符），保持相对缩进信息
        parts.push(l.replace(/^[\t ]{1,}/, ''));
        j++;
      }
      config[key] = parts.join('\n').trim();
      i = j - 1;
      continue;
    }
    // 匹配 simple key: "value" 或 key: value
    const match = line.match(/^\s*(\w+):\s*["']?(.+?)["']?\s*$/);
    if (match) {
      config[match[1]] = match[2];
      continue;
    }
  }
  return {
    api_key: config.api_key || '',
    endpoint: config.endpoint || '',
    model: config.model || '',
    system_prompt: config.system_prompt || ''
  };
}