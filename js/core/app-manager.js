/**
 * 应用管理器
 * 负责应用的打开、关闭和状态管理
 */
class AppManager {
    constructor(app) {
        this.app = app;
        this.currentApp = null;
        this.apps = new Map();
        this.init();
    }

    /**
     * 初始化应用管理器
     */
    init() {
        this.registerApps();
        console.log('应用管理器初始化完成');
    }

    /**
     * 注册所有应用
     */
    registerApps() {
        // 注册系统应用
        this.apps.set('settings', {
            name: '设置',
            component: SettingsApp,
            icon: '⚙️'
        });

        this.apps.set('notes', {
            name: '备忘录',
            component: NotesApp,
            icon: '📝'
        });

        this.apps.set('photos', {
            name: '照片',
            component: PhotosApp,
            icon: '🖼️'
        });

        this.apps.set('calculator', {
            name: '计算器',
            component: CalculatorApp,
            icon: '🔢'
        });

        this.apps.set('weather', {
            name: '天气',
            component: WeatherApp,
            icon: '☀️'
        });

        this.apps.set('clock', {
            name: '时钟',
            component: ClockApp,
            icon: '⏰'
        });

        this.apps.set('messages', {
            name: '信息',
            component: MessagesApp,
            icon: '💬'
        });

        this.apps.set('camera', {
            name: '相机',
            component: CameraApp,
            icon: '📷'
        });

        // Dock应用
        this.apps.set('phone', {
            name: '电话',
            component: PhoneApp,
            icon: '📞'
        });

        this.apps.set('safari', {
            name: 'Safari',
            component: SafariApp,
            icon: '🌐'
        });

        this.apps.set('music', {
            name: '音乐',
            component: MusicApp,
            icon: '🎵'
        });

        this.apps.set('mail', {
            name: '邮件',
            component: MailApp,
            icon: '✉️'
        });
    }

    /**
     * 打开应用
     */
    async openApp(appName) {
        console.log(`打开应用: ${appName}`);

        if (!this.apps.has(appName)) {
            console.error(`应用不存在: ${appName}`);
            return;
        }

        try {
            // 更新图标状态
            const homeScreen = this.app.getModule('homeScreen');
            if (homeScreen) {
                homeScreen.updateAppIconState(appName, 'loading');
            }

            // 关闭当前应用
            if (this.currentApp) {
                await this.closeApp();
            }

            // 获取应用信息
            const appInfo = this.apps.get(appName);
            
            // 创建应用实例
            const appInstance = new appInfo.component(this.app);
            
            // 生成应用内容
            const appContainer = document.getElementById('app-container');
            if (!appContainer) {
                throw new Error('找不到应用容器');
            }

            // 设置应用头部和内容
            appContainer.innerHTML = `
                <div class="app-header">
                    <div class="app-title">${appInfo.name}</div>
                    <button class="close-btn" id="app-close-btn">×</button>
                </div>
                <div class="app-content" id="current-app-content">
                    ${appInstance.render()}
                </div>
            `;

            // 设置关闭按钮事件
            const closeBtn = document.getElementById('app-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeApp();
                });
            }

            // 显示应用容器
            appContainer.classList.add('active');

            // 初始化应用
            if (appInstance.init) {
                await appInstance.init();
            }

            // 更新状态
            this.currentApp = {
                name: appName,
                instance: appInstance,
                info: appInfo
            };

            this.app.currentApp = appName;

            // 更新图标状态
            if (homeScreen) {
                homeScreen.updateAppIconState(appName, 'normal');
            }

            console.log(`应用 ${appName} 打开成功`);

        } catch (error) {
            console.error(`打开应用失败: ${appName}`, error);
            
            // 更新图标状态为错误
            const homeScreen = this.app.getModule('homeScreen');
            if (homeScreen) {
                homeScreen.updateAppIconState(appName, 'error');
            }
        }
    }

    /**
     * 关闭应用
     */
    async closeApp() {
        if (!this.currentApp) return;

        console.log(`关闭应用: ${this.currentApp.name}`);

        try {
            // 调用应用的销毁方法
            if (this.currentApp.instance && this.currentApp.instance.destroy) {
                await this.currentApp.instance.destroy();
            }

            // 隐藏应用容器
            const appContainer = document.getElementById('app-container');
            if (appContainer) {
                appContainer.classList.remove('active');
                
                // 延迟清空内容，让动画完成
                setTimeout(() => {
                    appContainer.innerHTML = '';
                }, 400);
            }

            // 更新状态
            this.currentApp = null;
            this.app.currentApp = null;

            console.log('应用关闭成功');

        } catch (error) {
            console.error('关闭应用失败:', error);
        }
    }

    /**
     * 获取当前应用
     */
    getCurrentApp() {
        return this.currentApp;
    }

    /**
     * 获取应用列表
     */
    getAppList() {
        return Array.from(this.apps.entries()).map(([key, value]) => ({
            key,
            ...value
        }));
    }

    /**
     * 检查应用是否存在
     */
    hasApp(appName) {
        return this.apps.has(appName);
    }

    /**
     * 重启应用
     */
    async restartApp(appName) {
        if (this.currentApp && this.currentApp.name === appName) {
            await this.closeApp();
        }
        await this.openApp(appName);
    }

    /**
     * 销毁应用管理器
     */
    destroy() {
        if (this.currentApp) {
            this.closeApp();
        }
        
        this.apps.clear();
        console.log('应用管理器已销毁');
    }
}