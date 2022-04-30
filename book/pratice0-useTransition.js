import React, { useTransition, useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);

  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }

  return (
    <div>
      {isPending && <span>Pending...</span>}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}

const root = document.getElementById('reactappp');

// ReactDOM.render(<App />, root);

ReactDOM.unstable_createRoot(root).render(<App />);


