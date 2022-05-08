import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    num: 0
  }

  updateInTask() {
    setTimeout(() => {
      this.setState({ num: this.state.num + 1 });
      this.setState({ num: this.state.num + 1 });
      this.setState({ num: this.state.num + 1 });
      this.setState({ num: this.state.num + 1 });
      this.setState({ num: this.state.num + 1 });
    }, 0);
  }

  updateSync() {
    this.setState({ num: this.state.num + 1 });
    this.setState({ num: this.state.num + 1 });
    this.setState({ num: this.state.num + 1 });
    this.setState({ num: this.state.num + 1 });
    this.setState({ num: this.state.num + 1 });
  }

  legacy_NOT_batchedUpdateClick() {
    this.updateInTask();
  }

  legacy_batchedUpdateClick() {
    this.updateSync();
  }

  concurrent_always_batchedUpdateClick() {
    this.updateInTask();
    // this.updateSync();
  }

  render() {
    console.log('App render');
    return <p onClick={() => this.concurrent_always_batchedUpdateClick()}>{this.state.num}</p>
  }
}

const rootNode = document.getElementById('reactapp');

// legacy
// ReactDOM.render(<App />, rootNode);

ReactDOM.unstable_createRoot(rootNode).render(<App />);

