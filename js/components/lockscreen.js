/**
 * 锁屏模块
 * 负责锁屏界面的所有交互逻辑
 */
class LockScreenModule {
    constructor(app) {
        this.app = app;
        this.isUnlocking = false;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        
        this.init();
    }

    /**
     * 初始化锁屏模块
     */
    init() {
        this.setupUnlockSlider();
        this.setupClickUnlock();
        console.log('锁屏模块初始化完成');
    }

    /**
     * 设置滑动解锁
     */
    setupUnlockSlider() {
        const unlockBar = document.getElementById('unlock-bar');
        const unlockSlider = document.getElementById('unlock-slider');
        
        if (!unlockBar || !unlockSlider) {
            console.warn('找不到解锁控件');
            return;
        }

        // 鼠标事件
        unlockSlider.addEventListener('mousedown', (e) => {
            this.startDrag(e.clientX);
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            this.handleDrag(e.clientX, unlockBar, unlockSlider);
        });

        document.addEventListener('mouseup', () => {
            this.endDrag(unlockSlider);
        });

        // 触摸事件
        unlockSlider.addEventListener('touchstart', (e) => {
            this.startDrag(e.touches[0].clientX);
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            this.handleDrag(e.touches[0].clientX, unlockBar, unlockSlider);
        });

        document.addEventListener('touchend', () => {
            this.endDrag(unlockSlider);
        });
    }

    /**
     * 设置点击解锁（备用方案）
     */
    setupClickUnlock() {
        const unlockBar = document.getElementById('unlock-bar');
        if (unlockBar) {
            unlockBar.addEventListener('dblclick', () => {
                this.unlock();
            });
        }
    }

    /**
     * 开始拖拽
     */
    startDrag(clientX) {
        this.isDragging = true;
        this.startX = clientX;
        
        const unlockSlider = document.getElementById('unlock-slider');
        if (unlockSlider) {
            unlockSlider.style.transition = 'none';
        }
    }

    /**
     * 处理拖拽
     */
    handleDrag(clientX, unlockBar, unlockSlider) {
        if (!this.isDragging) return;
        
        this.currentX = clientX - this.startX;
        const maxDistance = unlockBar.offsetWidth - unlockSlider.offsetWidth - 8;
        
        // 限制拖拽范围
        if (this.currentX < 0) this.currentX = 0;
        if (this.currentX > maxDistance) this.currentX = maxDistance;
        
        // 更新滑块位置
        unlockSlider.style.transform = `translateX(${this.currentX}px)`;
        
        // 检查是否达到解锁阈值
        if (this.currentX > maxDistance * 0.8) {
            console.log('触发解锁 - 滑动距离:', this.currentX, '最大距离:', maxDistance);
            this.unlock();
            this.isDragging = false;
        }
    }

    /**
     * 结束拖拽
     */
    endDrag(unlockSlider) {
        if (!this.isDragging) return;
        this.isDragging = false;
        
        // 重置滑块位置
        unlockSlider.style.transition = 'all 0.3s ease';
        unlockSlider.style.transform = 'translateX(0)';
    }

    /**
     * 解锁手机
     */
    unlock() {
        if (this.isUnlocking) return;
        this.isUnlocking = true;

        console.log('开始解锁...');
        
        // 添加解锁动画
        const unlockSlider = document.getElementById('unlock-slider');
        if (unlockSlider) {
            unlockSlider.classList.add('unlocking');
            setTimeout(() => {
                unlockSlider.classList.remove('unlocking');
            }, 500);
        }

        // 切换到主屏幕
        setTimeout(() => {
            this.app.switchScreen('homescreen');
            this.isUnlocking = false;
            console.log('解锁完成');
        }, 300);
    }

    /**
     * 锁定手机
     */
    lock() {
        console.log('锁定手机...');
        
        // 关闭当前应用
        if (this.app.currentApp) {
            this.app.closeApp();
        }
        
        // 切换到锁屏
        this.app.switchScreen('lockscreen');
        
        // 重置解锁滑块
        const unlockSlider = document.getElementById('unlock-slider');
        if (unlockSlider) {
            unlockSlider.style.transform = 'translateX(0)';
        }
        
        console.log('锁定完成');
    }

    /**
     * 销毁模块
     */
    destroy() {
        // 清理事件监听器
        const unlockSlider = document.getElementById('unlock-slider');
        if (unlockSlider) {
            unlockSlider.removeEventListener('mousedown', this.startDrag);
            unlockSlider.removeEventListener('touchstart', this.startDrag);
        }
        
        console.log('锁屏模块已销毁');
    }
}