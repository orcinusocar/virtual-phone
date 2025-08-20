/**
 * 音乐应用
 */
class MusicApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.currentSong = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.playlist = this.generateSamplePlaylist();
        this.currentTab = 'library';
    }

    generateSamplePlaylist() {
        return [
            { id: 1, title: '晴天', artist: '周杰伦', album: '叶惠美', duration: '4:29', cover: '🎵' },
            { id: 2, title: '稻香', artist: '周杰伦', album: '魔杰座', duration: '3:45', cover: '🌾' },
            { id: 3, title: '青花瓷', artist: '周杰伦', album: '我很忙', duration: '3:58', cover: '🏺' },
            { id: 4, title: '七里香', artist: '周杰伦', album: '七里香', duration: '4:05', cover: '🌸' },
            { id: 5, title: '夜曲', artist: '周杰伦', album: '十一月的萧邦', duration: '3:37', cover: '🌙' }
        ];
    }

    render() {
        return `
            <div class="music-app">
                ${this.currentSong ? this.renderNowPlaying() : this.renderLibrary()}
            </div>
        `;
    }

    renderNowPlaying() {
        return `
            <div class="now-playing">
                <div class="now-playing-header">
                    <button class="back-btn show-library-btn">↓</button>
                    <span class="playing-from">正在播放</span>
                </div>
                
                <div class="album-art">
                    <div class="album-cover">${this.currentSong.cover}</div>
                </div>
                
                <div class="song-info">
                    <h2 class="song-title">${this.currentSong.title}</h2>
                    <p class="song-artist">${this.currentSong.artist}</p>
                </div>
                
                <div class="progress-section">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 35%"></div>
                    </div>
                    <div class="time-info">
                        <span class="current-time">1:32</span>
                        <span class="total-time">${this.currentSong.duration}</span>
                    </div>
                </div>
                
                <div class="player-controls">
                    <button class="control-btn prev-btn">⏮️</button>
                    <button class="play-pause-btn">
                        ${this.isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <button class="control-btn next-btn">⏭️</button>
                </div>
                
                <div class="volume-control">
                    <span>🔊</span>
                    <input type="range" class="volume-slider" min="0" max="100" value="70">
                    <span>🔊</span>
                </div>
            </div>
        `;
    }

    renderLibrary() {
        return `
            <div class="music-library">
                <div class="music-tabs">
                    <div class="music-tab ${this.currentTab === 'library' ? 'active' : ''}" data-tab="library">资料库</div>
                    <div class="music-tab ${this.currentTab === 'radio' ? 'active' : ''}" data-tab="radio">广播</div>
                    <div class="music-tab ${this.currentTab === 'search' ? 'active' : ''}" data-tab="search">搜索</div>
                </div>
                
                <div class="library-content">
                    <div class="library-section">
                        <h3>最近播放</h3>
                        <div class="song-list">
                            ${this.playlist.map(song => `
                                <div class="song-item" data-song-id="${song.id}">
                                    <div class="song-cover">${song.cover}</div>
                                    <div class="song-details">
                                        <div class="song-name">${song.title}</div>
                                        <div class="song-info">${song.artist} • ${song.album}</div>
                                    </div>
                                    <div class="song-duration">${song.duration}</div>
                                    <button class="play-song-btn" data-song-id="${song.id}">▶️</button>
                                </div>
                            `).join('')}
                        </div>
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
        const tabs = this.getContentContainer().querySelectorAll('.music-tab');
        tabs.forEach((tab, index) => {
            this.addEventListener(tab, 'click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // 歌曲播放按钮事件
        const playBtns = this.getContentContainer().querySelectorAll('.play-song-btn');
        playBtns.forEach((btn, index) => {
            this.addEventListener(btn, 'click', () => {
                const songId = parseInt(btn.getAttribute('data-song-id'));
                this.playSong(songId);
            });
        });

        // 播放控制按钮
        const playPauseBtn = this.getContentContainer().querySelector('.play-pause-btn');
        if (playPauseBtn) {
            this.addEventListener(playPauseBtn, 'click', () => this.togglePlay());
        }

        const prevBtn = this.getContentContainer().querySelector('.prev-btn');
        if (prevBtn) {
            this.addEventListener(prevBtn, 'click', () => this.previousSong());
        }

        const nextBtn = this.getContentContainer().querySelector('.next-btn');
        if (nextBtn) {
            this.addEventListener(nextBtn, 'click', () => this.nextSong());
        }

        const showLibraryBtn = this.getContentContainer().querySelector('.show-library-btn');
        if (showLibraryBtn) {
            this.addEventListener(showLibraryBtn, 'click', () => this.showLibrary());
        }
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        this.showLibrary();
    }

    playSong(songId) {
        const song = this.playlist.find(s => s.id === songId);
        if (song) {
            this.currentSong = song;
            this.isPlaying = true;
            this.updateContent(this.render());
            console.log('播放歌曲:', song.title);
        }
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        const playBtn = this.getContentContainer().querySelector('.play-pause-btn');
        if (playBtn) {
            playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
        }
        console.log(this.isPlaying ? '播放' : '暂停');
    }

    previousSong() {
        if (!this.currentSong) return;
        const currentIndex = this.playlist.findIndex(s => s.id === this.currentSong.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.playlist.length - 1;
        this.playSong(this.playlist[prevIndex].id);
    }

    nextSong() {
        if (!this.currentSong) return;
        const currentIndex = this.playlist.findIndex(s => s.id === this.currentSong.id);
        const nextIndex = currentIndex < this.playlist.length - 1 ? currentIndex + 1 : 0;
        this.playSong(this.playlist[nextIndex].id);
    }

    showLibrary() {
        this.updateContent(this.renderLibrary());
        this.setupEventListeners();
    }
}