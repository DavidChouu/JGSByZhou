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
                <h3 style="margin: 0; color: #333; font-size: 1.2rem;">搜索井冈山文化遗产</h3>
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
            background: linear-gradient(135deg, #c41e3a 0%, #8b0000 100%);
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
        // 井冈山文化遗产搜索数据
        this.searchData = [
            {
                title: '井冈山革命根据地',
                content: '井冈山革命根据地是中国第一个农村革命根据地，由毛泽东同志创建于1927年。',
                url: 'pages/history.html',
                category: '历史背景',
                keywords: ['井冈山', '革命', '根据地', '毛泽东', '1927']
            },
            {
                title: '毛泽东同志',
                content: '毛泽东同志是伟大的马克思主义者，在井冈山时期开创了农村包围城市的革命道路。',
                url: 'pages/figures.html',
                category: '历史人物',
                keywords: ['毛泽东', '革命', '井冈山', '领袖']
            },
            {
                title: '朱德同志',
                content: '朱德同志是中国人民解放军的主要缔造者之一，在井冈山时期与毛泽东同志密切配合。',
                url: 'pages/figures.html',
                category: '历史人物',
                keywords: ['朱德', '军事', '井冈山', '元帅']
            },
            {
                title: '黄洋界哨口',
                content: '黄洋界是井冈山五大哨口之一，1928年8月30日在这里发生了著名的黄洋界保卫战。',
                url: 'pages/sites.html',
                category: '重要遗址',
                keywords: ['黄洋界', '哨口', '保卫战', '1928']
            },
            {
                title: '茨坪革命旧址群',
                content: '茨坪是井冈山革命根据地的政治、军事、经济中心，保存着大量革命旧址。',
                url: 'pages/sites.html',
                category: '重要遗址',
                keywords: ['茨坪', '旧址', '政治中心', '革命']
            },
            {
                title: '小井红军医院',
                content: '小井红军医院是井冈山革命根据地时期建立的红军医院，体现了红军的人道主义精神。',
                url: 'pages/sites.html',
                category: '重要遗址',
                keywords: ['小井', '医院', '红军', '医疗']
            },
            {
                title: '井冈山精神',
                content: '井冈山精神包括坚定信念、艰苦奋斗、实事求是、依靠群众、敢闯新路、勇于胜利。',
                url: 'pages/culture.html',
                category: '文化传承',
                keywords: ['井冈山精神', '信念', '奋斗', '实事求是']
            },
            {
                title: '坚定信念',
                content: '坚定信念是井冈山精神的灵魂，革命先辈们始终坚信革命必胜。',
                url: 'pages/culture.html',
                category: '文化传承',
                keywords: ['信念', '精神', '革命', '理想']
            },
            {
                title: '艰苦奋斗',
                content: '艰苦奋斗是井冈山精神的本质特征，体现了红军战士顽强的革命意志。',
                url: 'pages/culture.html',
                category: '文化传承',
                keywords: ['奋斗', '艰苦', '意志', '精神']
            },
            {
                title: '实事求是',
                content: '实事求是是井冈山精神的核心，体现了马克思主义与中国实际相结合的科学态度。',
                url: 'pages/culture.html',
                category: '文化传承',
                keywords: ['实事求是', '科学', '态度', '马克思主义']
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