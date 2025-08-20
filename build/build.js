/**
 * 构建脚本 - 合并和优化文件
 */
const fs = require('fs');
const path = require('path');

class Builder {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
        this.buildDir = __dirname;
        this.cssFiles = [
            'css/core.css',
            'css/layouts/phone.css',
            'css/components/lockscreen.css',
            'css/components/homescreen.css',
            'css/components/apps.css'
        ];
        this.jsFiles = [
            'js/apps/base-app.js',
            'js/utils/time-manager.js',
            'js/utils/notification.js',
            'js/core/app-manager.js',
            'js/components/lockscreen.js',
            'js/components/homescreen.js',
            'js/apps/settings.js',
            'js/apps/notes.js',
            'js/apps/calculator.js',
            'js/core/app.js'
        ];
    }

    /**
     * 开始构建
     */
    async build() {
        console.log('🚀 开始构建项目...');
        
        try {
            // 合并CSS文件
            await this.buildCSS();
            
            // 合并JavaScript文件
            await this.buildJS();
            
            // 生成优化后的HTML
            await this.buildHTML();
            
            // 复制资源文件
            await this.copyAssets();
            
            console.log('✅ 构建完成！');
            console.log(`📁 构建文件位于: ${this.buildDir}`);
            
        } catch (error) {
            console.error('❌ 构建失败:', error);
            process.exit(1);
        }
    }

    /**
     * 合并CSS文件
     */
    async buildCSS() {
        console.log('📝 合并CSS文件...');
        
        let combinedCSS = '';
        
        for (const cssFile of this.cssFiles) {
            const filePath = path.join(this.rootDir, cssFile);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                combinedCSS += `\n/* ${cssFile} */\n${content}\n`;
            } else {
                console.warn(`⚠️  CSS文件不存在: ${cssFile}`);
            }
        }
        
        // 简单的CSS优化
        combinedCSS = this.optimizeCSS(combinedCSS);
        
        const outputPath = path.join(this.buildDir, 'styles.min.css');
        fs.writeFileSync(outputPath, combinedCSS);
        
        console.log(`✅ CSS文件已合并: ${outputPath}`);
    }

    /**
     * 合并JavaScript文件
     */
    async buildJS() {
        console.log('🔧 合并JavaScript文件...');
        
        let combinedJS = '';
        
        for (const jsFile of this.jsFiles) {
            const filePath = path.join(this.rootDir, jsFile);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                combinedJS += `\n/* ${jsFile} */\n${content}\n`;
            } else {
                console.warn(`⚠️  JavaScript文件不存在: ${jsFile}`);
            }
        }
        
        // 简单的JS优化
        combinedJS = this.optimizeJS(combinedJS);
        
        const outputPath = path.join(this.buildDir, 'script.min.js');
        fs.writeFileSync(outputPath, combinedJS);
        
        console.log(`✅ JavaScript文件已合并: ${outputPath}`);
    }

    /**
     * 生成优化后的HTML
     */
    async buildHTML() {
        console.log('🌐 生成优化HTML...');
        
        const templatePath = path.join(this.buildDir, 'index.html');
        let html = fs.readFileSync(templatePath, 'utf8');
        
        // 替换CSS引用
        html = html.replace(
            /<link[^>]*href="[^"]*\.css"[^>]*>/g,
            ''
        );
        html = html.replace(
            '</head>',
            '    <link rel="stylesheet" href="styles.min.css">\n</head>'
        );
        
        // 替换JavaScript引用
        html = html.replace(
            /<script[^>]*src="[^"]*\.js"[^>]*><\/script>/g,
            ''
        );
        html = html.replace(
            '</body>',
            '    <script src="script.min.js"></script>\n</body>'
        );
        
        // 优化HTML
        html = this.optimizeHTML(html);
        
        const outputPath = path.join(this.buildDir, 'index.min.html');
        fs.writeFileSync(outputPath, html);
        
        console.log(`✅ HTML文件已优化: ${outputPath}`);
    }

    /**
     * 复制资源文件
     */
    async copyAssets() {
        console.log('📋 复制资源文件...');
        
        const assetsDir = path.join(this.rootDir, 'assets');
        const buildAssetsDir = path.join(this.buildDir, 'assets');
        
        if (fs.existsSync(assetsDir)) {
            this.copyDirectory(assetsDir, buildAssetsDir);
            console.log('✅ 资源文件已复制');
        } else {
            console.log('ℹ️  没有找到assets目录');
        }
    }

    /**
     * 复制目录
     */
    copyDirectory(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        
        const files = fs.readdirSync(src);
        
        for (const file of files) {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);
            
            if (fs.statSync(srcPath).isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    /**
     * 优化CSS
     */
    optimizeCSS(css) {
        return css
            // 移除注释
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // 移除多余的空白
            .replace(/\s+/g, ' ')
            // 移除空行
            .replace(/\n\s*\n/g, '\n')
            .trim();
    }

    /**
     * 优化JavaScript
     */
    optimizeJS(js) {
        return js
            // 移除单行注释（保留URL中的//）
            .replace(/\/\/(?![^\n]*:\/\/).*$/gm, '')
            // 移除多行注释
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // 移除多余的空白
            .replace(/\s+/g, ' ')
            // 移除空行
            .replace(/\n\s*\n/g, '\n')
            .trim();
    }

    /**
     * 优化HTML
     */
    optimizeHTML(html) {
        return html
            // 移除HTML注释
            .replace(/<!--[\s\S]*?-->/g, '')
            // 移除多余的空白
            .replace(/>\s+</g, '><')
            // 移除行首行尾空白
            .replace(/^\s+|\s+$/gm, '')
            // 移除空行
            .replace(/\n\s*\n/g, '\n')
            .trim();
    }
}

// 运行构建
if (require.main === module) {
    const builder = new Builder();
    builder.build();
}

module.exports = Builder;