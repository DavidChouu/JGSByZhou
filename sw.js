// Service Worker for 苏州AI产业发展调研网站
const CACHE_NAME = 'jinggangshan-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/start.html',
    '/css/style.css',
    '/js/main.js',
    '/js/carousel.js',
    '/js/search.js',
    '/js/map.js',
    '/js/performance.js',
    '/pages/history.html',
    '/pages/figures.html',
    '/pages/sites.html',
    '/pages/culture.html',
    '/README.md',
    '/DEVELOPMENT_PLAN.md'
];

// 安装Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// 激活Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 拦截网络请求
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果缓存中有响应，返回缓存的响应
                if (response) {
                    return response;
                }
                
                // 否则从网络获取
                return fetch(event.request).then(response => {
                    // 检查响应是否有效
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // 克隆响应
                    const responseToCache = response.clone();
                    
                    // 将响应添加到缓存
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(() => {
                // 网络请求失败时的处理
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

// 离线页面
const offlinePage = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>离线 - 苏州AI产业发展调研</title>
    <style>
        body {
            font-family: 'Noto Sans SC', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .offline-container {
            text-align: center;
            max-width: 500px;
            padding: 2rem;
        }
        .offline-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        .offline-title {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        .offline-message {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        .retry-button {
            background: rgba(255,255,255,0.2);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .retry-button:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">📡</div>
        <h1 class="offline-title">网络连接中断</h1>
        <p class="offline-message">
                            您当前处于离线状态，无法访问苏州AI产业发展调研网站。
            请检查网络连接后重试。
        </p>
        <button class="retry-button" onclick="window.location.reload()">
            重新连接
        </button>
    </div>
</body>
</html>
`;

// 处理离线请求
self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(offlinePage, {
                    headers: { 'Content-Type': 'text/html' }
                });
            })
        );
    }
}); 