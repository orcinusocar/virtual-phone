/**
 * 邮件应用
 */
class MailApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.emails = this.generateSampleEmails();
        this.currentEmail = null;
    }

    generateSampleEmails() {
        return [
            {
                id: 1,
                from: 'apple@apple.com',
                subject: '欢迎使用 Apple ID',
                preview: '感谢您创建 Apple ID。您现在可以使用所有 Apple 服务...',
                time: '上午 9:30',
                isRead: false
            },
            {
                id: 2,
                from: 'github@github.com',
                subject: '您的代码仓库有新的提交',
                preview: '您的项目 ios-simulator 有新的更新...',
                time: '昨天',
                isRead: true
            },
            {
                id: 3,
                from: 'hr@company.com',
                subject: '会议提醒',
                preview: '明天下午2点的项目评审会议，请准时参加...',
                time: '2天前',
                isRead: true
            }
        ];
    }

    render() {
        if (this.currentEmail) {
            return this.renderEmailDetail();
        }
        return this.renderEmailList();
    }

    renderEmailList() {
        return `
            <div class="mail-app">
                <div class="mail-header">
                    <h3>收件箱</h3>
                    <button class="compose-btn">✏️</button>
                </div>
                <div class="email-list">
                    ${this.emails.map(email => `
                        <div class="email-item ${email.isRead ? 'read' : 'unread'}" data-email-id="${email.id}">
                            <div class="email-info">
                                <div class="email-from">${email.from}</div>
                                <div class="email-subject">${email.subject}</div>
                                <div class="email-preview">${email.preview}</div>
                            </div>
                            <div class="email-meta">
                                <div class="email-time">${email.time}</div>
                                ${!email.isRead ? '<div class="unread-dot"></div>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderEmailDetail() {
        return `
            <div class="email-detail">
                <div class="email-detail-header">
                    <button class="back-btn back-to-list-btn">← 收件箱</button>
                    <div class="email-actions">
                        <button class="action-btn">🗑️</button>
                        <button class="action-btn">📧</button>
                    </div>
                </div>
                <div class="email-content">
                    <div class="email-header-info">
                        <h2>${this.currentEmail.subject}</h2>
                        <div class="sender-info">
                            <strong>发件人:</strong> ${this.currentEmail.from}
                        </div>
                        <div class="email-time">
                            <strong>时间:</strong> ${this.currentEmail.time}
                        </div>
                    </div>
                    <div class="email-body">
                        <p>${this.currentEmail.preview}</p>
                        <p>这是一封示例邮件的完整内容。在真实的邮件应用中，这里会显示邮件的完整正文内容。</p>
                        <p>感谢您使用我们的服务！</p>
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
        // 邮件列表项点击事件
        const emailItems = this.getContentContainer().querySelectorAll('.email-item');
        emailItems.forEach((item, index) => {
            this.addEventListener(item, 'click', () => {
                const emailId = parseInt(item.getAttribute('data-email-id'));
                this.openEmail(emailId);
            });
        });

        // 撰写邮件按钮
        const composeBtn = this.getContentContainer().querySelector('.compose-btn');
        if (composeBtn) {
            this.addEventListener(composeBtn, 'click', () => this.composeEmail());
        }

        // 返回列表按钮
        const backToListBtn = this.getContentContainer().querySelector('.back-to-list-btn');
        if (backToListBtn) {
            this.addEventListener(backToListBtn, 'click', () => this.backToList());
        }

        // 取消撰写按钮
        const cancelComposeBtn = this.getContentContainer().querySelector('.cancel-compose-btn');
        if (cancelComposeBtn) {
            this.addEventListener(cancelComposeBtn, 'click', () => this.backToList());
        }

        // 发送邮件按钮
        const sendEmailBtn = this.getContentContainer().querySelector('.send-email-btn');
        if (sendEmailBtn) {
            this.addEventListener(sendEmailBtn, 'click', () => this.sendEmail());
        }
    }

    openEmail(emailId) {
        const email = this.emails.find(e => e.id === emailId);
        if (email) {
            this.currentEmail = email;
            email.isRead = true;
            this.updateContent(this.render());
        }
    }

    backToList() {
        this.currentEmail = null;
        this.updateContent(this.render());
        this.setupEventListeners();
    }

    composeEmail() {
        this.updateContent(`
            <div class="compose-email">
                <div class="compose-header">
                    <button class="back-btn cancel-compose-btn">取消</button>
                    <h3>撰写邮件</h3>
                    <button class="send-btn send-email-btn">发送</button>
                </div>
                <div class="compose-form">
                    <input type="email" placeholder="收件人" id="compose-to">
                    <input type="text" placeholder="主题" id="compose-subject">
                    <textarea placeholder="邮件正文" id="compose-body" rows="10"></textarea>
                </div>
            </div>
        `);
    }

    sendEmail() {
        const to = document.getElementById('compose-to')?.value;
        const subject = document.getElementById('compose-subject')?.value;
        const body = document.getElementById('compose-body')?.value;
        
        if (to && subject && body) {
            alert('邮件已发送！');
            this.backToList();
        } else {
            alert('请填写完整的邮件信息');
        }
    }
}