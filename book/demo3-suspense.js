import React, {
  Suspense,
  useState,
  unstable_useTransition as useTransition
} from "react";
import ReactDOM from 'react-dom';

function wrapPromise(promise) {
  let result;
  let status = "pending";
  const suspender = promise.then(
    value => {
      result = value;
      status = "success";
    },
    err => {
      result = err;
      status = "error";
    }
  );

  return {
    read() {
      if (status === "pending") {
        // mount 时抛出错误
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else {
        return result;
      }
    }
  };
}

function fetchTime() {
  return wrapPromise(
    new Promise((resolve) => {
      setTimeout(() => {
        const r = { time: new Date().toLocaleString() }
        console.log('取得时间', r);
        resolve(r);
      }, 1000);
    })
  );
}

function Clock({ resource }) {
  // resource.read 有可能抛出错误，但 Suspense 会处理，这里按同步写法处理即可。
  const { time } = resource.read();
  return <h3>{time}</h3>;
}

function Button({ onClick, children }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 2000
  });

  const btnOnClick = () => {
    startTransition(() => {
      onClick();
    });
  };

  return (
    <>
      <button disabled={isPending} onClick={btnOnClick}>
        {children}
      </button>
      <span>{isPending && " loading"}</span>
    </>
  );
}

function App() {
  const [time, setTime] = useState(fetchTime());

  const load = () => {
    setTime(fetchTime());
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Button onClick={load}>加载</Button>
      <Clock resource={time} />
    </Suspense>
  );
}


const root = document.getElementById('reactapp');

// ReactDOM.render(<App />, root);
ReactDOM.unstable_createRoot(root).render(<App />);