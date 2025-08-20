/**
 * 通知模块
 * 负责锁屏通知的管理和显示
 */
class NotificationModule {
    constructor(app) {
        this.app = app;
        this.notifications = [];
        this.maxNotifications = 3;
        this.notificationTypes = [
            { icon: '📅', title: '日历', text: '您有一个即将到来的会议' },
            { icon: '🎵', title: '音乐', text: '正在播放: 喜欢的歌曲' },
            { icon: '📱', title: '信息', text: '朋友发来了消息' },
            { icon: '🌤️', title: '天气', text: '今天天气不错，适合外出' },
            { icon: '📧', title: '邮件', text: '您收到了新邮件' },
            { icon: '📰', title: '新闻', text: '科技新闻推送' },
            { icon: '🏃', title: '健康', text: '今日运动目标达成' },
            { icon: '💰', title: '银行', text: '账户余额提醒' },
            { icon: '🛒', title: '购物', text: '您的订单已发货' },
            { icon: '🎮', title: '游戏', text: '新的成就解锁' }
        ];
        
        this.init();
    }

    /**
     * 初始化通知模块
     */
    init() {
        this.addInitialNotifications();
        console.log('通知模块初始化完成');
    }

    /**
     * 添加初始通知
     */
    addInitialNotifications() {
        const initialNotifications = [
            { icon: '📱', title: '信息', text: '您有新消息' },
            { icon: '📧', title: '邮件', text: '重要邮件提醒' }
        ];

        const container = document.getElementById('notification-cards');
        if (!container) return;

        container.innerHTML = '';
        initialNotifications.forEach((notification, index) => {
            setTimeout(() => {
                this.addNotification(notification);
            }, index * 300);
        });
    }

    /**
     * 添加通知
     */
    addNotification(notification) {
        const container = document.getElementById('notification-cards');
        if (!container) return;

        // 检查通知数量限制
        if (this.notifications.length >= this.maxNotifications) {
            this.removeOldestNotification();
        }

        // 创建通知卡片
        const card = this.createNotificationCard(notification);
        container.appendChild(card);

        // 添加到通知列表
        this.notifications.push({
            element: card,
            data: notification,
            timestamp: Date.now()
        });

        // 自动删除通知
        setTimeout(() => {
            this.removeNotification(card);
        }, 8000); // 8秒后自动消失
    }

    /**
     * 创建通知卡片元素
     */
    createNotificationCard(notification) {
        const card = document.createElement('div');
        card.className = 'notification-card';
        card.style.animation = 'slideInUp 0.6s ease-out';
        
        card.innerHTML = `
            <div class="notification-icon">${notification.icon}</div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-text">${notification.text}</div>
            </div>
        `;

        // 添加点击事件
        card.addEventListener('click', () => {
            this.handleNotificationClick(notification);
        });

        return card;
    }

    /**
     * 处理通知点击
     */
    handleNotificationClick(notification) {
        console.log('点击通知:', notification.title);
        
        // 可以根据通知类型执行不同操作
        switch (notification.title) {
            case '信息':
                // 解锁后打开信息应用
                if (this.app.currentScreen === 'lockscreen') {
                    this.app.unlockPhone();
                    setTimeout(() => {
                        this.app.openApp('messages');
                    }, 500);
                }
                break;
            case '邮件':
                // 解锁后打开邮件应用
                if (this.app.currentScreen === 'lockscreen') {
                    this.app.unlockPhone();
                    setTimeout(() => {
                        this.app.openApp('mail');
                    }, 500);
                }
                break;
            // 其他通知类型...
        }
    }

    /**
     * 移除通知
     */
    removeNotification(cardElement) {
        if (!cardElement || !cardElement.parentNode) return;

        // 添加退出动画
        cardElement.classList.add('fadeOut');
        
        setTimeout(() => {
            if (cardElement.parentNode) {
                cardElement.parentNode.removeChild(cardElement);
            }
            
            // 从通知列表中移除
            this.notifications = this.notifications.filter(
                notification => notification.element !== cardElement
            );
        }, 600);
    }

    /**
     * 移除最旧的通知
     */
    removeOldestNotification() {
        if (this.notifications.length === 0) return;

        const oldestNotification = this.notifications[0];
        this.removeNotification(oldestNotification.element);
    }

    /**
     * 添加随机通知
     */
    addRandomNotification() {
        if (this.app.currentScreen !== 'lockscreen') return;

        const randomNotification = this.notificationTypes[
            Math.floor(Math.random() * this.notificationTypes.length)
        ];

        // 添加一些随机性，避免通知太频繁
        if (Math.random() > 0.3) return;

        this.addNotification(randomNotification);
    }

    /**
     * 清除所有通知
     */
    clearAllNotifications() {
        this.notifications.forEach(notification => {
            this.removeNotification(notification.element);
        });
        this.notifications = [];
    }

    /**
     * 获取通知数量
     */
    getNotificationCount() {
        return this.notifications.length;
    }

    /**
     * 模拟推送通知
     */
    pushNotification(title, text, icon = '📱') {
        const notification = { icon, title, text };
        this.addNotification(notification);
    }

    /**
     * 销毁通知模块
     */
    destroy() {
        this.clearAllNotifications();
        console.log('通知模块已销毁');
    }
}