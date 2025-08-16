// Node.js 原生静态文件服务器，适用于本地预览 GitHub Pages 项目
// 用法：node start-server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = 8080;

const mime = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.yaml': 'text/yaml',
  '.yml':  'text/yaml',
  '.md':   'text/markdown'
};
// small YAML parser reused by the server to read config/ai-model.yaml
function parseSimpleYaml(text) {
  const lines = text.split(/\r?\n/);
  const config = {};
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].replace(/\r$/, '');
    // block scalar
    const blockMatch = line.match(/^\s*([A-Za-z0-9_\-]+):\s*\|\s*$/);
    if (blockMatch) {
      const key = blockMatch[1];
      let j = i + 1;
      const parts = [];
      while (j < lines.length) {
        let l = lines[j].replace(/\r$/, '');
        if (/^[A-Za-z0-9_\-]+:\s*/.test(l)) break;
        parts.push(l.replace(/^[\t ]{1,}/, ''));
        j++;
      }
      config[key] = parts.join('\n').trim();
      i = j - 1;
      continue;
    }
    const match = line.match(/^\s*([A-Za-z0-9_\-]+):\s*["']?(.+?)["']?\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2];
      if (/^[0-9]+(\.[0-9]+)?$/.test(val)) val = Number(val);
      else if (/^(true|false)$/i.test(val)) val = val.toLowerCase() === 'true';
      config[key] = val;
    }
  }
  return config;
}

function loadRawModelConfig() {
  const p = path.join(root, 'config', 'ai-model.yaml');
  try {
    const text = fs.readFileSync(p, 'utf8');
    return parseSimpleYaml(text);
  } catch (e) {
    return null;
  }
}

const server = http.createServer((req, res) => {
  // block direct public download of the raw ai-model.yaml to avoid leaking API keys
  if (req.url && req.url.split('?')[0].replace(/\/+/g, '/') === '/config/ai-model.yaml') {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // API: provide public config without api_key
  if (req.method === 'GET' && req.url && req.url.startsWith('/api/config')) {
    const raw = loadRawModelConfig();
    if (!raw) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'failed to load model config' }));
      return;
    }
    const publicCfg = {
      endpoint: raw.endpoint || '',
      model: raw.model || '',
      system_prompt: raw.system_prompt || '',
      max_token: raw['max-token'] || raw.max_token || null,
      temperature: raw.temperature != null ? raw.temperature : null
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(publicCfg));
    return;
  }

  // API: chat proxy - forward request to real AI endpoint using secret api_key on server
  if (req.method === 'POST' && req.url && req.url.startsWith('/api/chat')) {
    // collect client body
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let clientPayload = {};
      try { clientPayload = JSON.parse(body || '{}'); } catch (e) { }
      const raw = loadRawModelConfig();
      if (!raw || !raw.api_key || !raw.endpoint) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'server missing AI configuration' }));
        return;
      }
      // build remote request
      const remoteBase = String(raw.endpoint).replace(/\/+$/, '');
      const remoteUrl = remoteBase + '/v1/chat/completions';
      const urlObj = new URL(remoteUrl);
      const lib = urlObj.protocol === 'https:' ? require('https') : require('http');
      const headers = Object.assign({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + raw.api_key
      }, clientPayload.headers || {});
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers
      };
      const remoteReq = lib.request(options, remoteRes => {
        // forward status and headers then pipe the response body
        const forwardHeaders = Object.assign({}, remoteRes.headers);
        // enforce CORS-friendly headers for browser
        forwardHeaders['access-control-allow-origin'] = '*';
        res.writeHead(remoteRes.statusCode || 200, forwardHeaders);
        remoteRes.pipe(res);
      });
      remoteReq.on('error', err => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'bad gateway', detail: String(err) }));
      });
      // send the client's requested payload to the remote endpoint
      remoteReq.write(JSON.stringify(clientPayload));
      remoteReq.end();
    });
    return;
  }

  // fallback: serve static files
  let filePath = path.join(root, decodeURIComponent(req.url.split('?')[0] || '/'));
  if (fs.statSync(root).isDirectory() && (req.url === '/' || req.url === '')) {
    filePath = path.join(root, 'index.html');
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, () => {
  console.log(`Local server running at http://localhost:${port}/`);
});