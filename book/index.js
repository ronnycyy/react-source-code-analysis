import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function App() {

  return (
    <div>
      <Input />
      {/* current.memoizedProps === workInProgress.pendingProps，true，所以前后 props 一样，直接 bailout 不用 render */}
      <ExpensiveCPU />
    </div>
  )
}

function Input() {
  const [num, setNum] = useState(0);

  return (
    <>
      <input value={num} onChange={(e) => setNum(+e.target.value)} />
      <p>num is: {num}</p>
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
