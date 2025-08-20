/**
 * 主屏幕模块
 * 负责主屏幕界面和应用图标的交互
 */
class HomeScreenModule {
    constructor(app) {
        this.app = app;
        this.init();
    }

    /**
     * 初始化主屏幕模块
     */
    init() {
        this.setupAppIcons();
        this.setupDockIcons();
        this.setupAppGrid();
        console.log('主屏幕模块初始化完成');
    }

    /**
     * 设置应用图标事件
     */
    setupAppIcons() {
        const appIcons = document.querySelectorAll('.app-grid .app-icon[data-app]');
        
        appIcons.forEach(icon => {
            const appName = icon.getAttribute('data-app');
            
            // 点击事件
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAppClick(appName, icon);
            });

            // 长按事件（为后续功能预留）
            let longPressTimer;
            icon.addEventListener('mousedown', () => {
                longPressTimer = setTimeout(() => {
                    this.handleAppLongPress(appName, icon);
                }, 500);
            });

            icon.addEventListener('mouseup', () => {
                clearTimeout(longPressTimer);
            });

            icon.addEventListener('mouseleave', () => {
                clearTimeout(longPressTimer);
            });

            // 触摸事件
            icon.addEventListener('touchstart', () => {
                longPressTimer = setTimeout(() => {
                    this.handleAppLongPress(appName, icon);
                }, 500);
            });

            icon.addEventListener('touchend', () => {
                clearTimeout(longPressTimer);
            });

            // 悬停效果
            icon.addEventListener('mouseenter', () => {
                this.addHoverEffect(icon);
            });

            icon.addEventListener('mouseleave', () => {
                this.removeHoverEffect(icon);
            });
        });
    }

    /**
     * 设置Dock栏图标
     */
    setupDockIcons() {
        const dockIcons = document.querySelectorAll('.dock .app-icon[data-app]');
        
        dockIcons.forEach(icon => {
            const appName = icon.getAttribute('data-app');
            
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAppClick(appName, icon);
            });
        });
    }

    /**
     * 设置应用网格布局
     */
    setupAppGrid() {
        const appGrid = document.querySelector('.app-grid');
        if (!appGrid) return;

        // 添加网格动画
        const appIcons = appGrid.querySelectorAll('.app-icon');
        appIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.05}s`;
            icon.classList.add('fade-in');
        });
    }

    /**
     * 处理应用点击
     */
    handleAppClick(appName, iconElement) {
        console.log(`点击应用: ${appName}`);
        
        // 添加点击动画
        this.addClickAnimation(iconElement);
        
        // 延迟打开应用，让动画完成
        setTimeout(() => {
            this.app.openApp(appName);
        }, 100);
    }

    /**
     * 处理应用长按
     */
    handleAppLongPress(appName, iconElement) {
        console.log(`长按应用: ${appName}`);
        
        // 添加震动效果（如果支持）
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // 添加长按动画
        iconElement.classList.add('long-press');
        
        // 可以在这里添加编辑模式等功能
        // this.enterEditMode();
    }

    /**
     * 添加悬停效果
     */
    addHoverEffect(iconElement) {
        iconElement.style.transform = 'scale(1.1)';
    }

    /**
     * 移除悬停效果
     */
    removeHoverEffect(iconElement) {
        if (!iconElement.classList.contains('long-press')) {
            iconElement.style.transform = '';
        }
    }

    /**
     * 添加点击动画
     */
    addClickAnimation(iconElement) {
        iconElement.classList.add('bounce');
        
        setTimeout(() => {
            iconElement.classList.remove('bounce');
        }, 600);
    }

    /**
     * 添加加载动画
     */
    addLoadingAnimation(iconElement) {
        iconElement.classList.add('loading');
    }

    /**
     * 移除加载动画
     */
    removeLoadingAnimation(iconElement) {
        iconElement.classList.remove('loading');
    }

    /**
     * 获取应用图标元素
     */
    getAppIcon(appName) {
        return document.querySelector(`.app-icon[data-app="${appName}"]`);
    }

    /**
     * 更新应用图标状态
     */
    updateAppIconState(appName, state) {
        const iconElement = this.getAppIcon(appName);
        if (!iconElement) return;

        switch (state) {
            case 'loading':
                this.addLoadingAnimation(iconElement);
                break;
            case 'normal':
                this.removeLoadingAnimation(iconElement);
                iconElement.classList.remove('long-press');
                break;
            case 'error':
                iconElement.classList.add('error');
                setTimeout(() => {
                    iconElement.classList.remove('error');
                }, 1000);
                break;
        }
    }

    /**
     * 进入编辑模式（为后续功能预留）
     */
    enterEditMode() {
        console.log('进入编辑模式');
        
        const appIcons = document.querySelectorAll('.app-icon');
        appIcons.forEach(icon => {
            icon.classList.add('edit-mode');
        });
    }

    /**
     * 退出编辑模式
     */
    exitEditMode() {
        console.log('退出编辑模式');
        
        const appIcons = document.querySelectorAll('.app-icon');
        appIcons.forEach(icon => {
            icon.classList.remove('edit-mode', 'long-press');
        });
    }

    /**
     * 销毁模块
     */
    destroy() {
        // 清理事件监听器和动画
        const appIcons = document.querySelectorAll('.app-icon');
        appIcons.forEach(icon => {
            icon.style.transform = '';
            icon.classList.remove('bounce', 'loading', 'long-press', 'edit-mode');
        });
        
        console.log('主屏幕模块已销毁');
    }
}