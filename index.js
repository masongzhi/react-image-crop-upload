import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null
    };
  }

  changeFile(val) {
    this.setState({
      file: val
    })
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.changeFile.bind(this)}/>
      </div>
    );
  }
}

export default App;
