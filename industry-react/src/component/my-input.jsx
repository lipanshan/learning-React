import React, {Component} from 'react'

export default class MyInput extends Component {

  constructor(props) {
    super(props)
    this.state = {
      focus: false,
      value1: '',
      value2: '',
      value3: '',
      value4: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    this.ipUpdate(nextProps.value)
  }

  render() {
    return (
      <div>
        <div className={`my-input${this.props.className ? (` ${this.props.className}`) : ''}${this.state.focus ? ' focus' : ''}${this.props.disabled ? ' hide' : ''}`}>
          <div className="input"><input value={this.state.value1} onFocus={this.focusHandle.bind(this)} onBlur={this.blurHandle.bind(this)} maxLength="3" onChange={this.focusHandle1.bind(this)} type="text" ref="input1" /></div>
          <span className="point"></span>
          <div className="input"><input value={this.state.value2} onFocus={this.focusHandle.bind(this)} onBlur={this.blurHandle.bind(this)} maxLength="3" onChange={this.focusHandle2.bind(this)} type="text" ref="input2" /></div>
          <span className="point"></span>
          <div className="input"><input value={this.state.value3} onFocus={this.focusHandle.bind(this)} onBlur={this.blurHandle.bind(this)} maxLength="3" onChange={this.focusHandle3.bind(this)} type="text" ref="input3" /></div>
          <span className="point"></span>
          <div className="input"><input value={this.state.value4} onFocus={this.focusHandle.bind(this)} onBlur={this.blurHandle.bind(this)} maxLength="3" onChange={this.focusHandle4.bind(this)} type="text" ref="input4" /></div>
        </div>
        <div className={`my-input${this.props.className ? (` ${this.props.className}`) : ''}${this.props.disabled ? '' : ' hide'}`}>
          <div className="input">{this.state.value1}</div>
          <span className="point"></span>
          <div className="input">{this.state.value2}</div>
          <span className="point"></span>
          <div className="input">{this.state.value3}</div>
          <span className="point"></span>
          <div className="input">{this.state.value4}</div>
        </div>
      </div>

    )
  }

  ipUpdate (ip) {
    const arr = ip ? ip.split('.') : ['', '', '', '']
    this.setState({
      value1: arr[0],
      value2: arr[1],
      value3: arr[2],
      value4: arr[3],
    })
  }

  ipValidate (ip) {
    let val = ''
    if (!isNaN(ip) && ip !== '') {
      val = /^([0-9]|[1-9]\d|1[0-9][0-9]|2[0-5][0-5])$/.test(ip) ? ip : 255
    } else {
      val = ''
    }
    return val
  }
  focusHandle () {
    this.setState({
      focus: true
    })
  }
  blurHandle () {
    this.setState({
      focus: false
    })
  }
  focusHandle1 (e) {
    const val = this.ipValidate(e.target.value)
    if (val.length >=3) {
      this.refs.input2.focus()
    }
    this.props.onChange(`${val}.${this.state.value2}.${this.state.value3}.${this.state.value4}`)
  }
  focusHandle2 (e) {
    const val = this.ipValidate(e.target.value)
    if (val.length >=3) {
      this.refs.input3.focus()
    }
    this.props.onChange(`${this.state.value1}.${val}.${this.state.value3}.${this.state.value4}`)
  }
  focusHandle3 (e) {
    const val = this.ipValidate(e.target.value)
    if (val.length >=3) {
      this.refs.input4.focus()
    }
    this.props.onChange(`${this.state.value1}.${this.state.value2}.${val}.${this.state.value4}`)
  }
  focusHandle4 (e) {
    const val = this.ipValidate(e.target.value)
    this.props.onChange(`${this.state.value1}.${this.state.value2}.${this.state.value3}.${val}`)
  }
}