// 移动端导航菜单功能
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // 汉堡菜单点击事件
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // 点击导航链接时关闭菜单
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 滚动时导航栏效果（优化性能）
    let ticking = false;
    function updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(74, 144, 226, 0.95)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)';
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 页面加载动画
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    document.querySelectorAll('.feature-card, .intro-content').forEach(el => {
        observer.observe(el);
    });
});

// 图片懒加载功能
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 搜索功能（如果后续需要）
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            // 这里可以添加搜索逻辑
            console.log('搜索:', searchTerm);
        });
    }
}

// 返回顶部按钮
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
                    background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;

    document.body.appendChild(backToTopBtn);

    // 显示/隐藏返回顶部按钮（优化性能）
    let backToTopTicking = false;
    function updateBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
        backToTopTicking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!backToTopTicking) {
            requestAnimationFrame(updateBackToTop);
            backToTopTicking = true;
        }
    });

    // 点击返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 悬停效果
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });

    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
    initSearch();
    initBackToTop();
    
    // 初始化图片轮播
    const carouselContainer = document.getElementById('jinggangshan-carousel');
    if (carouselContainer) {
        new Carousel(carouselContainer, {
            autoplay: true,
            interval: 4000,
            indicators: true,
            controls: true,
            touch: true
        });
    }
    
    // 初始化搜索功能
    new SearchEngine({
        minQueryLength: 2,
        maxResults: 8
    });
    
    // 初始化地图组件
    const mapContainer = document.getElementById('jinggangshan-map');
    if (mapContainer) {
        new JinggangshanMap(mapContainer, {
            width: '100%',
            height: '500px'
        });
    }
});

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }

    .back-to-top:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
    }

    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }

    .lazy.loaded {
        opacity: 1;
    }

    body.loaded {
        opacity: 1;
    }

    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
`;
document.head.appendChild(style);

// 初始化所有功能
document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
    initSearch();
    initBackToTop();
}); 