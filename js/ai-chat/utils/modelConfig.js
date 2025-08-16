// js/ai-chat/utils/modelConfig.js

/**
 * 异步读取并解析 config/ai-model.yaml，返回 { api_key, endpoint, model } 对象
 * 仅支持 key: "value" 的简单 YAML 格式
 */
export async function loadModelConfig() {
  // 从后端受限接口获取公共配置（不包含 api_key）
  const resp = await fetch('/api/config');
  if (!resp.ok) {
    // 将后端返回的错误暴露给调用方，以便 UI 显示友好提示
    let text = '';
    try { text = await resp.text(); } catch (e) { /* ignore */ }
    throw new Error('无法获取模型配置: ' + (text || resp.status));
  }
  const cfg = await resp.json();
  // 如果必须字段缺失，抛出明确错误，触发前端显示“配置缺失”提示
  if (!cfg || !cfg.endpoint || !cfg.model) {
    throw new Error('AI模型配置缺失，请检查 config/ai-model.yaml。');
  }
  return {
    api_key: '', // 客户端不持有 api_key
    endpoint: cfg.endpoint || '',
    model: cfg.model || '',
    system_prompt: cfg.system_prompt || '',
    max_token: cfg.max_token || null,
    temperature: cfg.temperature != null ? cfg.temperature : null
  };
}