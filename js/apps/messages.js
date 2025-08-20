/**
 * 信息应用
 */
class MessagesApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.messages = this.generateSampleMessages();
    }

    generateSampleMessages() {
        return [
            {
                id: 1,
                name: '小明',
                avatar: '👨‍💼',
                lastMessage: '下午一起吃饭吗？',
                time: '10:30',
                unread: 2
            },
            {
                id: 2,
                name: '小红',
                avatar: '👩‍💻',
                lastMessage: '项目文档已经发给你了',
                time: '09:15',
                unread: 0
            },
            {
                id: 3,
                name: '张老师',
                avatar: '👨‍🎓',
                lastMessage: '明天记得交作业',
                time: '昨天',
                unread: 1
            },
            {
                id: 4,
                name: '家庭群',
                avatar: '👨‍👩‍👧‍👦',
                lastMessage: '周末回家吃饭',
                time: '昨天',
                unread: 0
            }
        ];
    }

    render() {
        return `
            <div class="messages-app">
                <div class="message-list">
                    ${this.renderMessageList()}
                </div>
            </div>
        `;
    }

    renderMessageList() {
        return this.messages.map(message => `
            <div class="message-item" data-message-id="${message.id}">
                <div class="message-avatar">${message.avatar}</div>
                <div class="message-content">
                    <div class="message-name">${message.name}</div>
                    <div class="message-text">${message.lastMessage}</div>
                </div>
                <div class="message-meta">
                    <div class="message-time">${message.time}</div>
                    ${message.unread > 0 ? `<div class="unread-badge">${message.unread}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    async init() {
        await super.init();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const messageItems = this.getContentContainer().querySelectorAll('.message-item');
        messageItems.forEach(item => {
            item.addEventListener('click', () => {
                const messageId = parseInt(item.getAttribute('data-message-id'));
                this.openConversation(messageId);
            });
        });
    }

    openConversation(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (!message) return;

        this.updateContent(`
            <div class="conversation">
                <div class="conversation-header">
                    <button class="back-btn" onclick="simulator.modules.appManager.openApp('messages')">← 返回</button>
                    <div class="contact-info">
                        <span class="contact-avatar">${message.avatar}</span>
                        <span class="contact-name">${message.name}</span>
                    </div>
                </div>
                <div class="conversation-messages">
                    <div class="message received">
                        <div class="message-bubble">${message.lastMessage}</div>
                        <div class="message-time">${message.time}</div>
                    </div>
                    <div class="message sent">
                        <div class="message-bubble">好的，收到了！</div>
                        <div class="message-time">刚刚</div>
                    </div>
                </div>
                <div class="message-input">
                    <input type="text" placeholder="输入信息..." id="message-input">
                    <button class="send-btn" onclick="this.sendMessage()">发送</button>
                </div>
            </div>
        `);
    }

    sendMessage() {
        const input = document.getElementById('message-input');
        if (input && input.value.trim()) {
            console.log('发送消息:', input.value);
            input.value = '';
        }
    }
}