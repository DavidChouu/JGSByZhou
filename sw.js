// Service Worker for 苏州AI产业发展调研网站
const CACHE_NAME = 'suzhouai-cache-v1';
const urlsToCache = [
    'index.html',
    'start.html',
    'css/style.css',
    'js/main.js',
    'js/carousel.js',
    'js/search.js',
    'js/map.js',
    'js/performance.js',
    'pages/about.html',
    'pages/companies.html',
    'pages/industry-map.html',
    'pages/news.html',
    'pages/policies.html'
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
                if (response) {
                    return response;
                }
                return fetch(event.request).then(networkResponse => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    return networkResponse;
                });
            })
            .catch(() => {
                if (event.request.destination === 'document') {
                    return caches.match('index.html');
                }
            })
    );
});

// 注：离线导航已统一在上面的 fetch 处理里通过缓存 index.html 兜底