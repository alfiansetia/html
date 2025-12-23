class Calculator {
    constructor() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
        
        this.initializeButtons();
    }
    
    initializeButtons() {
        const display = document.querySelector('.display-text');
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
        if (this.waitingForSecondOperand) {
            this.displayValue = num;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? num : this.displayValue + num;
        }
    }
    
    inputDecimal() {
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
        
        // Format large numbers
        let displayText = this.displayValue;
        
        // Limit decimal places for better display
        if (displayText.includes('.') && displayText.split('.')[1].length > 6) {
            displayText = parseFloat(displayText).toFixed(6);
        }
        
        // Handle very large numbers
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

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
});
