import React, {Component} from 'react'

export default class Input extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  render() {
    return (
      <div>
        <input className={this.props.className} type="text" value={this.state.value}
               onChange={this.handlChange.bind(this)}
               onKeyUp={this.submitHandler.bind(this)}
        />
      </div>
    )
  }
  handlChange (e) {
    this.setState({
      value: e.target.value
    })
  }
  submitHandler (e) {
    const value = this.state.value
    if (e.keyCode === 13 && value.trim()) {
      this.props.submitFn(value)
      this.setState({
        value: ''
      })
    }
  }
}