import React, { useState } from 'react';

const clampToPrecision = (value) => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return 'Error';
  return Number(Math.round(num * 1e12) / 1e12);
};

const calculate = (left, op, right) => {
  const a = Number(left);
  const b = Number(right);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 'Error';

  switch (op) {
    case '+': return clampToPrecision(a + b);
    case '-': return clampToPrecision(a - b);
    case '*': return clampToPrecision(a * b);
    case '/': return b === 0 ? 'Error' : clampToPrecision(a / b);
    default: return b;
  }
};

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [operand, setOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForSecond) {
      setDisplay(String(digit));
      setWaitingForSecond(false);
    } else {
      setDisplay((prev) => (prev === '0' ? String(digit) : prev + digit));
    }
  };

  const inputDot = () => {
    if (waitingForSecond) {
      setDisplay('0.');
      setWaitingForSecond(false);
      return;
    }
    setDisplay((prev) => (prev.includes('.') ? prev : prev + '.'));
  };

  const clearAll = () => {
    setDisplay('0');
    setOperand(null);
    setOperator(null);
    setWaitingForSecond(false);
  };

  const setOp = (op) => {
    if (operator && !waitingForSecond) {
      const result = calculate(operand ?? 0, operator, display);
      setDisplay(String(result));
      setOperand(result === 'Error' ? null : result);
      setOperator(result === 'Error' ? null : op);
      setWaitingForSecond(result !== 'Error');
      return;
    }
    setOperand(Number(display));
    setOperator(op);
    setWaitingForSecond(true);
  };

  const equals = () => {
    if (operator == null || operand == null) return;
    const result = calculate(operand, operator, display);
    setDisplay(String(result));
    setOperand(result === 'Error' ? null : result);
    setOperator(null);
    setWaitingForSecond(false);
  };

  const toggleSign = () => {
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : prev === '0' ? '0' : '-' + prev));
  };

  return (
    <div className="calculator max-w-xs mx-auto bg-white rounded-lg shadow p-4">
      <div className="calc-display text-right text-3xl font-mono bg-gray-100 rounded p-3 mb-3" aria-live="polite">
        {display}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button className="btn" onClick={clearAll}>C</button>
        <button className="btn" onClick={toggleSign}>±</button>
        <button className="btn" onClick={() => setOp('/')}>÷</button>
        <button className="btn" onClick={() => setOp('*')}>×</button>

        <button className="btn" onClick={() => inputDigit(7)}>7</button>
        <button className="btn" onClick={() => inputDigit(8)}>8</button>
        <button className="btn" onClick={() => inputDigit(9)}>9</button>
        <button className="btn" onClick={() => setOp('-')}>−</button>

        <button className="btn" onClick={() => inputDigit(4)}>4</button>
        <button className="btn" onClick={() => inputDigit(5)}>5</button>
        <button className="btn" onClick={() => inputDigit(6)}>6</button>
        <button className="btn" onClick={() => setOp('+')}>+</button>

        <button className="btn" onClick={() => inputDigit(1)}>1</button>
        <button className="btn" onClick={() => inputDigit(2)}>2</button>
        <button className="btn" onClick={() => inputDigit(3)}>3</button>
        <button className="btn col-span-1" onClick={equals}>=</button>

        <button className="btn col-span-2" onClick={() => inputDigit(0)}>0</button>
        <button className="btn" onClick={inputDot}>.</button>
      </div>
    </div>
  );
};

export default Calculator;


