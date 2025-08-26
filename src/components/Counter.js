import React, { useState } from 'react';

const Counter = () => {
  const [value, setValue] = useState(0);
  const [step, setStep] = useState(1);

  const getStep = () => {
    const n = Number(step);
    return Number.isFinite(n) ? n : 0;
  };

  const increment = () => setValue(prev => prev + getStep());
  const decrement = () => setValue(prev => prev - getStep());
  const reset = () => setValue(0);

  return (
    <div className="max-w-xs mx-auto bg-white rounded-lg shadow p-4">
      <div className="text-center text-3xl font-mono mb-3" aria-live="polite">{value}</div>

      <div className="flex items-center gap-2 mb-3">
        <label htmlFor="counter-step" className="text-sm text-gray-600">Step</label>
        <input
          id="counter-step"
          type="number"
          value={step}
          onChange={e => setStep(e.target.value)}
          className="w-20 px-2 py-1 border rounded"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button type="button" className="btn" onClick={decrement} aria-label="Decrement">-</button>
        <button type="button" className="btn" onClick={reset}>Reset</button>
        <button type="button" className="btn" onClick={increment} aria-label="Increment">+</button>
      </div>
    </div>
  );
};

export default Counter;


