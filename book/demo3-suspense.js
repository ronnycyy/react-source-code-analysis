import React, {
  Suspense,
  useState,
  unstable_useTransition as useTransition
} from "react";
import ReactDOM from 'react-dom';

function wrapPromise(promise) {
  let result;
  let status = "pending";
  let suspender = promise.then(
    value => {
      result = value;
      status = "success";
    },
    reason => {
      result = reason;
      status = "error";
    }
  );

  return {
    read() {
      if (status === "pending") {
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
        resolve({ time: new Date().toLocaleString() });
      }, 1000);
    })
  );
}

function Clock({ resource }) {
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