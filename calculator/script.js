const { useState, useCallback } = React;

const isOperator = (char) => {
    return ['+', '-', '*', '/'].includes(char);
};

const Calculator = () => {
    const [formula, setFormula] = useState('');
    const [display, setDisplay] = useState('0');
    const [evaluated, setEvaluated] = useState(false);
    
    const handleNumber = (num) => {
        if (evaluated) {
            setFormula(num);
            setDisplay(num);
            setEvaluated(false);
        } else {
            if (display === '0' && num !== '0') {
                setFormula(formula.slice(0, -1) + num);
                setDisplay(num);
            } else if (display === '0' && num === '0') {
                return;
            } else {
                setFormula(formula + num);
                setDisplay(display + num);
            }
        }
    };
    
    const handleOperator = (op) => {
        if (evaluated) {
            setFormula(display + op);
            setDisplay(op);
            setEvaluated(false);
        } else {
            // Handle multiple operators
            let newFormula = formula;
            const lastChar = formula.slice(-1);
            
            if (isOperator(lastChar)) {
                // If last operator was '-' and new operator is not '-', replace both
                if (lastChar === '-' && formula.slice(-2, -1) !== '-' && op !== '-') {
                    newFormula = formula.slice(0, -2) + op;
                }
                // If last operator is not '-', handle cases
                else if (lastChar !== '-') {
                    // Allow adding '-' after another operator for negative numbers
                    if (op === '-') {
                        newFormula = formula + op;
                    } else {
                        newFormula = formula.slice(0, -1) + op;
                    }
                } else {
                    newFormula = formula + op;
                }
            } else {
                newFormula = formula + op;
            }
            
            setFormula(newFormula);
            setDisplay(op);
        }
    };
    
    const handleDecimal = () => {
        if (evaluated) {
            setFormula('0.');
            setDisplay('0.');
            setEvaluated(false);
            return;
        }
        
        // Check if current number already has a decimal
        const parts = display.split(/[+\-*/]/);
        const currentNumber = parts[parts.length - 1];
        
        if (currentNumber.includes('.')) {
            return;
        }
        
        if (display === '' || isOperator(display)) {
            setFormula(formula + '0.');
            setDisplay('0.');
        } else {
            setFormula(formula + '.');
            setDisplay(display + '.');
        }
    };
    
    const handleClear = () => {
        setFormula('');
        setDisplay('0');
        setEvaluated(false);
    };
    
    const handleEquals = () => {
        try {
            // Clean up formula for evaluation
            let formulaToEvaluate = formula;
            
            // Handle trailing operators
            while (isOperator(formulaToEvaluate.slice(-1))) {
                if (formulaToEvaluate.slice(-1) === '-') {
                    // If only '-' remains, it's a negative number
                    break;
                }
                formulaToEvaluate = formulaToEvaluate.slice(0, -1);
            }
            
            if (formulaToEvaluate === '') {
                return;
            }
            
            // Evaluate the expression
            // Using Function instead of eval for safety
            const result = Function('"use strict"; return (' + formulaToEvaluate + ')')();
            
            // Handle division by zero
            if (result === Infinity || result === -Infinity) {
                setDisplay('Error');
                setFormula('');
                setEvaluated(true);
                return;
            }
            
            // Format result
            const formattedResult = Number.isInteger(result) 
                ? result.toString() 
                : parseFloat(result.toFixed(10)).toString();
            
            setFormula(formulaToEvaluate + '=' + formattedResult);
            setDisplay(formattedResult);
            setEvaluated(true);
            
        } catch (error) {
            setDisplay('Error');
            setFormula('');
            setEvaluated(true);
        }
    };
    
    const handleKeyDown = useCallback((event) => {
        const key = event.key;
        
        if (key >= '0' && key <= '9') {
            handleNumber(key);
        } else if (key === '.') {
            handleDecimal();
        } else if (key === '+') {
            handleOperator('+');
        } else if (key === '-') {
            handleOperator('-');
        } else if (key === '*') {
            handleOperator('*');
        } else if (key === '/') {
            handleOperator('/');
        } else if (key === 'Enter' || key === '=') {
            handleEquals();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            handleClear();
        } else if (key === 'Backspace') {
            // Handle backspace
            if (evaluated) {
                handleClear();
            } else {
                const newFormula = formula.slice(0, -1);
                const newDisplay = display.slice(0, -1) || '0';
                setFormula(newFormula);
                setDisplay(newDisplay);
            }
        }
    }, [formula, display, evaluated]);
    
    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
    
    return (
        <div className="calculator">
            <div className="display-container">
                <div id="formula">{formula}</div>
                <div id="display">{display}</div>
            </div>
            
            <div className="buttons-grid">
                <button id="clear" onClick={handleClear}>
                    AC
                </button>
                <button id="divide" className="operator" onClick={() => handleOperator('/')}>
                    ÷
                </button>
                <button id="multiply" className="operator" onClick={() => handleOperator('*')}>
                    ×
                </button>
                
                <button id="seven" onClick={() => handleNumber('7')}>7</button>
                <button id="eight" onClick={() => handleNumber('8')}>8</button>
                <button id="nine" onClick={() => handleNumber('9')}>9</button>
                <button id="subtract" className="operator" onClick={() => handleOperator('-')}>
                    −
                </button>
                
                <button id="four" onClick={() => handleNumber('4')}>4</button>
                <button id="five" onClick={() => handleNumber('5')}>5</button>
                <button id="six" onClick={() => handleNumber('6')}>6</button>
                <button id="add" className="operator" onClick={() => handleOperator('+')}>
                    +
                </button>
                
                <button id="one" onClick={() => handleNumber('1')}>1</button>
                <button id="two" onClick={() => handleNumber('2')}>2</button>
                <button id="three" onClick={() => handleNumber('3')}>3</button>
                <button id="equals" onClick={handleEquals}>
                    =
                </button>
                
                <button id="zero" onClick={() => handleNumber('0')}>0</button>
                <button id="decimal" onClick={handleDecimal}>.</button>
            </div>
        </div>
    );
};

ReactDOM.render(<Calculator />, document.getElementById('root'));