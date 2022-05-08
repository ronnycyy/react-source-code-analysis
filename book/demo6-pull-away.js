import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <div>
      <Input />
      {/* current.memoizedProps === workInProgress.pendingProps 结果为 true，前后 props 一样，直接 bailout 不用 render */}
      <ExpensiveCPU />
    </div>
  )
}

function Input() {
  const [word, setWord] = useState('');

  return (
    <>
      <input value={word} onChange={(e) => setWord(e.target.value)} />
      <p>word is: {word}</p>
    </>
  )
}

function ExpensiveCPU() {
  let now = performance.now();
  while (performance.now() - now < 100) { }
  console.log('卡 100 ms');
  return <h5>耗时的组件</h5>
}


ReactDOM.render(<App />, document.getElementById('reactapp'));
