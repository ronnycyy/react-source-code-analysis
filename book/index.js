import React, { unstable_useTransition as useTransition, useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
  const [startTransition, isPending] = useTransition({ timeoutMs: 20000 });
  const [count, setCount] = useState(0);

  console.log(isPending);

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

const root = document.getElementById('reactapp');

// ReactDOM.render(<App />, root);

ReactDOM.unstable_createRoot(root).render(<App />);


