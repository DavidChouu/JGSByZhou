// 苏州AI产业地图组件
class JinggangshanMap {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            width: options.width || '100%',
            height: options.height || '400px',
            sites: options.sites || this.getDefaultSites()
        };
        
        this.init();
    }
    
    init() {
        this.createMap();
        this.addSites();
        this.bindEvents();
    }
    
    createMap() {
        // 创建地图容器
        this.mapContainer = document.createElement('div');
        this.mapContainer.className = 'jinggangshan-map';
        this.mapContainer.style.cssText = `
            position: relative;
            width: ${this.options.width};
            height: ${this.options.height};
            background: linear-gradient(135deg, #87CEEB 0%, #98FB98 100%);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        `;
        
        // 创建地图标题
        const mapTitle = document.createElement('div');
        mapTitle.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255,255,255,0.9);
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            color: #333;
            z-index: 10;
        `;
        mapTitle.textContent = '苏州AI产业分布图';
        
        this.mapContainer.appendChild(mapTitle);
        this.container.appendChild(this.mapContainer);
    }
    
    addSites() {
        this.options.sites.forEach((site, index) => {
            const marker = this.createMarker(site, index);
            this.mapContainer.appendChild(marker);
        });
    }
    
    createMarker(site, index) {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.style.cssText = `
            position: absolute;
            left: ${site.x}%;
            top: ${site.y}%;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 50%, #1565c0 100%);
            border: 3px solid white;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 5;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        
        // 创建标记标签
        const label = document.createElement('div');
        label.className = 'marker-label';
        label.style.cssText = `
            position: absolute;
            left: 50%;
            top: -40px;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        label.textContent = site.name;
        
        marker.appendChild(label);
        
        // 添加悬停效果
        marker.addEventListener('mouseenter', () => {
            marker.style.transform = 'scale(1.2)';
            marker.style.background = '#1565c0';
            label.style.opacity = '1';
        });
        
        marker.addEventListener('mouseleave', () => {
            marker.style.transform = 'scale(1)';
            marker.style.background = '#2196f3';
            label.style.opacity = '0';
        });
        
        // 点击事件
        marker.addEventListener('click', () => {
            this.showSiteInfo(site);
        });
        
        return marker;
    }
    
    showSiteInfo(site) {
        // 创建信息弹窗
        const modal = document.createElement('div');
        modal.className = 'site-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        `;
        
        modalContent.innerHTML = `
            <button class="modal-close" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            ">&times;</button>
            <h3 style="color: #c41e3a; margin-bottom: 1rem; font-size: 1.5rem;">${site.name}</h3>
            <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">${site.description}</p>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                <h4 style="color: #c41e3a; margin-bottom: 0.5rem;">历史事件</h4>
                <p style="color: #666; font-size: 0.9rem;">${site.history}</p>
            </div>
            <div style="background: #fff3cd; padding: 1rem; border-radius: 10px; margin-bottom: 1rem;">
                <h4 style="color: #856404; margin-bottom: 0.5rem;">历史价值</h4>
                <p style="color: #856404; font-size: 0.9rem;">${site.value}</p>
            </div>
            <a href="${site.url}" style="
                display: inline-block;
                background: linear-gradient(135deg, #2196f3 0%, #1976d2 50%, #1565c0 100%);
                color: white;
                padding: 0.8rem 1.5rem;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                transition: transform 0.3s ease;
            ">了解更多</a>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // 关闭按钮事件
        const closeBtn = modalContent.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // 了解更多按钮悬停效果
        const learnMoreBtn = modalContent.querySelector('a');
        learnMoreBtn.addEventListener('mouseenter', () => {
            learnMoreBtn.style.transform = 'translateY(-2px)';
        });
        
        learnMoreBtn.addEventListener('mouseleave', () => {
            learnMoreBtn.style.transform = 'translateY(0)';
        });
    }
    
    bindEvents() {
        // 可以添加地图的其他交互事件
    }
    
    getDefaultSites() {
        return [
            {
                name: '黄洋界哨口',
                x: 30,
                y: 25,
                description: '黄洋界是井冈山五大哨口之一，地势险要，易守难攻。',
                history: '1928年8月30日，红军在这里打响了著名的黄洋界保卫战，以少胜多，创造了军事史上的奇迹。',
                value: '黄洋界保卫战是井冈山斗争时期的重要战役，体现了红军英勇顽强的战斗精神。',
                url: 'pages/sites.html'
            },
            {
                name: '茨坪革命旧址群',
                x: 50,
                y: 40,
                description: '茨坪是井冈山革命根据地的政治、军事、经济中心。',
                history: '1928年5月，湘赣边界工农兵政府在茨坪成立，建立了红色政权。',
                value: '茨坪革命旧址群是井冈山革命根据地最重要的遗址之一。',
                url: 'pages/sites.html'
            },
            {
                name: '小井红军医院',
                x: 70,
                y: 60,
                description: '小井红军医院是井冈山革命根据地时期建立的红军医院。',
                history: '1928年建立，1929年1月被国民党军队烧毁，130多名伤病员和医护人员壮烈牺牲。',
                value: '体现了红军对伤病员的关爱和革命人道主义精神。',
                url: 'pages/sites.html'
            },
            {
                name: '大井毛泽东旧居',
                x: 40,
                y: 70,
                description: '大井毛泽东旧居是毛泽东同志在井冈山时期居住和工作的地方。',
                history: '1927年10月，毛泽东率领秋收起义部队到达井冈山后，曾在大井居住。',
                value: '见证了毛泽东思想的形成和发展，具有重要的历史价值。',
                url: 'pages/sites.html'
            },
            {
                name: '八角楼',
                x: 60,
                y: 80,
                description: '八角楼是毛泽东同志在井冈山时期居住和办公的地方。',
                history: '1928年，毛泽东同志在八角楼写下了《中国的红色政权为什么能够存在？》等重要著作。',
                value: '见证了毛泽东思想的形成，具有重要的历史价值和纪念意义。',
                url: 'pages/sites.html'
            }
        ];
    }
}

// 导出地图类
window.JinggangshanMap = JinggangshanMap; 