/**
 * 电话应用
 */
class PhoneApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.currentTab = 'favorites';
        this.contacts = this.generateSampleContacts();
        this.favorites = this.contacts.slice(0, 3);
        this.recents = this.generateRecentCalls();
    }

    generateSampleContacts() {
        return [
            { name: '小明', phone: '138-0000-0001', avatar: '👨‍💼' },
            { name: '小红', phone: '138-0000-0002', avatar: '👩‍💻' },
            { name: '张老师', phone: '138-0000-0003', avatar: '👨‍🎓' },
            { name: '妈妈', phone: '138-0000-0004', avatar: '👩‍👧' },
            { name: '爸爸', phone: '138-0000-0005', avatar: '👨‍👧' }
        ];
    }

    generateRecentCalls() {
        return [
            { name: '小明', phone: '138-0000-0001', time: '刚刚', type: 'outgoing' },
            { name: '妈妈', phone: '138-0000-0004', time: '10分钟前', type: 'incoming' },
            { name: '张老师', phone: '138-0000-0003', time: '1小时前', type: 'missed' }
        ];
    }

    render() {
        return `
            <div class="phone-app">
                <div class="phone-tabs">
                    <div class="phone-tab ${this.currentTab === 'favorites' ? 'active' : ''}" data-tab="favorites">个人收藏</div>
                    <div class="phone-tab ${this.currentTab === 'recents' ? 'active' : ''}" data-tab="recents">最近通话</div>
                    <div class="phone-tab ${this.currentTab === 'contacts' ? 'active' : ''}" data-tab="contacts">通讯录</div>
                    <div class="phone-tab ${this.currentTab === 'keypad' ? 'active' : ''}" data-tab="keypad">拨号键盘</div>
                </div>
                <div class="phone-content">
                    ${this.renderTabContent()}
                </div>
            </div>
        `;
    }

    renderTabContent() {
        switch (this.currentTab) {
            case 'favorites':
                return this.renderFavorites();
            case 'recents':
                return this.renderRecents();
            case 'contacts':
                return this.renderContacts();
            case 'keypad':
                return this.renderKeypad();
            default:
                return this.renderFavorites();
        }
    }

    renderFavorites() {
        return `
            <div class="favorites-list">
                ${this.favorites.map(contact => `
                    <div class="contact-item">
                        <div class="contact-avatar">${contact.avatar}</div>
                        <div class="contact-info">
                            <div class="contact-name">${contact.name}</div>
                            <div class="contact-phone">${contact.phone}</div>
                        </div>
                        <button class="call-btn" data-phone="${contact.phone}">📞</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderRecents() {
        return `
            <div class="recents-list">
                ${this.recents.map(call => `
                    <div class="call-item">
                        <div class="call-type ${call.type}">
                            ${call.type === 'outgoing' ? '↗️' : call.type === 'incoming' ? '↙️' : '❌'}
                        </div>
                        <div class="call-info">
                            <div class="call-name">${call.name}</div>
                            <div class="call-time">${call.time}</div>
                        </div>
                        <button class="call-btn" data-phone="${call.phone}">📞</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderContacts() {
        return `
            <div class="contacts-list">
                ${this.contacts.map(contact => `
                    <div class="contact-item">
                        <div class="contact-avatar">${contact.avatar}</div>
                        <div class="contact-info">
                            <div class="contact-name">${contact.name}</div>
                            <div class="contact-phone">${contact.phone}</div>
                        </div>
                        <button class="call-btn" data-phone="${contact.phone}">📞</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderKeypad() {
        return `
            <div class="keypad-section">
                <div class="number-display" id="number-display"></div>
                <div class="keypad">
                    <button class="keypad-btn" data-number="1">1</button>
                    <button class="keypad-btn" data-number="2">2</button>
                    <button class="keypad-btn" data-number="3">3</button>
                    <button class="keypad-btn" data-number="4">4</button>
                    <button class="keypad-btn" data-number="5">5</button>
                    <button class="keypad-btn" data-number="6">6</button>
                    <button class="keypad-btn" data-number="7">7</button>
                    <button class="keypad-btn" data-number="8">8</button>
                    <button class="keypad-btn" data-number="9">9</button>
                    <button class="keypad-btn" data-number="*">*</button>
                    <button class="keypad-btn" data-number="0">0</button>
                    <button class="keypad-btn" data-number="#">#</button>
                </div>
                <div class="call-actions">
                    <button class="call-action-btn make-call-btn">📞 拨打</button>
                    <button class="call-action-btn clear-number-btn">清除</button>
                </div>
            </div>
        `;
    }

    async init() {
        await super.init();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 标签切换事件
        const tabs = this.getContentContainer().querySelectorAll('.phone-tab');
        tabs.forEach((tab, index) => {
            this.addEventListener(tab, 'click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // 拨号按钮事件
        const callBtns = this.getContentContainer().querySelectorAll('.call-btn');
        callBtns.forEach((btn, index) => {
            this.addEventListener(btn, 'click', () => {
                const phone = btn.getAttribute('data-phone');
                this.makeCall(phone);
            });
        });

        // 键盘按钮事件
        const keypadBtns = this.getContentContainer().querySelectorAll('.keypad-btn');
        keypadBtns.forEach((btn, index) => {
            this.addEventListener(btn, 'click', () => {
                const number = btn.getAttribute('data-number');
                this.inputNumber(number);
            });
        });

        // 拨打和清除按钮
        const makeCallBtn = this.getContentContainer().querySelector('.make-call-btn');
        if (makeCallBtn) {
            this.addEventListener(makeCallBtn, 'click', () => this.makeCall());
        }

        const clearBtn = this.getContentContainer().querySelector('.clear-number-btn');
        if (clearBtn) {
            this.addEventListener(clearBtn, 'click', () => this.clearNumber());
        }
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        const container = this.getContentContainer();
        if (container) {
            container.innerHTML = this.render();
            this.setupEventListeners();
        }
    }

    inputNumber(number) {
        const display = document.getElementById('number-display');
        if (display) {
            display.textContent += number;
        }
    }

    clearNumber() {
        const display = document.getElementById('number-display');
        if (display) {
            display.textContent = '';
        }
    }

    makeCall(number) {
        const phoneNumber = number || document.getElementById('number-display')?.textContent;
        if (phoneNumber) {
            alert(`正在拨打: ${phoneNumber}`);
        }
    }
}