// 搜索功能组件
class SearchEngine {
    constructor(options = {}) {
        this.options = {
            searchInput: options.searchInput || '.search-input',
            searchResults: options.searchResults || '.search-results',
            searchData: options.searchData || [],
            minQueryLength: options.minQueryLength || 2,
            maxResults: options.maxResults || 10,
            highlightClass: options.highlightClass || 'search-highlight'
        };
        
        this.searchInput = null;
        this.searchResults = null;
        this.isSearching = false;
        
        this.init();
    }
    
    init() {
        this.setupSearchInterface();
        this.bindEvents();
        this.loadSearchData();
    }
    
    setupSearchInterface() {
        // 创建搜索界面
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 1000;
            background: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            padding: 1rem;
            min-width: 300px;
            display: none;
        `;
        
        searchContainer.innerHTML = `
            <div class="search-header" style="margin-bottom: 1rem;">
                <h3 style="margin: 0; color: #333; font-size: 1.2rem;">搜索苏州AI产业发展</h3>
            </div>
            <div class="search-input-container" style="margin-bottom: 1rem;">
                <input type="text" class="search-input" placeholder="输入关键词搜索..." 
                       style="width: 100%; padding: 0.8rem; border: 2px solid #eee; border-radius: 5px; font-size: 1rem;">
            </div>
            <div class="search-results" style="max-height: 400px; overflow-y: auto;">
                <div class="search-placeholder" style="text-align: center; color: #666; padding: 2rem;">
                    输入关键词开始搜索...
                </div>
            </div>
        `;
        
        document.body.appendChild(searchContainer);
        
        this.searchInput = searchContainer.querySelector('.search-input');
        this.searchResults = searchContainer.querySelector('.search-results');
        
        // 创建搜索按钮
        const searchButton = document.createElement('button');
        searchButton.className = 'search-toggle';
        searchButton.innerHTML = '🔍';
        searchButton.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            z-index: 1001;
        `;
        
        document.body.appendChild(searchButton);
        
        // 搜索按钮事件
        searchButton.addEventListener('click', () => {
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer.style.display === 'none') {
                searchContainer.style.display = 'block';
                this.searchInput.focus();
            } else {
                searchContainer.style.display = 'none';
            }
        });
        
        // 点击外部关闭搜索
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target) && !searchButton.contains(e.target)) {
                searchContainer.style.display = 'none';
            }
        });
    }
    
    bindEvents() {
        // 搜索输入事件
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            this.performSearch(query);
        });
        
        // 搜索历史记录
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    this.saveSearchHistory(query);
                }
            }
        });
    }
    
    loadSearchData() {
        // 苏州AI产业发展搜索数据
        this.searchData = [
            {
                title: '苏州AI产业发展现状',
                content: '苏州作为长三角重要城市，在人工智能产业发展方面取得了显著成就，形成了完整的AI产业生态。',
                url: 'index.html',
                category: '产业发展',
                keywords: ['苏州', 'AI', '人工智能', '产业', '发展']
            },
            {
                title: '独角兽企业',
                content: '苏州拥有多家AI领域的独角兽企业，在智能制造、自动驾驶、医疗AI等领域处于领先地位。',
                url: 'pages/companies.html',
                category: '企业介绍',
                keywords: ['独角兽', '企业', '智能制造', '自动驾驶', '医疗AI']
            },
            {
                title: '优质企业',
                content: '苏州聚集了大量优质AI企业，涵盖算法、芯片、应用等多个产业链环节。',
                url: 'pages/companies.html',
                category: '企业介绍',
                keywords: ['优质企业', '算法', '芯片', '应用', '产业链']
            },
            {
                title: '国家政策支持',
                content: '国家层面出台多项政策支持AI产业发展，为苏州AI产业提供了良好的政策环境。',
                url: 'pages/policies.html',
                category: '政策支持',
                keywords: ['国家政策', 'AI产业', '政策环境', '支持']
            },
            {
                title: '江苏省政策',
                content: '江苏省政府制定专项政策，支持苏州AI产业创新发展，打造AI产业高地。',
                url: 'pages/policies.html',
                category: '政策支持',
                keywords: ['江苏省', '政策', '创新发展', '产业高地']
            },
            {
                title: '苏州市政策',
                content: '苏州市政府出台具体措施，从资金、人才、平台等方面支持AI产业发展。',
                url: 'pages/policies.html',
                category: '政策支持',
                keywords: ['苏州市', '政策', '资金', '人才', '平台']
            },
            {
                title: '产业地图',
                content: '苏州AI产业在地理上形成了多个集聚区，包括工业园区、高新区等核心区域。',
                url: 'pages/industry-map.html',
                category: '产业布局',
                keywords: ['产业地图', '集聚区', '工业园区', '高新区', '核心区域']
            },
            {
                title: '调研动态',
                content: '南京大学数智苏州前瞻调研团深入企业调研，了解AI产业发展现状和趋势。',
                url: 'pages/news.html',
                category: '调研活动',
                keywords: ['调研', '南京大学', '数智苏州', '企业', '趋势']
            },
            {
                title: '团队介绍',
                content: '数智苏州前瞻调研团由南京大学学生组成，致力于研究苏州AI产业发展。',
                url: 'pages/about.html',
                category: '团队信息',
                keywords: ['团队', '南京大学', '学生', '研究', 'AI产业']
            },
            {
                title: 'AI技术应用',
                content: '苏州AI技术在智能制造、智慧城市、医疗健康等领域得到广泛应用。',
                url: 'index.html',
                category: '技术应用',
                keywords: ['AI技术', '智能制造', '智慧城市', '医疗健康', '应用']
            }
        ];
    }
    
    performSearch(query) {
        if (query.length < this.options.minQueryLength) {
            this.showPlaceholder();
            return;
        }
        
        const results = this.searchData.filter(item => {
            const searchText = `${item.title} ${item.content} ${item.keywords.join(' ')}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        }).slice(0, this.options.maxResults);
        
        this.displayResults(results, query);
    }
    
    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div style="text-align: center; color: #666; padding: 2rem;">
                    未找到相关结果
                </div>
            `;
            return;
        }
        
        const resultsHTML = results.map(item => {
            const highlightedTitle = this.highlightText(item.title, query);
            const highlightedContent = this.highlightText(item.content.substring(0, 100) + '...', query);
            
            return `
                <div class="search-result-item" style="
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                " onclick="window.location.href='${item.url}'">
                    <div class="result-title" style="
                        font-weight: bold;
                        color: #c41e3a;
                        margin-bottom: 0.5rem;
                        font-size: 1.1rem;
                    ">${highlightedTitle}</div>
                    <div class="result-content" style="
                        color: #666;
                        font-size: 0.9rem;
                        margin-bottom: 0.5rem;
                    ">${highlightedContent}</div>
                    <div class="result-category" style="
                        color: #999;
                        font-size: 0.8rem;
                    ">${item.category}</div>
                </div>
            `;
        }).join('');
        
        this.searchResults.innerHTML = resultsHTML;
        
        // 添加悬停效果
        const resultItems = this.searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#f8f9fa';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = 'transparent';
            });
        });
    }
    
    highlightText(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, `<span class="${this.options.highlightClass}" style="background-color: #ffd700; padding: 0 2px; border-radius: 2px;">$1</span>`);
    }
    
    showPlaceholder() {
        this.searchResults.innerHTML = `
            <div class="search-placeholder" style="text-align: center; color: #666; padding: 2rem;">
                输入关键词开始搜索...
            </div>
        `;
    }
    
    saveSearchHistory(query) {
        let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        if (!history.includes(query)) {
            history.unshift(query);
            history = history.slice(0, 10); // 只保留最近10条
            localStorage.setItem('searchHistory', JSON.stringify(history));
        }
    }
    
    getSearchHistory() {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }
}

// 导出搜索类
window.SearchEngine = SearchEngine; 