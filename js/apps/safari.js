/**
 * Safari浏览器应用
 */
class SafariApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.currentUrl = 'https://www.apple.com/cn/';
        this.bookmarks = [
            { name: 'Apple', url: 'https://www.apple.com/cn/' },
            { name: 'GitHub', url: 'https://github.com' },
            { name: '百度', url: 'https://www.baidu.com' },
            { name: '微博', url: 'https://weibo.com' }
        ];
        this.history = [];
    }

    render() {
        return `
            <div class="safari-app">
                <div class="safari-toolbar">
                    <div class="url-bar">
                        <input type="text" id="url-input" value="${this.currentUrl}" placeholder="搜索或输入网站名称">
                        <button class="go-btn">前往</button>
                    </div>
                </div>
                
                <div class="safari-content">
                    <div class="browser-tabs">
                        <div class="tab active">
                            <span class="tab-title">Apple</span>
                            <button class="tab-close">×</button>
                        </div>
                        <button class="new-tab-btn">+</button>
                    </div>
                    
                    <div class="page-content">
                        ${this.renderPageContent()}
                    </div>
                </div>
                
                <div class="safari-bottom-bar">
                    <button class="safari-nav-btn back-nav-btn">←</button>
                    <button class="safari-nav-btn forward-nav-btn">→</button>
                    <button class="safari-nav-btn refresh-nav-btn">↻</button>
                    <button class="safari-nav-btn bookmarks-nav-btn">📖</button>
                    <button class="safari-nav-btn share-nav-btn">📤</button>
                </div>
            </div>
        `;
    }

    renderPageContent() {
        return `
            <div class="webpage-simulation">
                <div class="webpage-header">
                    <h1>🍎 Apple</h1>
                    <p>Think Different</p>
                </div>
                <div class="webpage-content">
                    <div class="product-showcase">
                        <div class="product-item">
                            <h3>iPhone 15 Pro</h3>
                            <p>钛金属材质，强悍实力</p>
                        </div>
                        <div class="product-item">
                            <h3>MacBook Air</h3>
                            <p>搭载M2芯片，轻薄强劲</p>
                        </div>
                        <div class="product-item">
                            <h3>Apple Watch</h3>
                            <p>健康守护，全新升级</p>
                        </div>
                    </div>
                </div>
                <div class="webpage-footer">
                    <p>这是一个模拟的网页界面</p>
                </div>
            </div>
        `;
    }

    async init() {
        await super.init();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // URL输入框事件
        this.addEventListener('url-input', 'keypress', (e) => {
            if (e.key === 'Enter') {
                this.navigate();
            }
        });

        // 前往按钮
        const goBtn = this.getContentContainer().querySelector('.go-btn');
        if (goBtn) {
            this.addEventListener(goBtn, 'click', () => this.navigate());
        }

        // 导航按钮
        const backBtn = this.getContentContainer().querySelector('.back-nav-btn');
        if (backBtn) {
            this.addEventListener(backBtn, 'click', () => this.goBack());
        }

        const forwardBtn = this.getContentContainer().querySelector('.forward-nav-btn');
        if (forwardBtn) {
            this.addEventListener(forwardBtn, 'click', () => this.goForward());
        }

        const refreshBtn = this.getContentContainer().querySelector('.refresh-nav-btn');
        if (refreshBtn) {
            this.addEventListener(refreshBtn, 'click', () => this.refresh());
        }

        const bookmarksBtn = this.getContentContainer().querySelector('.bookmarks-nav-btn');
        if (bookmarksBtn) {
            this.addEventListener(bookmarksBtn, 'click', () => this.showBookmarks());
        }

        const shareBtn = this.getContentContainer().querySelector('.share-nav-btn');
        if (shareBtn) {
            this.addEventListener(shareBtn, 'click', () => this.share());
        }
    }

    navigate() {
        const urlInput = document.getElementById('url-input');
        if (urlInput) {
            const url = urlInput.value;
            this.currentUrl = url;
            console.log('导航到:', url);
            // 这里可以添加更多的页面模拟
        }
    }

    goBack() {
        console.log('返回上一页');
    }

    goForward() {
        console.log('前进到下一页');
    }

    refresh() {
        console.log('刷新页面');
        const pageContent = this.getContentContainer().querySelector('.page-content');
        if (pageContent) {
            pageContent.innerHTML = this.renderPageContent();
        }
    }

    showBookmarks() {
        this.updateContent(`
            <div class="bookmarks-view">
                <div class="bookmarks-header">
                    <button class="back-btn" onclick="simulator.modules.appManager.openApp('safari')">← 返回</button>
                    <h3>书签</h3>
                </div>
                <div class="bookmarks-list">
                    ${this.bookmarks.map(bookmark => `
                        <div class="bookmark-item" onclick="simulator.modules.appManager.getCurrentApp().instance.openBookmark('${bookmark.url}')">
                            <div class="bookmark-icon">🔖</div>
                            <div class="bookmark-info">
                                <div class="bookmark-name">${bookmark.name}</div>
                                <div class="bookmark-url">${bookmark.url}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `);
    }

    openBookmark(url) {
        this.currentUrl = url;
        // 重新打开Safari应用
        this.simulator.modules.appManager.openApp('safari');
    }

    share() {
        alert('分享功能');
    }
}