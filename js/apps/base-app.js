/**
 * 应用基类
 * 所有应用都继承自这个基类
 */
class BaseApp {
    constructor(simulator) {
        this.simulator = simulator;
        this.isInitialized = false;
        this.eventListeners = [];
    }

    /**
     * 渲染应用界面
     * 子类必须实现此方法
     */
    render() {
        throw new Error('子类必须实现 render 方法');
    }

    /**
     * 初始化应用
     * 子类可以重写此方法
     */
    async init() {
        this.isInitialized = true;
        console.log(`${this.constructor.name} 初始化完成`);
    }

    /**
     * 添加事件监听器
     */
    addEventListener(element, event, handler) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        
        if (element) {
            element.addEventListener(event, handler);
            this.eventListeners.push({ element, event, handler });
        }
    }

    /**
     * 移除所有事件监听器
     */
    removeAllEventListeners() {
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
    }

    /**
     * 获取应用内容容器
     */
    getContentContainer() {
        return document.getElementById('current-app-content');
    }

    /**
     * 更新应用内容
     */
    updateContent(html) {
        const container = this.getContentContainer();
        if (container) {
            container.innerHTML = html;
        }
    }

    /**
     * 显示加载状态
     */
    showLoading(message = '加载中...') {
        this.updateContent(`
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <div class="loading-message">${message}</div>
            </div>
        `);
    }

    /**
     * 显示错误状态
     */
    showError(message = '出现错误') {
        this.updateContent(`
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
                <button onclick="location.reload()" class="retry-btn">重试</button>
            </div>
        `);
    }

    /**
     * 销毁应用
     * 子类可以重写此方法进行清理
     */
    async destroy() {
        this.removeAllEventListeners();
        this.isInitialized = false;
        console.log(`${this.constructor.name} 已销毁`);
    }

    /**
     * 获取模拟器实例
     */
    getSimulator() {
        return this.simulator;
    }

    /**
     * 获取时间管理器
     */
    getTimeManager() {
        return this.simulator.getModule('timeManager');
    }

    /**
     * 获取通知模块
     */
    getNotificationModule() {
        return this.simulator.getModule('notification');
    }
}