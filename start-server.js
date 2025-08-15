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

const server = http.createServer((req, res) => {
  let filePath = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (fs.statSync(root).isDirectory() && req.url === '/') {
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