/**
 * 照片应用
 */
class PhotosApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.photos = this.generateSamplePhotos();
    }

    generateSamplePhotos() {
        return [
            { id: 1, emoji: '🌅', background: 'linear-gradient(45deg, #ff9a8b, #fccb90)', name: '日出' },
            { id: 2, emoji: '🌸', background: 'linear-gradient(45deg, #a8edea, #fed6e3)', name: '樱花' },
            { id: 3, emoji: '🍰', background: 'linear-gradient(45deg, #d299c2, #fef9d7)', name: '蛋糕' },
            { id: 4, emoji: '🌊', background: 'linear-gradient(45deg, #89f7fe, #66a6ff)', name: '海浪' },
            { id: 5, emoji: '🌻', background: 'linear-gradient(45deg, #fdbb2d, #22c1c3)', name: '向日葵' },
            { id: 6, emoji: '🦋', background: 'linear-gradient(45deg, #ee9ca7, #ffdde1)', name: '蝴蝶' },
            { id: 7, emoji: '🌙', background: 'linear-gradient(45deg, #2196f3, #21cbf3)', name: '月亮' },
            { id: 8, emoji: '🎨', background: 'linear-gradient(45deg, #f093fb, #f5576c)', name: '艺术' },
            { id: 9, emoji: '🏔️', background: 'linear-gradient(45deg, #4facfe, #00f2fe)', name: '雪山' }
        ];
    }

    render() {
        return `
            <div class="photos-app">
                <div class="photos-header">
                    <h3>所有照片</h3>
                    <span class="photo-count">${this.photos.length} 张照片</span>
                </div>
                <div class="photos-grid">
                    ${this.renderPhotosGrid()}
                </div>
            </div>
        `;
    }

    renderPhotosGrid() {
        return this.photos.map(photo => `
            <div class="photo-item" style="background: ${photo.background};" data-photo-id="${photo.id}">
                <span class="photo-emoji">${photo.emoji}</span>
                <div class="photo-overlay">
                    <span class="photo-name">${photo.name}</span>
                </div>
            </div>
        `).join('');
    }

    async init() {
        await super.init();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const photoItems = this.getContentContainer().querySelectorAll('.photo-item');
        photoItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const photoId = parseInt(item.getAttribute('data-photo-id'));
                this.viewPhoto(photoId);
            });
        });
    }

    viewPhoto(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        if (!photo) return;

        this.updateContent(`
            <div class="photo-viewer">
                <div class="photo-viewer-header">
                    <button class="back-btn" onclick="simulator.modules.appManager.openApp('photos')">← 返回</button>
                    <h3>${photo.name}</h3>
                    <button class="share-btn">分享</button>
                </div>
                <div class="photo-viewer-content">
                    <div class="photo-large" style="background: ${photo.background};">
                        <span class="photo-emoji-large">${photo.emoji}</span>
                    </div>
                    <div class="photo-info">
                        <p><strong>名称:</strong> ${photo.name}</p>
                        <p><strong>日期:</strong> ${new Date().toLocaleDateString('zh-CN')}</p>
                        <p><strong>大小:</strong> 2.4 MB</p>
                    </div>
                </div>
            </div>
        `);
    }
}