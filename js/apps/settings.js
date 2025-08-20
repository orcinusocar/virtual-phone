/**
 * 设置应用
 */
class SettingsApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.settings = {
            dndMode: false,
            bluetooth: true,
            wifi: true,
            faceId: true
        };
    }

    render() {
        return `
            <div class="settings-app">
                <div class="settings-group">
                    <div class="settings-item">
                        <div class="settings-icon">📶</div>
                        <div class="settings-label">Wi-Fi</div>
                        <div class="settings-value">${this.settings.wifi ? '已连接' : '未连接'}</div>
                    </div>
                    <div class="settings-item">
                        <div class="settings-icon">📱</div>
                        <div class="settings-label">蓝牙</div>
                        <div class="settings-value">${this.settings.bluetooth ? '已开启' : '已关闭'}</div>
                    </div>
                    <div class="settings-item">
                        <div class="settings-icon">🔋</div>
                        <div class="settings-label">电池</div>
                        <div class="settings-value">100%</div>
                    </div>
                </div>
                
                <div class="settings-group">
                    <div class="settings-item">
                        <div class="settings-icon">🌙</div>
                        <div class="settings-label">勿扰模式</div>
                        <div class="settings-toggle">
                            <input type="checkbox" id="dnd-toggle" ${this.settings.dndMode ? 'checked' : ''}>
                            <label for="dnd-toggle"></label>
                        </div>
                    </div>
                    <div class="settings-item interactive" data-action="sound">
                        <div class="settings-icon">🔊</div>
                        <div class="settings-label">声音</div>
                        <div class="settings-value">></div>
                    </div>
                </div>
                
                <div class="settings-group">
                    <div class="settings-item interactive" data-action="wallpaper">
                        <div class="settings-icon">🎨</div>
                        <div class="settings-label">壁纸</div>
                        <div class="settings-value">></div>
                    </div>
                    <div class="settings-item interactive" data-action="faceid">
                        <div class="settings-icon">🔒</div>
                        <div class="settings-label">Face ID与密码</div>
                        <div class="settings-value">></div>
                    </div>
                </div>

                <div class="settings-group">
                    <div class="settings-item interactive" data-action="about">
                        <div class="settings-icon">ℹ️</div>
                        <div class="settings-label">关于本机</div>
                        <div class="settings-value">></div>
                    </div>
                    <div class="settings-item interactive" data-action="reset">
                        <div class="settings-icon">🔄</div>
                        <div class="settings-label">重置</div>
                        <div class="settings-value">></div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        await super.init();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 勿扰模式开关
        this.addEventListener('dnd-toggle', 'change', (e) => {
            this.settings.dndMode = e.target.checked;
            console.log('勿扰模式:', this.settings.dndMode ? '开启' : '关闭');
        });

        // 设置项点击事件
        const interactiveItems = this.getContentContainer().querySelectorAll('.settings-item.interactive');
        interactiveItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.getAttribute('data-action');
                this.handleSettingAction(action);
            });
        });
    }

    handleSettingAction(action) {
        switch (action) {
            case 'sound':
                this.showSoundSettings();
                break;
            case 'wallpaper':
                this.showWallpaperSettings();
                break;
            case 'faceid':
                this.showFaceIdSettings();
                break;
            case 'about':
                this.showAboutInfo();
                break;
            case 'reset':
                this.showResetOptions();
                break;
            default:
                console.log('未知设置项:', action);
        }
    }

    showSoundSettings() {
        this.updateContent(`
            <div class="settings-detail">
                <h3>声音设置</h3>
                <div class="settings-group">
                    <div class="settings-item">
                        <div class="settings-label">铃声音量</div>
                        <input type="range" min="0" max="100" value="80" class="volume-slider">
                    </div>
                    <div class="settings-item">
                        <div class="settings-label">媒体音量</div>
                        <input type="range" min="0" max="100" value="60" class="volume-slider">
                    </div>
                </div>
                <button onclick="history.back()" class="back-btn">返回</button>
            </div>
        `);
    }

    showWallpaperSettings() {
        this.updateContent(`
            <div class="settings-detail">
                <h3>壁纸设置</h3>
                <div class="wallpaper-grid">
                    <div class="wallpaper-option" style="background: linear-gradient(45deg, #667eea, #764ba2);">
                        <span>默认</span>
                    </div>
                    <div class="wallpaper-option" style="background: linear-gradient(45deg, #f093fb, #f5576c);">
                        <span>粉色</span>
                    </div>
                    <div class="wallpaper-option" style="background: linear-gradient(45deg, #4facfe, #00f2fe);">
                        <span>蓝色</span>
                    </div>
                    <div class="wallpaper-option" style="background: linear-gradient(45deg, #43e97b, #38f9d7);">
                        <span>绿色</span>
                    </div>
                </div>
                <button onclick="simulator.modules.appManager.openApp('settings')" class="back-btn">返回</button>
            </div>
        `);
    }

    showAboutInfo() {
        this.updateContent(`
            <div class="settings-detail">
                <h3>关于本机</h3>
                <div class="about-info">
                    <div class="about-item">
                        <strong>设备名称:</strong> iOS模拟器
                    </div>
                    <div class="about-item">
                        <strong>型号:</strong> iPhone 14 Pro
                    </div>
                    <div class="about-item">
                        <strong>系统版本:</strong> iOS 17.0
                    </div>
                    <div class="about-item">
                        <strong>存储容量:</strong> 256GB
                    </div>
                    <div class="about-item">
                        <strong>可用容量:</strong> 128GB
                    </div>
                </div>
                <button onclick="simulator.modules.appManager.openApp('settings')" class="back-btn">返回</button>
            </div>
        `);
    }

    showFaceIdSettings() {
        this.updateContent(`
            <div class="settings-detail">
                <h3>Face ID与密码</h3>
                <div class="settings-group">
                    <div class="settings-item">
                        <div class="settings-label">Face ID</div>
                        <div class="settings-toggle">
                            <input type="checkbox" id="faceid-toggle" checked>
                            <label for="faceid-toggle"></label>
                        </div>
                    </div>
                    <div class="settings-item">
                        <div class="settings-label">解锁iPhone</div>
                        <div class="settings-value">已启用</div>
                    </div>
                </div>
                <button onclick="simulator.modules.appManager.openApp('settings')" class="back-btn">返回</button>
            </div>
        `);
    }

    showResetOptions() {
        this.updateContent(`
            <div class="settings-detail">
                <h3>重置选项</h3>
                <div class="settings-group">
                    <div class="settings-item interactive" onclick="this.resetAllSettings()">
                        <div class="settings-label">还原所有设置</div>
                        <div class="settings-value">></div>
                    </div>
                    <div class="settings-item interactive" onclick="this.resetHomescreen()">
                        <div class="settings-label">还原主屏幕布局</div>
                        <div class="settings-value">></div>
                    </div>
                </div>
                <button onclick="simulator.modules.appManager.openApp('settings')" class="back-btn">返回</button>
            </div>
        `);
    }

    resetAllSettings() {
        if (confirm('确定要还原所有设置吗？')) {
            this.settings = {
                dndMode: false,
                bluetooth: true,
                wifi: true,
                faceId: true
            };
            alert('设置已还原');
        }
    }

    resetHomescreen() {
        if (confirm('确定要还原主屏幕布局吗？')) {
            alert('主屏幕布局已还原');
        }
    }
}