import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
  const [word, setWord] = useState('');

  // effect 单向链表
  // completeWork阶段，不断将链表往上送: returnFiber.firstEffect = completedWork.firstEffect;

  // 链表顺序和 completeWork 顺序一致， 我 -> 兄弟.. -> 父 -> ... -> null
  // rootFiber.nextEffect: input -> p -> div -> null
  return (
    <div title={word}>
      <input value={word} onChange={(e) => setWord(e.target.value)} />
      <p>{word}</p>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('reactapp'));
