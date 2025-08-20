/**
 * 时钟应用
 */
class ClockApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.activeTab = 'world';
        this.updateInterval = null;
    }

    render() {
        return `
            <div class="clock-app">
                <div class="clock-display">
                    <div class="current-time" id="clock-time">09:41:25</div>
                    <div class="current-date" id="clock-date">1月15日 星期一</div>
                </div>
                
                <div class="clock-tabs">
                    <div class="clock-tab ${this.activeTab === 'world' ? 'active' : ''}" data-tab="world">世界时钟</div>
                    <div class="clock-tab ${this.activeTab === 'alarm' ? 'active' : ''}" data-tab="alarm">闹钟</div>
                    <div class="clock-tab ${this.activeTab === 'stopwatch' ? 'active' : ''}" data-tab="stopwatch">秒表</div>
                    <div class="clock-tab ${this.activeTab === 'timer' ? 'active' : ''}" data-tab="timer">计时器</div>
                </div>
                
                <div class="clock-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
    }

    renderTabContent() {
        switch (this.activeTab) {
            case 'world':
                return this.renderWorldClocks();
            case 'alarm':
                return this.renderAlarms();
            case 'stopwatch':
                return this.renderStopwatch();
            case 'timer':
                return this.renderTimer();
            default:
                return this.renderWorldClocks();
        }
    }

    renderWorldClocks() {
        const timeManager = this.getTimeManager();
        const worldTimes = timeManager ? timeManager.getWorldClockTimes() : [
            { name: '北京', time: '09:41' },
            { name: '纽约', time: '21:41' },
            { name: '伦敦', time: '02:41' },
            { name: '东京', time: '10:41' },
            { name: '巴黎', time: '03:41' },
            { name: '悉尼', time: '12:41' }
        ];

        return `
            <div class="world-clocks">
                ${worldTimes.map(city => `
                    <div class="world-clock-item">
                        <div class="world-clock-city">${city.name}</div>
                        <div class="world-clock-time">${city.time}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderAlarms() {
        return `
            <div class="alarms-section">
                <div class="alarm-item">
                    <div class="alarm-time">07:00</div>
                    <div class="alarm-label">工作日闹钟</div>
                    <div class="alarm-toggle">
                        <input type="checkbox" id="alarm1" checked>
                        <label for="alarm1"></label>
                    </div>
                </div>
                <div class="alarm-item">
                    <div class="alarm-time">08:30</div>
                    <div class="alarm-label">周末闹钟</div>
                    <div class="alarm-toggle">
                        <input type="checkbox" id="alarm2">
                        <label for="alarm2"></label>
                    </div>
                </div>
                <button class="add-alarm-btn">+ 添加闹钟</button>
            </div>
        `;
    }

    renderStopwatch() {
        return `
            <div class="stopwatch-section">
                <div class="stopwatch-display">
                    <div class="stopwatch-time" id="stopwatch-time">00:00.00</div>
                </div>
                <div class="stopwatch-controls">
                    <button class="stopwatch-btn reset-btn" id="reset-btn">复位</button>
                    <button class="stopwatch-btn start-btn" id="start-stop-btn">开始</button>
                </div>
                <div class="lap-times" id="lap-times">
                    <!-- 计次记录 -->
                </div>
            </div>
        `;
    }

    renderTimer() {
        return `
            <div class="timer-section">
                <div class="timer-picker">
                    <div class="time-picker">
                        <select id="timer-hours">
                            ${Array.from({length: 24}, (_, i) => `<option value="${i}">${i.toString().padStart(2, '0')}</option>`).join('')}
                        </select>
                        <span>小时</span>
                        <select id="timer-minutes">
                            ${Array.from({length: 60}, (_, i) => `<option value="${i}" ${i === 5 ? 'selected' : ''}>${i.toString().padStart(2, '0')}</option>`).join('')}
                        </select>
                        <span>分钟</span>
                        <select id="timer-seconds">
                            ${Array.from({length: 60}, (_, i) => `<option value="${i}">${i.toString().padStart(2, '0')}</option>`).join('')}
                        </select>
                        <span>秒</span>
                    </div>
                </div>
                <div class="timer-display" id="timer-display">05:00</div>
                <div class="timer-controls">
                    <button class="timer-btn cancel-btn" id="cancel-timer-btn">取消</button>
                    <button class="timer-btn start-btn" id="start-timer-btn">开始</button>
                </div>
            </div>
        `;
    }

    async init() {
        await super.init();
        this.setupEventListeners();
        this.startRealTimeUpdate();
    }

    setupEventListeners() {
        // 标签切换
        const tabs = this.getContentContainer().querySelectorAll('.clock-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // 根据当前标签设置特定事件
        this.setupTabSpecificEvents();
    }

    setupTabSpecificEvents() {
        switch (this.activeTab) {
            case 'stopwatch':
                this.setupStopwatchEvents();
                break;
            case 'timer':
                this.setupTimerEvents();
                break;
        }
    }

    setupStopwatchEvents() {
        // 秒表事件处理
        this.addEventListener('start-stop-btn', 'click', () => {
            console.log('秒表开始/停止');
        });

        this.addEventListener('reset-btn', 'click', () => {
            console.log('秒表复位');
        });
    }

    setupTimerEvents() {
        // 计时器事件处理
        this.addEventListener('start-timer-btn', 'click', () => {
            console.log('计时器开始');
        });

        this.addEventListener('cancel-timer-btn', 'click', () => {
            console.log('计时器取消');
        });
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        // 重新渲染内容
        const container = this.getContentContainer();
        if (container) {
            container.innerHTML = this.render();
            this.setupEventListeners();
        }
    }

    startRealTimeUpdate() {
        const timeManager = this.getTimeManager();
        if (timeManager) {
            // 添加时钟应用的时间元素
            timeManager.addTimeElement('clock-time', 'clock-time', 'time-seconds');
            timeManager.addTimeElement('clock-date', 'clock-date', 'full-date');
            timeManager.startRealTimeUpdate();
        }

        // 每秒更新时间显示
        this.updateInterval = setInterval(() => {
            const timeElement = document.getElementById('clock-time');
            const dateElement = document.getElementById('clock-date');
            
            if (timeElement && dateElement) {
                const now = new Date();
                timeElement.textContent = now.toLocaleTimeString('zh-CN');
                dateElement.textContent = now.toLocaleDateString('zh-CN', {
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                });
            }
        }, 1000);
    }

    async destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        const timeManager = this.getTimeManager();
        if (timeManager) {
            timeManager.removeTimeElement('clock-time');
            timeManager.removeTimeElement('clock-date');
            timeManager.stopRealTimeUpdate();
        }
        
        await super.destroy();
    }
}