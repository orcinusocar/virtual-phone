# iOS 手机模拟器

一个使用现代Web技术实现的iOS风格手机界面模拟器，具有可爱清新的毛玻璃设计风格和模块化架构。

![iOS Simulator](https://img.shields.io/badge/iOS-Simulator-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🌟 功能特点

### 🔒 锁屏界面
- ⏰ 实时时间和日期显示
- 📢 动态通知卡片弹出
- 👆 滑动解锁功能（支持鼠标和触摸）
- 🎨 渐变动画壁纸
- 🎯 双击快速解锁

### 🏠 主屏幕
- 📱 iOS风格应用图标网格
- ✨ 毛玻璃效果Dock栏
- 📊 完整的状态栏显示
- 🔄 流畅的应用切换动画
- 🎮 应用图标交互效果

### 📱 内置应用

#### 系统应用
- **⚙️ 设置** - 完整的系统设置界面，包含开关控件和详细设置页面
- **📝 备忘录** - 功能完整的笔记应用，支持创建、编辑、保存和删除
- **🖼️ 照片** - 精美的照片网格显示
- **🔢 计算器** - 完整的计算器功能，支持键盘输入

#### 工具应用
- **☀️ 天气** - 天气信息显示和预报
- **⏰ 时钟** - 世界时钟显示
- **💬 信息** - 消息列表界面
- **📷 相机** - 相机取景器界面

#### Dock应用
- **📞 电话** - 电话应用
- **🌐 Safari** - 浏览器应用
- **🎵 音乐** - 音乐播放器
- **✉️ 邮件** - 邮件应用

## 🏗️ 项目结构

```
ios-phone-simulator/
├── 📁 css/                    # 样式文件
│   ├── core.css               # 核心样式和CSS变量
│   ├── 📁 layouts/            # 布局样式
│   │   └── phone.css          # 手机外观和屏幕布局
│   └── 📁 components/         # 组件样式
│       ├── lockscreen.css     # 锁屏组件
│       ├── homescreen.css     # 主屏幕组件
│       └── apps.css           # 应用界面样式
├── 📁 js/                     # JavaScript文件
│   ├── 📁 core/               # 核心模块
│   │   ├── app.js             # 主应用类
│   │   └── app-manager.js     # 应用管理器
│   ├── 📁 components/         # 界面组件
│   │   ├── lockscreen.js      # 锁屏模块
│   │   └── homescreen.js      # 主屏幕模块
│   ├── 📁 apps/               # 应用模块
│   │   ├── base-app.js        # 应用基类
│   │   ├── settings.js        # 设置应用
│   │   ├── notes.js           # 备忘录应用
│   │   └── calculator.js      # 计算器应用
│   └── 📁 utils/              # 工具模块
│       ├── time-manager.js    # 时间管理
│       └── notification.js    # 通知管理
├── 📁 build/                  # 构建文件
│   ├── index.html             # 开发版HTML
│   └── build.js               # 构建脚本
├── 📁 assets/                 # 资源文件
├── package.json               # 项目配置
└── README.md                  # 项目文档
```

## 🚀 快速开始

### 环境要求
- 现代浏览器（Chrome 88+, Firefox 87+, Safari 14+, Edge 88+）
- Node.js 14+ （用于开发和构建）

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
# 启动开发服务器
npm run serve

# 或使用Python（如果已安装）
npm run dev
```

### 构建项目
```bash
# 构建优化后的文件
npm run build
```

### 部署到GitHub Pages
```bash
# 部署到GitHub Pages
npm run deploy
```

## 💻 操作说明

### 基本操作
- **解锁手机**: 在锁屏界面拖动底部滑块或双击解锁条
- **打开应用**: 点击主屏幕上的应用图标
- **关闭应用**: 点击应用右上角的 × 按钮
- **返回锁屏**: 使用快捷键 Cmd/Ctrl + L

### 快捷键
- `Cmd/Ctrl + H`: 从锁屏解锁
- `Cmd/Ctrl + L`: 从主屏幕锁定
- `Esc`: 关闭当前应用
- `Cmd/Ctrl + S`: 在备忘录中保存（编辑模式下）

### 应用操作

#### 📝 备忘录
1. 点击"+ 新建备忘录"按钮
2. 输入标题和内容
3. 点击"保存"按钮或使用 Cmd/Ctrl + S
4. 点击已有备忘录可以编辑
5. 支持删除功能

#### 🔢 计算器
- 支持基本的四则运算
- 支持键盘输入（数字、运算符、回车等）
- 点击数字和运算符按钮
- 支持百分比、正负号切换等功能

#### ⚙️ 设置
- 查看和修改系统设置
- 支持开关控件交互
- 包含多级设置页面
- 支持系统信息查看

## 🎨 设计特色

### 视觉设计
- 🌈 **毛玻璃效果**: 使用CSS backdrop-filter实现真实的毛玻璃质感
- 🎭 **渐变壁纸**: 动态色彩变化，营造生动氛围
- ✨ **流畅动画**: CSS transition和animation，60fps流畅体验
- 📱 **响应式设计**: 适配不同屏幕尺寸和设备
- 🎯 **真实体验**: 高度还原iOS界面和交互逻辑

### 技术架构
- 🏗️ **模块化设计**: 组件化架构，易于扩展和维护
- 🎪 **事件驱动**: 完整的事件系统和生命周期管理
- 🔄 **状态管理**: 统一的应用状态管理
- 🛠️ **工具链**: 现代化的构建和部署流程

## 🔧 技术实现

### 核心技术
- **HTML5**: 语义化结构，现代Web标准
- **CSS3**: 毛玻璃效果、动画、Grid/Flexbox布局
- **JavaScript ES6+**: 类模块化设计、异步处理
- **CSS Variables**: 主题化设计系统
- **Web APIs**: 触摸事件、时间管理等

### 架构特点
- **无依赖**: 纯原生Web技术实现
- **可扩展**: 基于插件的应用系统
- **可维护**: 清晰的代码结构和文档
- **高性能**: 优化的动画和渲染

## 🌐 浏览器兼容性

| 浏览器 | 版本要求 | 说明 |
|--------|----------|------|
| Chrome | 88+ | 完全支持 |
| Firefox | 87+ | 完全支持 |
| Safari | 14+ | 完全支持 |
| Edge | 88+ | 完全支持 |

⚠️ 需要支持 `backdrop-filter` CSS属性的现代浏览器

## 🔮 扩展功能

### 可添加的功能
- 📁 **文件夹系统**: 应用分组管理
- 🔍 **搜索功能**: 全局应用和内容搜索
- 🌙 **深色模式**: 主题切换系统
- 📱 **更多应用**: 扩展应用生态
- 💾 **数据持久化**: 本地存储和同步
- 🎵 **音效系统**: 交互音效反馈

### 自定义开发
```javascript
// 扩展新应用
class MyCustomApp extends BaseApp {
    render() {
        return `<div class="my-app">自定义应用内容</div>`;
    }
    
    async init() {
        await super.init();
        // 应用初始化逻辑
    }
}

// 注册应用
simulator.modules.appManager.apps.set('myapp', {
    name: '我的应用',
    component: MyCustomApp,
    icon: '🎨'
});
```

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 🙏 致谢

感谢所有为这个项目贡献代码和想法的开发者！

---

⭐ 如果这个项目对你有帮助，请给它一个星标！

🌐 [在线体验](https://your-username.github.io/ios-phone-simulator/) | 📖 [详细文档](https://github.com/your-username/ios-phone-simulator/wiki) | 🐛 [报告问题](https://github.com/your-username/ios-phone-simulator/issues)