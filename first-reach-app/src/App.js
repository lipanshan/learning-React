import React, {Component} from 'react';
import Input from './input'
import List from './list'
import './style.sass'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [
        {
          id: 1,
          value: 111
        },
        {
          id: 2,
          value: 222
        },
        {
          id: 3,
          value: 333
        }
      ],
      msg: 'heml'
    }
  }

  render() {
    return (
      <div className="App">
        <Input className="input" submitFn={this.submitFns.bind(this)}></Input>
        <List className="list" list={this.state.list} deleteFn={this.deleteFn.bind(this)}></List>
      </div>
    );
  }

  submitFns(value) {
    this.setState({
      list: this.state.list.concat({
        value: value,
        id: this.state.list.length
      })
    })
  }

  deleteFn(id) {
    const data = JSON.parse(JSON.stringify(this.state.list))
    this.setState({
      list: data.filter((item) => {
        return item.id !== id
      })
    })
    // console.log(this.state)
  }
}

export default App;
