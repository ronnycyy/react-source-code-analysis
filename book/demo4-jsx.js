import React from 'react';
import ReactDOM from 'react-dom';

function Button() {
  return <button>button</button>
}

function App() {
  return (
    <div title="app title" name="app name">
      <h1>App</h1>
      <Button />
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </div>
  )
}

const root = document.getElementById("reactapp");

ReactDOM.render(<App />, root);
// ReactDOM.unstable_createRoot(root).render(<App />);


