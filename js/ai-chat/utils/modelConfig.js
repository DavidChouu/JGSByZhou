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
  text.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*["']?(.+?)["']?\s*$/);
    if (match) {
      config[match[1]] = match[2];
    }
  });
  return {
    api_key: config.api_key || '',
    endpoint: config.endpoint || '',
    model: config.model || ''
  };
}