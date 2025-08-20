/**
 * 时间管理模块
 * 负责全局时间显示的更新和管理
 */
class TimeManager {
    constructor(app) {
        this.app = app;
        this.updateInterval = null;
        this.timeElements = new Map();
        this.init();
    }

    /**
     * 初始化时间管理器
     */
    init() {
        this.registerTimeElements();
        this.updateAllTimes();
        console.log('时间管理器初始化完成');
    }

    /**
     * 注册需要更新时间的元素
     */
    registerTimeElements() {
        // 锁屏时间元素
        this.timeElements.set('lockscreen-time', {
            element: document.getElementById('lockscreen-time'),
            format: 'time'
        });

        this.timeElements.set('lockscreen-time-large', {
            element: document.getElementById('lockscreen-time-large'),
            format: 'time'
        });

        this.timeElements.set('lockscreen-date', {
            element: document.getElementById('lockscreen-date'),
            format: 'date'
        });

        // 主屏幕时间元素
        this.timeElements.set('home-time', {
            element: document.getElementById('home-time'),
            format: 'time'
        });

        // 时钟应用元素（动态注册）
        this.timeElements.set('clock-time', {
            element: null, // 动态获取
            format: 'time-seconds'
        });

        this.timeElements.set('clock-date', {
            element: null, // 动态获取
            format: 'full-date'
        });
    }

    /**
     * 更新所有时间显示
     */
    updateAllTimes() {
        const now = new Date();
        
        this.timeElements.forEach((config, key) => {
            this.updateTimeElement(key, config, now);
        });
    }

    /**
     * 更新单个时间元素
     */
    updateTimeElement(key, config, now) {
        // 动态获取元素（用于应用内的时间元素）
        if (!config.element) {
            config.element = document.getElementById(key);
        }

        if (!config.element) return;

        const formattedTime = this.formatTime(now, config.format);
        config.element.textContent = formattedTime;
    }

    /**
     * 格式化时间
     */
    formatTime(date, format) {
        const options = {
            hour12: false,
            timeZone: 'Asia/Shanghai'
        };

        switch (format) {
            case 'time':
                return date.toLocaleTimeString('zh-CN', {
                    ...options,
                    hour: '2-digit',
                    minute: '2-digit'
                });

            case 'time-seconds':
                return date.toLocaleTimeString('zh-CN', {
                    ...options,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

            case 'date':
                return date.toLocaleDateString('zh-CN', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                });

            case 'full-date':
                return date.toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                });

            case 'short-date':
                return date.toLocaleDateString('zh-CN', {
                    month: 'short',
                    day: 'numeric'
                });

            case 'year':
                return date.getFullYear().toString();

            case 'month':
                return date.toLocaleDateString('zh-CN', { month: 'long' });

            case 'day':
                return date.getDate().toString();

            case 'weekday':
                return date.toLocaleDateString('zh-CN', { weekday: 'long' });

            default:
                return date.toLocaleString('zh-CN');
        }
    }

    /**
     * 获取当前时间信息
     */
    getCurrentTimeInfo() {
        const now = new Date();
        return {
            timestamp: now.getTime(),
            time: this.formatTime(now, 'time'),
            timeWithSeconds: this.formatTime(now, 'time-seconds'),
            date: this.formatTime(now, 'date'),
            fullDate: this.formatTime(now, 'full-date'),
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
            weekday: now.getDay(),
            hour: now.getHours(),
            minute: now.getMinutes(),
            second: now.getSeconds()
        };
    }

    /**
     * 获取世界时钟时间
     */
    getWorldClockTime(timezone) {
        const now = new Date();
        const options = {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        
        return now.toLocaleTimeString('zh-CN', options);
    }

    /**
     * 获取多个城市的时间
     */
    getWorldClockTimes() {
        const cities = [
            { name: '北京', timezone: 'Asia/Shanghai' },
            { name: '纽约', timezone: 'America/New_York' },
            { name: '伦敦', timezone: 'Europe/London' },
            { name: '东京', timezone: 'Asia/Tokyo' },
            { name: '巴黎', timezone: 'Europe/Paris' },
            { name: '悉尼', timezone: 'Australia/Sydney' }
        ];

        return cities.map(city => ({
            ...city,
            time: this.getWorldClockTime(city.timezone)
        }));
    }

    /**
     * 启动实时更新
     */
    startRealTimeUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        this.updateInterval = setInterval(() => {
            this.updateAllTimes();
        }, 1000);
    }

    /**
     * 停止实时更新
     */
    stopRealTimeUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * 添加自定义时间元素
     */
    addTimeElement(key, elementId, format) {
        this.timeElements.set(key, {
            element: document.getElementById(elementId),
            format: format
        });
    }

    /**
     * 移除时间元素
     */
    removeTimeElement(key) {
        this.timeElements.delete(key);
    }

    /**
     * 获取时间差
     */
    getTimeDifference(targetTime) {
        const now = Date.now();
        const diff = targetTime - now;
        
        if (diff <= 0) return null;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        return {
            total: diff,
            days: days,
            hours: hours % 24,
            minutes: minutes % 60,
            seconds: seconds % 60
        };
    }

    /**
     * 格式化时间差
     */
    formatTimeDifference(diff) {
        if (!diff) return '已过期';

        if (diff.days > 0) {
            return `${diff.days}天 ${diff.hours}小时`;
        } else if (diff.hours > 0) {
            return `${diff.hours}小时 ${diff.minutes}分钟`;
        } else if (diff.minutes > 0) {
            return `${diff.minutes}分钟 ${diff.seconds}秒`;
        } else {
            return `${diff.seconds}秒`;
        }
    }

    /**
     * 销毁时间管理器
     */
    destroy() {
        this.stopRealTimeUpdate();
        this.timeElements.clear();
        console.log('时间管理器已销毁');
    }
}