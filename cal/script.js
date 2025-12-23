class Fireworks {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createExplosion(x, y) {
        const colors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#ee82ee', '#ffffff'];
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 1.0,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 4 + 1
            });
        }
        
        if (!this.animationId) {
            this.animate();
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // gravity
            p.life -= 0.01;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.animationId = null;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

class Calculator {
    constructor() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
        this.secretActive = false;
        
        const canvas = document.getElementById('fireworks');
        this.fireworks = new Fireworks(canvas);
        
        this.initializeButtons();
    }
    
    initializeButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('number')) {
                    this.inputNumber(button.dataset.number);
                } else if (button.dataset.action === 'decimal') {
                    this.inputDecimal();
                } else if (button.dataset.action === 'clear') {
                    this.clear();
                } else if (button.dataset.action === 'negate') {
                    this.negate();
                } else if (button.dataset.action === 'percent') {
                    this.percent();
                } else if (button.classList.contains('operator')) {
                    this.handleOperator(button.dataset.action);
                }
                
                this.updateDisplay();
            });
        });
    }
    
    inputNumber(num) {
        if (this.secretActive) {
            this.clear();
            this.secretActive = false;
        }
        
        if (this.waitingForSecondOperand) {
            this.displayValue = num;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? num : this.displayValue + num;
        }
    }
    
    inputDecimal() {
        if (this.secretActive) {
            this.clear();
            this.secretActive = false;
        }
        
        if (this.waitingForSecondOperand) {
            this.displayValue = '0.';
            this.waitingForSecondOperand = false;
            return;
        }
        
        if (!this.displayValue.includes('.')) {
            this.displayValue += '.';
        }
    }
    
    clear() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
        this.secretActive = false;
        this.removeActiveOperator();
    }
    
    negate() {
        this.displayValue = String(parseFloat(this.displayValue) * -1);
    }
    
    percent() {
        this.displayValue = String(parseFloat(this.displayValue) / 100);
    }
    
    handleOperator(nextOperator) {
        const inputValue = parseFloat(this.displayValue);
        
        // Cek kode rahasia: 11 x 11 =
        if (nextOperator === 'equals' && 
            this.firstOperand === 11 && 
            this.operator === 'multiply' && 
            inputValue === 11) {
            
            this.displayValue = 'nana';
            this.firstOperand = null;
            this.operator = null;
            this.waitingForSecondOperand = false;
            this.secretActive = true;
            this.removeActiveOperator();
            
            // Ledakan meriah!
            const rect = document.querySelector('.calculator').getBoundingClientRect();
            const canvasRect = document.getElementById('fireworks').getBoundingClientRect();
            for(let i=0; i<5; i++) {
                setTimeout(() => {
                    this.fireworks.createExplosion(
                        Math.random() * canvasRect.width, 
                        Math.random() * canvasRect.height * 0.5
                    );
                }, i * 300);
            }
            return;
        }

        if (this.firstOperand === null && !isNaN(inputValue)) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            const result = this.calculate(this.firstOperand, inputValue, this.operator);
            this.displayValue = String(result);
            this.firstOperand = result;
        }
        
        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
        
        this.updateActiveOperator(nextOperator);
    }
    
    calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case 'add':
                return firstOperand + secondOperand;
            case 'subtract':
                return firstOperand - secondOperand;
            case 'multiply':
                return firstOperand * secondOperand;
            case 'divide':
                return firstOperand / secondOperand;
            case 'equals':
                return secondOperand;
            default:
                return secondOperand;
        }
    }
    
    updateDisplay() {
        const display = document.querySelector('.display-text');
        
        if (this.displayValue === 'nana') {
            display.textContent = 'nana';
            display.style.color = '#ff9f0a';
            display.style.fontWeight = 'bold';
            display.style.textShadow = '0 0 10px #ff9f0a';
            return;
        } else {
            display.style.color = '#fff';
            display.style.fontWeight = '300';
            display.style.textShadow = 'none';
        }
        
        let displayText = this.displayValue;
        
        if (displayText.includes('.') && displayText.split('.')[1].length > 6) {
            displayText = parseFloat(displayText).toFixed(6);
        }
        
        if (displayText.length > 9) {
            displayText = parseFloat(displayText).toExponential(2);
        }
        
        display.textContent = displayText;
    }
    
    updateActiveOperator(operation) {
        this.removeActiveOperator();
        
        const operatorBtn = document.querySelector(`[data-action="${operation}"]`);
        if (operatorBtn && operation !== 'equals') {
            operatorBtn.classList.add('active');
        }
    }
    
    removeActiveOperator() {
        const activeBtn = document.querySelector('.operator.active');
        if (activeBtn) {
            activeBtn.classList.remove('active');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
