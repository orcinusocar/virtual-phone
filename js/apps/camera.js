/**
 * 相机应用
 */
class CameraApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.isRecording = false;
        this.photos = [];
    }

    render() {
        return `
            <div class="camera-app">
                <div class="camera-viewfinder">
                    <div class="camera-overlay">
                        <div class="camera-grid">
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                            <div class="grid-line"></div>
                        </div>
                        <div class="camera-focus-point" id="focus-point"></div>
                    </div>
                    <div class="camera-preview">
                        <div class="preview-content">
                            <span class="camera-emoji">📸</span>
                            <p>轻触拍照</p>
                        </div>
                    </div>
                </div>
                
                <div class="camera-controls">
                    <div class="camera-mode">照片</div>
                    <div class="camera-shutter" id="camera-shutter">
                        <div class="shutter-inner"></div>
                    </div>
                    <div class="camera-gallery" id="camera-gallery">
                        <span class="gallery-icon">📷</span>
                        <span class="photo-count">${this.photos.length}</span>
                    </div>
                </div>
                
                <div class="camera-modes">
                    <div class="mode-item active">照片</div>
                    <div class="mode-item">视频</div>
                    <div class="mode-item">人像</div>
                </div>
            </div>
        `;
    }

    async init() {
        await super.init();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 拍照按钮
        this.addEventListener('camera-shutter', 'click', () => {
            this.takePhoto();
        });

        // 相册按钮
        this.addEventListener('camera-gallery', 'click', () => {
            this.openGallery();
        });

        // 预览区域点击对焦
        const viewfinder = this.getContentContainer().querySelector('.camera-viewfinder');
        if (viewfinder) {
            viewfinder.addEventListener('click', (e) => {
                this.focusAt(e);
            });
        }

        // 模式切换
        const modeItems = this.getContentContainer().querySelectorAll('.mode-item');
        modeItems.forEach(item => {
            item.addEventListener('click', () => {
                this.switchMode(item.textContent);
            });
        });
    }

    takePhoto() {
        console.log('拍照...');
        
        const shutter = document.getElementById('camera-shutter');
        if (shutter) {
            // 拍照动画
            shutter.style.animation = 'none';
            setTimeout(() => {
                shutter.style.animation = '';
            }, 10);
            
            // 闪光效果
            this.showFlashEffect();
            
            // 添加照片到相册
            this.addPhotoToGallery();
        }
    }

    showFlashEffect() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 9999;
            opacity: 0.8;
            pointer-events: none;
        `;
        document.body.appendChild(flash);
        
        setTimeout(() => {
            document.body.removeChild(flash);
        }, 100);
    }

    addPhotoToGallery() {
        const photo = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            emoji: this.getRandomPhotoEmoji()
        };
        
        this.photos.unshift(photo);
        
        // 更新相册计数
        const photoCount = this.getContentContainer().querySelector('.photo-count');
        if (photoCount) {
            photoCount.textContent = this.photos.length;
        }
        
        console.log('照片已保存:', photo);
    }

    getRandomPhotoEmoji() {
        const emojis = ['🌅', '🌸', '🍰', '🌊', '🌻', '🦋', '🌙', '🎨', '🏔️', '🌺'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    focusAt(e) {
        const focusPoint = document.getElementById('focus-point');
        if (!focusPoint) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        focusPoint.style.left = x + 'px';
        focusPoint.style.top = y + 'px';
        focusPoint.style.display = 'block';
        
        // 对焦动画
        focusPoint.style.animation = 'focusAnimation 0.5s ease-out';
        
        setTimeout(() => {
            focusPoint.style.display = 'none';
        }, 500);
    }

    switchMode(mode) {
        console.log('切换模式:', mode);
        
        // 更新模式按钮状态
        const modeItems = this.getContentContainer().querySelectorAll('.mode-item');
        modeItems.forEach(item => {
            if (item.textContent === mode) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // 更新模式显示
        const modeDisplay = this.getContentContainer().querySelector('.camera-mode');
        if (modeDisplay) {
            modeDisplay.textContent = mode;
        }
    }

    openGallery() {
        if (this.photos.length === 0) {
            alert('还没有拍摄任何照片');
            return;
        }

        this.updateContent(`
            <div class="camera-gallery-view">
                <div class="gallery-header">
                    <button class="back-btn" onclick="simulator.modules.appManager.openApp('camera')">← 返回</button>
                    <h3>相机胶卷</h3>
                    <span class="photo-count">${this.photos.length} 张照片</span>
                </div>
                <div class="gallery-grid">
                    ${this.photos.map(photo => `
                        <div class="gallery-item">
                            <div class="gallery-photo">
                                <span class="gallery-emoji">${photo.emoji}</span>
                            </div>
                            <div class="photo-date">${new Date(photo.timestamp).toLocaleDateString('zh-CN')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `);
    }
}