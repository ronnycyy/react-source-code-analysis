// 时间切片

import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  const len = 3000;
  return (
    <ul>
      { Array(len).fill(0).map((_, i) => <li key={i}>{i}</li>)}
    </ul>
  )
}

const root = document.getElementById("reactapp");

// ReactDOM.render(<App />, root);
ReactDOM.unstable_createRoot(root).render(<App />);