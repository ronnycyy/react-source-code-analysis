import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// ⚠️ 放在 App 外面啊!! 不然 App render 每次都是新的 Memo...
const Memo = React.memo(ExpensiveCPU);

function App() {
  const [num, updateNum] = useState(0);

  return (
    <div>
      <input value={num} onChange={(e) => updateNum(+e.target.value)} />
      <p>num is: {num}</p>

      {/* 浅比较: shallowEqual({}, {}) true 前后 props 一样，不 render */}
      {/* 要一个一个比较 prop，所以不高效，但是容易命中性能优化 */}
      {/* 命中 bailout 以后，next 返回 null, 所以结束 Memo 的 beginWork以后，就到 span beginWork了，不执行子结点 ExpensiveCPU 的 beginWork。 */}
      {/* <Memo /> */}

      {/* 全等比较:  {} === {} false 前后 props 不一样，每次都 render */}
      {/* 每次都执行 beginWork */}
      <ExpensiveCPU />

      <span>hello</span>
    </div>
  )
}

function ExpensiveCPU() {
  let now = performance.now();
  while (performance.now() - now < 100) { }
  console.log('卡 100 ms');
  return <h5>耗时的组件</h5>
}


const root = document.getElementById('reactapp');

ReactDOM.render(<App />, root);