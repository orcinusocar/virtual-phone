/**
 * 备忘录应用
 */
class NotesApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.notes = [];
        this.currentNoteIndex = -1;
        this.isEditing = false;
        this.initSampleNotes();
    }

    initSampleNotes() {
        this.notes = [
            {
                id: 1,
                title: '购物清单',
                content: '牛奶\n面包\n鸡蛋\n苹果\n香蕉\n酸奶',
                date: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            {
                id: 2,
                title: '会议记录',
                content: '今天的会议讨论了项目进度，需要在下周完成第一阶段的开发工作。\n\n重点：\n1. UI设计优化\n2. 性能提升\n3. 测试覆盖',
                date: new Date(Date.now() - 86400000).toISOString(),
                lastModified: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 3,
                title: '学习计划',
                content: '本月学习目标：\n- JavaScript ES6新特性\n- React Hooks\n- Node.js基础\n- 数据库设计',
                date: new Date(Date.now() - 172800000).toISOString(),
                lastModified: new Date(Date.now() - 172800000).toISOString()
            }
        ];
    }

    render() {
        return `
            <div class="notes-app">
                <div class="notes-header">
                    <button class="new-note-btn" id="new-note-btn">+ 新建备忘录</button>
                </div>
                <div class="notes-list" id="notes-list">
                    ${this.renderNotesList()}
                </div>
                <div class="note-editor" id="note-editor" style="display: none;">
                    <input type="text" id="note-title" placeholder="标题" maxlength="50" />
                    <textarea id="note-content" placeholder="开始输入..." rows="15"></textarea>
                    <div class="note-actions">
                        <button id="save-note-btn" class="save-btn">保存</button>
                        <button id="cancel-note-btn" class="cancel-btn">取消</button>
                        <button id="delete-note-btn" class="delete-btn" style="display: none;">删除</button>
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
        // 新建备忘录按钮
        this.addEventListener('new-note-btn', 'click', () => {
            this.createNewNote();
        });

        // 保存按钮
        this.addEventListener('save-note-btn', 'click', () => {
            this.saveNote();
        });

        // 取消按钮
        this.addEventListener('cancel-note-btn', 'click', () => {
            this.cancelEdit();
        });

        // 删除按钮
        this.addEventListener('delete-note-btn', 'click', () => {
            this.deleteCurrentNote();
        });

        // 备忘录列表项点击事件
        this.setupNoteListEvents();

        // 快捷键支持
        document.addEventListener('keydown', (e) => {
            if (this.isEditing) {
                if (e.ctrlKey || e.metaKey) {
                    if (e.key === 's') {
                        e.preventDefault();
                        this.saveNote();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        this.cancelEdit();
                    }
                }
            }
        });
    }

    setupNoteListEvents() {
        const noteItems = this.getContentContainer().querySelectorAll('.note-item');
        noteItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.editNote(index);
            });
        });
    }

    renderNotesList() {
        if (this.notes.length === 0) {
            return '<div class="empty-notes">还没有备忘录<br><small>点击上方按钮创建第一个备忘录</small></div>';
        }

        return this.notes.map((note, index) => `
            <div class="note-item" data-index="${index}">
                <div class="note-title">${note.title || '无标题'}</div>
                <div class="note-preview">${this.getPreviewText(note.content)}</div>
                <div class="note-date">${this.formatDate(note.lastModified)}</div>
            </div>
        `).join('');
    }

    getPreviewText(content) {
        const maxLength = 50;
        const cleanContent = content.replace(/\n/g, ' ').trim();
        return cleanContent.length > maxLength 
            ? cleanContent.substring(0, maxLength) + '...' 
            : cleanContent;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return '刚刚';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} 小时前`;
        } else if (diffInHours < 48) {
            return '昨天';
        } else {
            return date.toLocaleDateString('zh-CN', {
                month: 'numeric',
                day: 'numeric'
            });
        }
    }

    createNewNote() {
        this.currentNoteIndex = -1;
        this.showEditor();
        
        const titleInput = document.getElementById('note-title');
        const contentTextarea = document.getElementById('note-content');
        const deleteBtn = document.getElementById('delete-note-btn');
        
        if (titleInput && contentTextarea && deleteBtn) {
            titleInput.value = '';
            contentTextarea.value = '';
            deleteBtn.style.display = 'none';
            titleInput.focus();
        }
    }

    editNote(index) {
        if (index < 0 || index >= this.notes.length) return;
        
        this.currentNoteIndex = index;
        const note = this.notes[index];
        
        this.showEditor();
        
        const titleInput = document.getElementById('note-title');
        const contentTextarea = document.getElementById('note-content');
        const deleteBtn = document.getElementById('delete-note-btn');
        
        if (titleInput && contentTextarea && deleteBtn) {
            titleInput.value = note.title;
            contentTextarea.value = note.content;
            deleteBtn.style.display = 'block';
            contentTextarea.focus();
        }
    }

    showEditor() {
        const notesList = document.getElementById('notes-list');
        const noteEditor = document.getElementById('note-editor');
        
        if (notesList && noteEditor) {
            notesList.style.display = 'none';
            noteEditor.style.display = 'flex';
            this.isEditing = true;
        }
    }

    hideEditor() {
        const notesList = document.getElementById('notes-list');
        const noteEditor = document.getElementById('note-editor');
        
        if (notesList && noteEditor) {
            notesList.style.display = 'block';
            noteEditor.style.display = 'none';
            this.isEditing = false;
        }
    }

    saveNote() {
        const titleInput = document.getElementById('note-title');
        const contentTextarea = document.getElementById('note-content');
        
        if (!titleInput || !contentTextarea) return;
        
        const title = titleInput.value.trim();
        const content = contentTextarea.value.trim();
        
        if (!content) {
            alert('请输入备忘录内容');
            contentTextarea.focus();
            return;
        }

        const now = new Date().toISOString();
        const note = {
            id: this.currentNoteIndex === -1 ? Date.now() : this.notes[this.currentNoteIndex].id,
            title: title || '无标题',
            content: content,
            lastModified: now,
            date: this.currentNoteIndex === -1 ? now : this.notes[this.currentNoteIndex].date
        };

        if (this.currentNoteIndex === -1) {
            // 新建备忘录
            this.notes.unshift(note);
        } else {
            // 更新现有备忘录
            this.notes[this.currentNoteIndex] = note;
        }

        this.refreshNotesList();
        this.hideEditor();
        
        // 显示保存成功提示
        this.showToast('保存成功');
    }

    cancelEdit() {
        const titleInput = document.getElementById('note-title');
        const contentTextarea = document.getElementById('note-content');
        
        if (titleInput && contentTextarea) {
            const hasChanges = titleInput.value.trim() || contentTextarea.value.trim();
            
            if (hasChanges) {
                if (confirm('确定要取消编辑吗？未保存的内容将丢失。')) {
                    this.hideEditor();
                }
            } else {
                this.hideEditor();
            }
        }
    }

    deleteCurrentNote() {
        if (this.currentNoteIndex === -1) return;
        
        if (confirm('确定要删除这个备忘录吗？此操作无法撤销。')) {
            this.notes.splice(this.currentNoteIndex, 1);
            this.refreshNotesList();
            this.hideEditor();
            this.showToast('备忘录已删除');
        }
    }

    refreshNotesList() {
        const notesList = document.getElementById('notes-list');
        if (notesList) {
            notesList.innerHTML = this.renderNotesList();
            this.setupNoteListEvents();
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 14px;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 1500);
    }

    // 搜索功能（为后续扩展预留）
    searchNotes(query) {
        return this.notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase())
        );
    }

    // 导出功能（为后续扩展预留）
    exportNotes() {
        const data = JSON.stringify(this.notes, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes-backup.json';
        a.click();
        
        URL.revokeObjectURL(url);
    }

    async destroy() {
        this.isEditing = false;
        await super.destroy();
    }
}