import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function App() {
  const buttonRef = useRef(null);
  const [count, updateCount] = useState(0);

  const onClick = () => {
    updateCount(c => c + 2);
    // 打断: updateCount(1)构建一半的 fiber 树被废弃了😭，构建 updateCount(c => c+2) 带来的新 fiber 树。

    // legacy 下不打断，用户看到的是  0 ==> 1 ==> 3    (中规中矩)   [1] updateCount(1)   [2] update(c => c+2)
    // concurrent 下打断，用户看到的是  0 ==> 2 ==> 3  (存着结局，让你先走)  [1] updateCount(c => c+2)    [2] updateCount(1) --> update(c => c+2)

    // 💡 React 打断的只是中间状态，结局是不会变的。
  };

  useEffect(() => {
    const button = buttonRef.current;
    setTimeout(() => updateCount(1), 1000);
    setTimeout(() => button.click(), 1040);  // 上面的更新 40ms 内不能协调完，而且我优先级高，所以我就打断它了。
  }, []);

  return (
    <div>
      <button ref={buttonRef} onClick={onClick}>
        增加2
      </button>
      <div>
        {Array.from(new Array(4500)).map((v, index) => (
          <span key={index}>{count}</span>
        ))}
      </div>
    </div>
  );
}

const rootNode = document.getElementById('reactapp');
// ReactDOM.render(<App />, rootNode);
ReactDOM.unstable_createRoot(rootNode).render(<App />);
