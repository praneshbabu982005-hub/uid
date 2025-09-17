import React, { useState } from 'react';
import { FaBackspace } from 'react-icons/fa';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue === 0 ? 'Error' : firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-gray-800 rounded shadow-lg p-6 w-[300px]">
        {/* Display */}
        <div className="bg-black text-white rounded text-right text-3xl font-mono p-4 mb-4 min-h-[3rem]">
          {display}
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* Top Row */}
          <button onClick={clear} className="bg-gray-600 text-white p-4 rounded">C</button>
          <button onClick={handleBackspace} className="bg-gray-600 text-white p-4 rounded">
            <FaBackspace />
          </button>
          <button onClick={() => performOperation('÷')} className="bg-orange-500 text-white p-4 rounded">÷</button>
          <button onClick={() => performOperation('×')} className="bg-orange-500 text-white p-4 rounded">×</button>

          {/* Row 2 */}
          <button onClick={() => inputNumber(7)} className="bg-gray-700 text-white p-4 rounded">7</button>
          <button onClick={() => inputNumber(8)} className="bg-gray-700 text-white p-4 rounded">8</button>
          <button onClick={() => inputNumber(9)} className="bg-gray-700 text-white p-4 rounded">9</button>
          <button onClick={() => performOperation('-')} className="bg-orange-500 text-white p-4 rounded">-</button>

          {/* Row 3 */}
          <button onClick={() => inputNumber(4)} className="bg-gray-700 text-white p-4 rounded">4</button>
          <button onClick={() => inputNumber(5)} className="bg-gray-700 text-white p-4 rounded">5</button>
          <button onClick={() => inputNumber(6)} className="bg-gray-700 text-white p-4 rounded">6</button>
          <button onClick={() => performOperation('+')} className="bg-orange-500 text-white p-4 rounded">+</button>

          {/* Row 4 */}
          <button onClick={() => inputNumber(1)} className="bg-gray-700 text-white p-4 rounded">1</button>
          <button onClick={() => inputNumber(2)} className="bg-gray-700 text-white p-4 rounded">2</button>
          <button onClick={() => inputNumber(3)} className="bg-gray-700 text-white p-4 rounded">3</button>
          <button onClick={handleEquals} className="bg-green-500 text-white p-4 rounded">=</button>

          {/* Row 5 */}
          <button onClick={() => inputNumber(0)} className="bg-gray-700 text-white p-4 col-span-2 rounded">0</button>
          <button onClick={inputDecimal} className="bg-gray-700 text-white p-4 rounded">.</button>
          <button onClick={() => performOperation('+/-')} className="bg-gray-700 text-white p-4 rounded">+/-</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
