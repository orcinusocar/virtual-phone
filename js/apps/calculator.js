/**
 * 计算器应用
 */
class CalculatorApp extends BaseApp {
    constructor(simulator) {
        super(simulator);
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = false;
        this.history = [];
        this.lastExpression = '';
    }

    render() {
        return `
            <div class="calculator-app">
                <div class="calculator-display" id="calc-display">
                    <div class="calc-expression" id="calc-expression"></div>
                    <div class="calc-result" id="calc-result">${this.display}</div>
                </div>
                <div class="calculator-buttons">
                    <button class="calc-btn calc-clear" data-action="clear">C</button>
                    <button class="calc-btn calc-operator" data-action="toggle-sign">±</button>
                    <button class="calc-btn calc-operator" data-action="percent">%</button>
                    <button class="calc-btn calc-operator" data-operation="divide">÷</button>
                    
                    <button class="calc-btn calc-number" data-number="7">7</button>
                    <button class="calc-btn calc-number" data-number="8">8</button>
                    <button class="calc-btn calc-number" data-number="9">9</button>
                    <button class="calc-btn calc-operator" data-operation="multiply">×</button>
                    
                    <button class="calc-btn calc-number" data-number="4">4</button>
                    <button class="calc-btn calc-number" data-number="5">5</button>
                    <button class="calc-btn calc-number" data-number="6">6</button>
                    <button class="calc-btn calc-operator" data-operation="subtract">-</button>
                    
                    <button class="calc-btn calc-number" data-number="1">1</button>
                    <button class="calc-btn calc-number" data-number="2">2</button>
                    <button class="calc-btn calc-number" data-number="3">3</button>
                    <button class="calc-btn calc-operator" data-operation="add">+</button>
                    
                    <button class="calc-btn calc-number calc-zero" data-number="0">0</button>
                    <button class="calc-btn calc-number" data-action="decimal">.</button>
                    <button class="calc-btn calc-equals" data-action="equals">=</button>
                </div>
            </div>
        `;
    }

    async init() {
        await super.init();
        this.setupEventListeners();
        this.setupKeyboardSupport();
    }

    setupEventListeners() {
        const buttons = this.getContentContainer().querySelectorAll('.calc-btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
        });
    }

    setupKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            if (!this.isInitialized) return;
            
            this.handleKeyboardInput(e);
        });
    }

    handleKeyboardInput(e) {
        const key = e.key;
        
        // 数字键
        if (/[0-9]/.test(key)) {
            this.inputNumber(key);
        }
        // 运算符
        else if (key === '+') {
            this.inputOperation('add');
        } else if (key === '-') {
            this.inputOperation('subtract');
        } else if (key === '*') {
            this.inputOperation('multiply');
        } else if (key === '/') {
            e.preventDefault();
            this.inputOperation('divide');
        }
        // 其他操作
        else if (key === 'Enter' || key === '=') {
            this.calculate();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.clear();
        } else if (key === '.') {
            this.inputDecimal();
        } else if (key === '%') {
            this.inputPercent();
        } else if (key === 'Backspace') {
            this.backspace();
        }
    }

    handleButtonClick(button) {
        const number = button.getAttribute('data-number');
        const operation = button.getAttribute('data-operation');
        const action = button.getAttribute('data-action');

        // 改进按钮按下效果
        button.classList.add('pressed');
        
        // 添加触觉反馈（如果支持）
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // 延迟移除按下状态，提供更好的视觉反馈
        setTimeout(() => button.classList.remove('pressed'), 150);

        if (number) {
            this.inputNumber(number);
        } else if (operation) {
            this.inputOperation(operation);
        } else if (action) {
            this.handleAction(action);
        }
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'toggle-sign':
                this.toggleSign();
                break;
            case 'percent':
                this.inputPercent();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'equals':
                this.calculate();
                break;
        }
    }

    inputNumber(number) {
        if (this.waitingForNewValue) {
            this.display = number;
            this.waitingForNewValue = false;
        } else {
            if (this.display === '0') {
                this.display = number;
            } else {
                // 限制显示位数
                if (this.display.length < 10) {
                    this.display += number;
                }
            }
        }
        this.updateDisplay();
    }

    inputOperation(operation) {
        const inputValue = parseFloat(this.display);
        if (this.previousValue === null) {
            this.previousValue = inputValue;
            // 开始新运算时清空上一条等式
            this.lastExpression = '';
        } else if (this.operation) {
            const currentValue = this.previousValue || 0;
            const newValue = this.performCalculation(this.operation, currentValue, inputValue);
            this.display = String(newValue);
            this.previousValue = newValue;
            this.updateDisplay();
        }
        this.waitingForNewValue = true;
        this.operation = operation;
    }

    calculate() {
        const inputValue = parseFloat(this.display);
        if (this.previousValue !== null && this.operation) {
            const newValue = this.performCalculation(this.operation, this.previousValue, inputValue);
            // 添加到历史记录
            this.addToHistory(`${this.previousValue} ${this.getOperationSymbol(this.operation)} ${inputValue} = ${newValue}`);
            // 保存上一条等式用于显示
            this.lastExpression = `${this.previousValue} ${this.getOperationSymbol(this.operation)} ${inputValue} =`;
            this.display = String(newValue);
            this.previousValue = null;
            this.operation = null;
            this.waitingForNewValue = true;
            this.updateDisplay();
        }
    }

    performCalculation(operation, firstValue, secondValue) {
        let result;
        
        switch (operation) {
            case 'add':
                result = firstValue + secondValue;
                break;
            case 'subtract':
                result = firstValue - secondValue;
                break;
            case 'multiply':
                result = firstValue * secondValue;
                break;
            case 'divide':
                if (secondValue === 0) {
                    this.showError('除数不能为零');
                    return 0;
                }
                result = firstValue / secondValue;
                break;
            default:
                return secondValue;
        }

        // 处理浮点数精度问题
        if (result !== Math.floor(result)) {
            result = parseFloat(result.toFixed(8));
        }

        // 检查结果是否超出显示范围
        if (Math.abs(result) > 999999999) {
            this.showError('数字过大');
            return 0;
        }

        return result;
    }

    getOperationSymbol(operation) {
        const symbols = {
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷'
        };
        return symbols[operation] || '';
    }

    clear() {
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = false;
        this.lastExpression = '';
        this.updateDisplay();
    }

    toggleSign() {
        if (this.display !== '0') {
            if (this.display.charAt(0) === '-') {
                this.display = this.display.slice(1);
            } else {
                this.display = '-' + this.display;
            }
            this.updateDisplay();
        }
    }

    inputPercent() {
        const value = parseFloat(this.display);
        this.display = String(value / 100);
        this.updateDisplay();
    }

    inputDecimal() {
        if (this.waitingForNewValue) {
            this.display = '0.';
            this.waitingForNewValue = false;
        } else if (this.display.indexOf('.') === -1) {
            this.display += '.';
        }
        this.updateDisplay();
    }

    backspace() {
        if (this.display.length > 1) {
            this.display = this.display.slice(0, -1);
        } else {
            this.display = '0';
        }
        this.updateDisplay();
    }

    updateDisplay() {
        const resultElement = document.getElementById('calc-result');
        const expressionElement = document.getElementById('calc-expression');
        if (resultElement) {
            // 格式化显示数字
            let displayValue = this.display;
            if (!isNaN(displayValue) && displayValue !== '') {
                const num = parseFloat(displayValue);
                if (Math.abs(num) >= 1000) {
                    if (Math.abs(num) >= 1000000) {
                        displayValue = num.toExponential(2);
                    } else {
                        displayValue = num.toLocaleString('zh-CN', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 8
                        });
                    }
                } else if (displayValue.includes('.')) {
                    const parts = displayValue.split('.');
                    if (parts[1].length > 8) {
                        displayValue = parseFloat(displayValue).toFixed(8);
                    }
                }
            }
            resultElement.style.opacity = '0.7';
            resultElement.textContent = displayValue;
            setTimeout(() => {
                resultElement.style.opacity = '1';
            }, 50);
            this.adjustFontSize(resultElement);
        }
        if (expressionElement) {
            expressionElement.textContent = this.computeExpressionText();
        }
    }

    computeExpressionText() {
        // 有正在进行的运算时显示：prev [op] [current]
        if (this.operation && this.previousValue !== null) {
            const op = this.getOperationSymbol(this.operation);
            if (this.waitingForNewValue) {
                return `${this.previousValue} ${op}`;
            }
            return `${this.previousValue} ${op} ${this.display}`;
        }
        // 没有运算但有上次等式，显示上次等式
        if (this.lastExpression) return this.lastExpression;
        return '';
    }

    adjustFontSize(element) {
        const maxLength = 12;
        const minFontSize = 20;
        const maxFontSize = 56;
        
        const textLength = element.textContent.length;
        let fontSize = maxFontSize;
        
        // 更智能的字体大小调整
        if (textLength > maxLength) {
            // 使用指数衰减来调整字体大小
            const scaleFactor = Math.pow(0.9, textLength - maxLength);
            fontSize = Math.max(minFontSize, maxFontSize * scaleFactor);
        }
        
        // 添加平滑过渡
        element.style.transition = 'font-size 0.2s ease';
        element.style.fontSize = fontSize + 'px';
        
        // 移除过渡以避免影响其他样式变化
        setTimeout(() => {
            element.style.transition = '';
        }, 200);
    }

    addToHistory(calculation) {
        this.history.push({
            calculation,
            timestamp: new Date().toISOString()
        });
        
        // 限制历史记录数量
        if (this.history.length > 50) {
            this.history.shift();
        }
    }

    showError(message) {
        const resultElement = document.getElementById('calc-result');
        if (resultElement) {
            resultElement.textContent = message;
            resultElement.style.color = '#ff3b30';
            setTimeout(() => {
                this.clear();
                resultElement.style.color = '';
            }, 2000);
        }
    }

    // 获取历史记录（为后续功能扩展预留）
    getHistory() {
        return this.history;
    }

    // 清空历史记录
    clearHistory() {
        this.history = [];
    }

    async destroy() {
        // 移除键盘事件监听
        document.removeEventListener('keydown', this.handleKeyboardInput);
        await super.destroy();
    }
}