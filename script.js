// access to html elements
const screen = document.querySelector('.screen');
const previous = document.querySelector('.previous');
const buttons = document.querySelectorAll('button');

// all the functions of our calculator
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operators = ['plus', 'minus', 'times', 'divide'];
const functions = ['.', 'back', 'clear', 'equals'];

// object to store our expression data and necessary states
const expression = {
    firstOperand: '',
    operator: '',
    secondOperand: '',
    firstHasDecimal: false,
    firstDone: false,
    secondHasDecimal: false,
    secondDone: false,
    hasOperator: false
};

const previousExpression = {
    firstOperand: '',
    operator: '',
    secondOperand: ''
};

// displays our expression in its current state
function display() {
    const expr = expression.firstOperand + ' ' + expression.operator + ' ' + expression.secondOperand;
    screen.textContent = expr;

    const prev = previousExpression.firstOperand + ' ' + previousExpression.operator + ' ' + previousExpression.secondOperand;
    console.log(prev);
    previous.textContent = prev;
}

// key functionality; listen for any key presses and handle appropriately
const keys = document.querySelector('body');
keys.addEventListener('keydown', (e) => {
    let input = e.key;
    switch(e.key) {
        case('+'):
            input = 'plus';
            break;
        case('-'):
            input = 'minus';
            break;
        case('*'):
            input = 'times';
            break;
        case('/'):
            input = 'divide';
            break;
        case('Enter'):
            input = 'equals';
            break;
        case('='):
            input = 'equals';
            break;
        case('Backspace'):
            input = 'back';
            break;
        case('Delete'):
            input = 'clear';
            break;
    }
    if (numbers.includes(input) || operators.includes(input) || functions.includes(input)) {
        handleClick(input);
    }
});


// button functionality; listen for any clicks and handle appropriately
buttons.forEach(button => button.addEventListener('click', () => handleClick(button.getAttribute('id'))));

function handleClick(input) {
    // calls correct function depending on if the button was a number, operator, or function
    if (numbers.includes(input)) { appendNumber(input); }
    else if (operators.includes(input)) { appendOperator(input); }
    else { executeFunction(input); }

    // refresh screen display after every button press
    display();
}

// adds a number to the appropriate operand
function appendNumber(input) {
    if (!expression.firstDone) {
        expression.firstOperand += input;
    } else {
        expression.secondOperand += input;
    }
}

// handles adding an operator to the expression
function appendOperator(input) {
    // convert to math language
    let operator = '';
    switch(input) {
        case('plus'):
            operator = '+';
            break;
        case('minus'):
            operator = '−';
            break;
        case('times'):
            operator = '×';
            break;
        case('divide'):
            operator = '÷';
            break;
    }
    // if the expression doesn't yet have an operator
    if (!expression.hasOperator) {
        expression.firstDone = true;
        expression.operator = operator;
        expression.hasOperator = true;
    } 
    // executes if there's already an operator and builds beginning of new expression
    else {
        // if second operand doesn't exists yet don't execute function
        if (expression.secondOperand === '') {
            expression.operator = operator; 
            return; 
        }
        executeExpression();
        console.log(expression.firstOperand);
        expression.firstDone = true;
        expression.operator = operator;
        expression.hasOperator = true;
    }
}

// handles all other functionalities such as decimals, backspacing, clearing, and equals
function executeFunction(input) {
    switch (input) {
        case('.'):
            addDecimal(input);
            break;
        case('back'):
        backSpace();
            break;
        case('clear'):
            resetExpression();
            resetPrevious();
            break;
        case('equals'):
            if (expression.secondOperand === '') { return; }
            executeExpression();
            break;
    }
}

// handles adding a decimal appropriately
function addDecimal(input) {
    // if the first operand is not yet completed...
    if (!expression.firstDone) {
        // ...and it does not yet have a decimal, add one
        if (!expression.firstHasDecimal) {
            expression.firstOperand += input;
            expression.firstHasDecimal = true;
        }
    } 
    // if the second operand is not yet completed...
    else {
        // ...and it does not yet have a decimal, add one
        if (!expression.secondHasDecimal) {
            expression.secondOperand += input;
            expression.secondHasDecimal = true;
        }
    }
}

// backspace functionality
function backSpace() {
    // if the first operand is not done and it is not empty, we can backspace
    if (!expression.firstDone && expression.firstOperand !== '') {
        const removedChar = expression.firstOperand.charAt(expression.firstOperand.length - 1);
        expression.firstOperand = expression.firstOperand.slice(0, -1);
        // if we removed a decimal, we need to allow the user to add one again
        if (removedChar === '.') {
            expression.firstHasDecimal = false;
        }
    } 
    // if we are deleting an operator...
    else if (expression.secondOperand === '') {
        expression.operator = '';
        expression.hasOperator = false;
        expression.firstDone = false;
    } 
    // if the first operand is not done and it is not empty, we can backspace
    else {
        const removedChar = expression.secondOperand.charAt(expression.secondOperand.length - 1);
        expression.secondOperand = expression.secondOperand.slice(0, -1);
        // if we removed a decimal, we need to allow the user to add one again
        if (removedChar === '.') {
            expression.secondHasDecimal = false;
        }
    }
}

// executes the expression, calls appropriate function given our expression's operator
function executeExpression() {
    let result = '';
    switch (expression.operator) {
        case('+'):
            result = add(expression.firstOperand, expression.secondOperand);
            break;
        case('−'):
            result = subtract(expression.firstOperand, expression.secondOperand);
            break;
        case('×'):
            result = multiply(expression.firstOperand, expression.secondOperand);
            break;
        case('÷'): 
            result = divide(expression.firstOperand, expression.secondOperand);
            break;
    }
    // update previous before changing current
    previousExpression.firstOperand = expression.firstOperand;
    previousExpression.operator = expression.operator;
    previousExpression.secondOperand = expression.secondOperand;
    resetExpression();
    expression.firstOperand = result.toString();

    // check if calculation results in a decimal
    const array = Array.from(expression.firstOperand);
    expression.firstHasDecimal = array.some(element => element === '.')
}

// our basic operations

function add(x, y) {
    return Number(x) + Number(y);
}

function subtract(x, y) {
    return Number(x) - Number(y);
}

function multiply(x, y) {
    return Math.round((Number(x) * Number(y)) * 100) / 100;
}

function divide(x, y) {
    // can't divide by 0
    if (y === '0') {
        resetExpression();
        alert('You know better than that...');
        return '';
    }
    return Math.round((Number(x) / Number(y)) * 100) / 100;
}

// returns expression to its original, empty state
function resetExpression() {
    expression.firstOperand = '';
    expression.operator = '';
    expression.secondOperand = '';
    expression.firstHasDecimal = false;
    expression.firstDone = false;
    expression.secondHasDecimal = false;
    expression.secondDone = false;
    expression.hasOperator = false;
}

function resetPrevious() {
    previousExpression.firstOperand = '';
    previousExpression.operator = '';
    previousExpression.secondOperand = '';
}