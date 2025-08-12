// 图片轮播组件
class Carousel {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            autoplay: options.autoplay !== false,
            interval: options.interval || 5000,
            indicators: options.indicators !== false,
            controls: options.controls !== false,
            touch: options.touch !== false
        };
        
        this.currentIndex = 0;
        this.slides = [];
        this.indicators = [];
        this.isPlaying = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.createSlides();
        this.createControls();
        this.createIndicators();
        this.bindEvents();
        this.showSlide(0);
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }
    
    createSlides() {
        // 创建轮播容器
        this.carouselContainer = document.createElement('div');
        this.carouselContainer.className = 'carousel-container';
        this.carouselContainer.style.cssText = `
            position: relative;
            width: 100%;
            height: 400px;
            overflow: hidden;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        `;
        
        // 创建幻灯片容器
        this.slidesContainer = document.createElement('div');
        this.slidesContainer.className = 'carousel-slides';
        this.slidesContainer.style.cssText = `
            display: flex;
            width: 100%;
            height: 100%;
            transition: transform 0.5s ease-in-out;
        `;
        
        // 添加示例幻灯片（占位图片）
        const slideData = [
            { title: '苏州AI产业园区', description: '现代化的AI产业园区，创新发展的摇篮' },
            { title: '黄洋界哨口', description: '红军战斗过的地方' },
            { title: '茨坪革命旧址', description: '革命先辈工作生活的地方' },
            { title: '小井红军医院', description: '红军医疗事业的重要见证' }
        ];
        
        slideData.forEach((slide, index) => {
            const slideElement = this.createSlide(slide, index);
            this.slides.push(slideElement);
            this.slidesContainer.appendChild(slideElement);
        });
        
        this.carouselContainer.appendChild(this.slidesContainer);
        this.container.appendChild(this.carouselContainer);
    }
    
    createSlide(data, index) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.style.cssText = `
            min-width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            position: relative;
        `;
        
        slide.innerHTML = `
            <div class="slide-content">
                <h3 style="font-size: 2rem; margin-bottom: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                    ${data.title}
                </h3>
                <p style="font-size: 1.2rem; opacity: 0.9; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                    ${data.description}
                </p>
                <div style="position: absolute; bottom: 20px; right: 20px; font-size: 0.9rem; opacity: 0.7;">
                    ${index + 1} / ${this.slides.length}
                </div>
            </div>
        `;
        
        return slide;
    }
    
    createControls() {
        if (!this.options.controls) return;
        
        // 上一张按钮
        this.prevButton = document.createElement('button');
        this.prevButton.className = 'carousel-control prev';
        this.prevButton.innerHTML = '‹';
        this.prevButton.style.cssText = `
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
        `;
        
        // 下一张按钮
        this.nextButton = document.createElement('button');
        this.nextButton.className = 'carousel-control next';
        this.nextButton.innerHTML = '›';
        this.nextButton.style.cssText = `
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
        `;
        
        this.carouselContainer.appendChild(this.prevButton);
        this.carouselContainer.appendChild(this.nextButton);
    }
    
    createIndicators() {
        if (!this.options.indicators) return;
        
        this.indicatorsContainer = document.createElement('div');
        this.indicatorsContainer.className = 'carousel-indicators';
        this.indicatorsContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 10;
        `;
        
        for (let i = 0; i < this.slides.length; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background: rgba(255,255,255,0.5);
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            this.indicators.push(indicator);
            this.indicatorsContainer.appendChild(indicator);
        }
        
        this.carouselContainer.appendChild(this.indicatorsContainer);
    }
    
    bindEvents() {
        // 控制按钮事件
        if (this.options.controls) {
            this.prevButton.addEventListener('click', () => this.prev());
            this.nextButton.addEventListener('click', () => this.next());
            
            // 悬停效果
            [this.prevButton, this.nextButton].forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.background = 'rgba(0,0,0,0.8)';
                    btn.style.transform = 'translateY(-50%) scale(1.1)';
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.background = 'rgba(0,0,0,0.5)';
                    btn.style.transform = 'translateY(-50%) scale(1)';
                });
            });
        }
        
        // 指示器事件
        if (this.options.indicators) {
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.showSlide(index));
            });
        }
        
        // 触摸事件
        if (this.options.touch) {
            this.carouselContainer.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
            });
            
            this.carouselContainer.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].clientX;
                this.handleSwipe();
            });
        }
        
        // 鼠标悬停暂停自动播放
        this.carouselContainer.addEventListener('mouseenter', () => {
            if (this.options.autoplay) {
                this.stopAutoplay();
            }
        });
        
        this.carouselContainer.addEventListener('mouseleave', () => {
            if (this.options.autoplay) {
                this.startAutoplay();
            }
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
    
    showSlide(index) {
        if (index < 0) {
            index = this.slides.length - 1;
        } else if (index >= this.slides.length) {
            index = 0;
        }
        
        this.currentIndex = index;
        this.slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        
        // 更新指示器
        if (this.options.indicators) {
            this.indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.style.background = 'rgba(255,255,255,1)';
                    indicator.style.transform = 'scale(1.2)';
                } else {
                    indicator.style.background = 'rgba(255,255,255,0.5)';
                    indicator.style.transform = 'scale(1)';
                }
            });
        }
    }
    
    next() {
        this.showSlide(this.currentIndex + 1);
    }
    
    prev() {
        this.showSlide(this.currentIndex - 1);
    }
    
    startAutoplay() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, this.options.interval);
    }
    
    stopAutoplay() {
        if (!this.isPlaying) return;
        
        this.isPlaying = false;
        clearInterval(this.autoplayInterval);
    }
    
    destroy() {
        this.stopAutoplay();
        this.container.innerHTML = '';
    }
}

// 导出轮播类
window.Carousel = Carousel; 