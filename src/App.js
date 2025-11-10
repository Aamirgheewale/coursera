import React, { useState, useEffect, useRef } from 'react';

/*
  React Calculator App
  - operations: add, subtract, multiply, divide
  - reset input, reset result
  - input validation & disable buttons when input invalid
  - prevents division by zero
  - keyboard support: Enter triggers add, keys update input
  - small history stored in state (not persisted)
  - accessible: aria-live for result, accessible labels
*/

function formatNumber(n) {
  if (!Number.isFinite(n)) return String(n);
  return Number.isInteger(n) ? String(n) : Number(n).toFixed(4).replace(/\.?0+$/, '');
}

export default function App() {
  const [result, setResult] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]); // recent operations
  const inputRef = useRef(null);

  // derive parsed value
  const parsed = (() => {
    const str = (input || '').trim();
    if (str === '') return NaN;
    // allow commas like "1,234.5"
    const normalized = str.replace(/,/g, '');
    return Number(normalized);
  })();

  useEffect(() => {
    // focus input on mount
    inputRef.current && inputRef.current.focus();
  }, []);

  function pushHistory(op, val, prev, next) {
    const entry = {
      op,
      value: val,
      prev,
      next,
      ts: Date.now(),
    };
    setHistory(h => [entry, ...h].slice(0, 6));
  }

  function doAdd() {
    if (Number.isNaN(parsed)) return alert('Please enter a valid number');
    const prev = result;
    const next = prev + parsed;
    setResult(next);
    pushHistory('+', parsed, prev, next);
  }

  function doSubtract() {
    if (Number.isNaN(parsed)) return alert('Please enter a valid number');
    const prev = result;
    const next = prev - parsed;
    setResult(next);
    pushHistory('-', parsed, prev, next);
  }

  function doMultiply() {
    if (Number.isNaN(parsed)) return alert('Please enter a valid number');
    const prev = result;
    const next = prev * parsed;
    setResult(next);
    pushHistory('*', parsed, prev, next);
  }

  function doDivide() {
    if (Number.isNaN(parsed)) return alert('Please enter a valid number');
    if (parsed === 0) { alert('Division by zero is not allowed'); return; }
    const prev = result;
    const next = prev / parsed;
    setResult(next);
    pushHistory('/', parsed, prev, next);
  }

  function resetInput() {
    setInput('');
    inputRef.current && inputRef.current.focus();
  }
  function resetResult() {
    setResult(0);
  }

  // keyboard: Enter triggers add
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      doAdd();
    }
  }

  const inputValid = !Number.isNaN(parsed);
  const canDivide = inputValid && parsed !== 0;

  return (
    <div className="app" aria-live="polite">
      <header>
        <h1>Simplest Working Calculator (React)</h1>
      </header>

      <main>
        <div className="result" role="region" aria-live="polite" aria-label="Current result">
          {formatNumber(result)}
        </div>

        <div className="controls-row">
          <label htmlFor="valueInput" className="visually-hidden">Enter a number</label>
          <input
            id="valueInput"
            ref={inputRef}
            value={input}
            placeholder="Enter a number"
            inputMode="decimal"
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Value input"
            className="text-input"
          />
        </div>

        <div className="controls" role="group" aria-label="Calculator buttons">
          <button type="button" onClick={doAdd} disabled={!inputValid}>add</button>
          <button type="button" onClick={doSubtract} disabled={!inputValid}>subtract</button>
          <button type="button" onClick={doMultiply} disabled={!inputValid}>multiply</button>
          <button type="button" onClick={doDivide} disabled={!canDivide}>divide</button>

          <button type="button" onClick={resetInput} className="warn">reset input</button>
          <button type="button" onClick={resetResult} className="primary">reset result</button>
        </div>

        <div className="note">
          Tip: press Enter to add. Division by zero is prevented.
        </div>

        <section aria-labelledby="history-title" className="history">
          <h2 id="history-title">Recent operations</h2>
          {history.length === 0 ? (
            <div className="muted">No operations yet.</div>
          ) : (
            <ol>
              {history.map((h, i) => (
                <li key={h.ts + i}>
                  {formatNumber(h.prev)} {h.op} {formatNumber(h.value)} =&nbsp;
                  <strong>{formatNumber(h.next)}</strong>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>

      <footer className="footer">
        <small>Built for portfolio assignment — React version</small>
      </footer>
    </div>
  );
}
