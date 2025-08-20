/**
 * iOS模拟器主应用类
 * 负责整个应用的初始化和生命周期管理
 */
class iOSSimulator {
    constructor() {
        this.currentScreen = 'lockscreen';
        this.currentApp = null;
        this.isUnlocking = false;
        this.notes = [];
        this.photos = [];
        this.modules = {};
        
        this.init();
    }

    /**
     * 初始化应用
     */
    async init() {
        try {
            console.log('初始化iOS模拟器...');
            
            // 初始化模块
            await this.initModules();
            
            // 设置事件监听
            this.setupGlobalEvents();
            
            // 更新时间
            this.updateTime();
            
            // 启动定时器
            this.startTimers();
            
            console.log('iOS模拟器初始化完成');
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    /**
     * 初始化各个模块
     */
    async initModules() {
        // 初始化锁屏模块
        this.modules.lockScreen = new LockScreenModule(this);
        
        // 初始化主屏幕模块
        this.modules.homeScreen = new HomeScreenModule(this);
        
        // 初始化应用管理器
        this.modules.appManager = new AppManager(this);
        
        // 初始化通知模块
        this.modules.notification = new NotificationModule(this);
        
        // 初始化时间模块
        this.modules.timeManager = new TimeManager(this);
    }

    /**
     * 设置全局事件监听
     */
    setupGlobalEvents() {
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // 防止默认的触摸行为
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        // 窗口焦点事件
        window.addEventListener('focus', () => {
            this.updateTime();
        });

        // 错误处理
        window.addEventListener('error', (e) => {
            console.error('全局错误:', e);
        });
    }

    /**
     * 处理键盘快捷键
     */
    handleKeyboardShortcuts(e) {
        if (e.key === 'Escape' && this.currentApp) {
            this.closeApp();
        } else if (e.key === 'h' && e.metaKey && this.currentScreen === 'lockscreen') {
            this.unlockPhone();
        } else if (e.key === 'l' && e.metaKey && this.currentScreen === 'homescreen') {
            this.lockPhone();
        }
    }

    /**
     * 启动定时器
     */
    startTimers() {
        // 每分钟更新时间
        setInterval(() => this.updateTime(), 60000);
        
        // 每5秒添加新通知（锁屏状态下）
        setInterval(() => {
            if (this.currentScreen === 'lockscreen') {
                this.modules.notification?.addRandomNotification();
            }
        }, 5000);
    }

    /**
     * 更新时间显示
     */
    updateTime() {
        if (this.modules.timeManager) {
            this.modules.timeManager.updateAllTimes();
        }
    }

    /**
     * 解锁手机
     */
    unlockPhone() {
        if (this.modules.lockScreen) {
            this.modules.lockScreen.unlock();
        }
    }

    /**
     * 锁定手机
     */
    lockPhone() {
        if (this.modules.lockScreen) {
            this.modules.lockScreen.lock();
        }
    }

    /**
     * 打开应用
     */
    openApp(appName) {
        if (this.modules.appManager) {
            this.modules.appManager.openApp(appName);
        }
    }

    /**
     * 关闭应用
     */
    closeApp() {
        if (this.modules.appManager) {
            this.modules.appManager.closeApp();
        }
    }

    /**
     * 切换屏幕
     */
    switchScreen(screenName) {
        const screens = ['lockscreen', 'homescreen'];
        
        screens.forEach(screen => {
            const element = document.getElementById(screen);
            if (element) {
                if (screen === screenName) {
                    element.classList.add('active');
                } else {
                    element.classList.remove('active');
                }
            }
        });
        
        this.currentScreen = screenName;
        console.log(`切换到屏幕: ${screenName}`);
    }

    /**
     * 获取模块
     */
    getModule(name) {
        return this.modules[name];
    }

    /**
     * 销毁应用
     */
    destroy() {
        // 清理定时器
        // 移除事件监听
        // 销毁模块
        Object.values(this.modules).forEach(module => {
            if (module.destroy) {
                module.destroy();
            }
        });
        
        console.log('iOS模拟器已销毁');
    }
}

// 全局实例
let simulator;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    simulator = new iOSSimulator();
});