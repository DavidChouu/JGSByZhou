// 性能优化工具
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.optimizeFonts();
        this.addServiceWorker();
        this.optimizeAnimations();
        this.addErrorHandling();
    }
    
    // 图片懒加载优化
    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // 字体加载优化
    optimizeFonts() {
        // 预加载关键字体
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Source+Han+Sans+SC:wght@300;400;500;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
        
        // 字体加载完成后的处理
        document.fonts.ready.then(() => {
            document.body.classList.add('fonts-loaded');
        });
    }
    
    // 添加Service Worker（简化版）
    addServiceWorker() {
        if ('serviceWorker' in navigator) {
            // 创建简单的缓存策略
            const cacheName = 'suzhouai-cache-v1';
            const urlsToCache = [
                '/',
                '/css/style.css',
                '/js/main.js',
                '/js/carousel.js',
                '/js/search.js',
                '/js/map.js',
                '/pages/history.html',
                '/pages/figures.html',
                '/pages/sites.html',
                '/pages/culture.html'
            ];
            
            // 安装Service Worker
            // GitHub Pages 项目页下需使用相对路径注册 SW
            navigator.serviceWorker.register('sw.js').then(registration => {
                console.log('Service Worker registered');
            }).catch(error => {
                console.log('Service Worker registration failed:', error);
            });
        }
    }
    
    // 动画性能优化
    optimizeAnimations() {
        // 使用requestAnimationFrame优化动画
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.classList.add('animate-in');
                    });
                }
            });
        }, observerOptions);
        
        // 观察需要动画的元素
        document.querySelectorAll('.feature-card, .figure-card, .site-card, .spirit-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    // 错误处理
    addErrorHandling() {
        // 全局错误处理
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.logError('Global error', event.error);
        });
        
        // Promise错误处理
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.logError('Unhandled promise rejection', event.reason);
        });
        
        // 资源加载错误处理
        window.addEventListener('error', (event) => {
            if (event.target.tagName === 'IMG') {
                event.target.style.display = 'none';
                console.warn('Image failed to load:', event.target.src);
            }
        }, true);
    }
    
    // 错误日志记录
    logError(type, error) {
        const errorLog = {
            type: type,
            message: error.message || error,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // 存储错误日志（简化版）
        const logs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
        logs.push(errorLog);
        if (logs.length > 50) logs.shift(); // 只保留最近50条
        localStorage.setItem('errorLogs', JSON.stringify(logs));
    }
    
    // 性能监控
    monitorPerformance() {
        // 页面加载性能
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
                
                console.log('Page load time:', loadTime + 'ms');
                console.log('DOM content loaded:', domContentLoaded + 'ms');
                
                // 记录性能数据
                this.logPerformance({
                    loadTime: loadTime,
                    domContentLoaded: domContentLoaded,
                    timestamp: new Date().toISOString()
                });
            }, 0);
        });
    }
    
    // 性能日志记录
    logPerformance(data) {
        const perfLogs = JSON.parse(localStorage.getItem('performanceLogs') || '[]');
        perfLogs.push(data);
        if (perfLogs.length > 20) perfLogs.shift(); // 只保留最近20条
        localStorage.setItem('performanceLogs', JSON.stringify(perfLogs));
    }
    
    // 清理缓存
    clearCache() {
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        return caches.delete(cacheName);
                    })
                );
            });
        }
    }
}

// 导出性能优化类
window.PerformanceOptimizer = PerformanceOptimizer; 