import React, { useState } from 'react';
import ReactDOM from 'react-dom';


// App 是没有 state 的，不会改变
function App() {
  return (
    <WrappedInput>
      {/* oldProps === newProps 前后 props 相等，而且没有 state 变化，不多BB直接 bailout。 */}
      <ExpensiveCPU />
    </WrappedInput>
  )
}

// 只有一个子结点，children 是一个 ReactElement。
// 有 两个以上的子结点，children 就是 Array<ReactElement>。

// state 全在 WrappedInput 里，children 是不会被动 render 的
function WrappedInput({ children }) {
  const [word, setWord] = useState('');

  return (
    <div title={word}>
      <input value={word} onChange={(e) => setWord(e.target.value)} />
      <p>word is: {word}</p>
      {children}
    </div>
  )
}

function ExpensiveCPU() {
  let now = performance.now();
  while (performance.now() - now < 100) { }
  console.log('卡 100 ms');
  return <h5>耗时的组件</h5>
}


ReactDOM.render(<App />, document.getElementById('reactapp'));
