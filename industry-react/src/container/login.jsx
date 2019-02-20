import React, {Component} from 'react'
import {getVcode, fetchPost} from '../api/login'

export default class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      msg: '登录页面',
      loginUrl: require('../static/images/logo.png'),
      account: '',
      password: '',
      vcode: '',
      errorMsgTxt: '',
      vcodeUrl: '',
      vcodeErrorMsgTxt: ''
    }
  }
  componentDidMount () {
    this.updateVcode()
    this.refs.username.focus()
  }
  render() {
    return (
      <div className="login">
        <div className="login-content">
          <div className="login-icon"><img src={this.state.loginUrl} alt=""/></div>
          <h1>工控智能分析系统<span className="version">v1.0</span></h1>
          <form className="form" onKeyUp={this.formSubmit.bind(this)}>
            <div className="form-group">
              <div className="input-wrap">
                <input type="text" value={this.state.account} onBlur={this.validataeUserInput.bind(this)} onChange={this.handleUsername.bind(this)} placeholder="账号" minLength="5" maxLength="15" ref='username' />
              </div>
            </div>
            <div className="form-group" >
              <div className="input-wrap">
                <input type="password" value={this.state.password} onBlur={this.validataeUserInput.bind(this)} onChange={this.handlePassword.bind(this)}  minLength="6" maxLength="18" placeholder="密码"/>
              </div>
              <div className="error-message">{this.state.errorMsgTxt}</div>
            </div>
            <div className="form-group">
              <div className="input-wrap">
                <input type="text" value={this.state.vcode} onChange={this.handleVcode.bind(this)} placeholder="验证码" maxLength="6" className="vcode-input" />
              </div>
              <div className="vcode">
                <img src={this.state.vcodeUrl} alt=""/>
                <div className="refresh-btn" onClick={this.updateVcode.bind(this)}></div>
              </div>
              <div className="error-message">{this.state.vcodeErrorMsgTxt}</div>
            </div>
            <div className="form-action">
              <div className="submit" onClick={this.formSubmit.bind(this)}>登录</div>
            </div>
            <div className="message">如无法登陆系统请联系客服!</div>
          </form>
        </div>
      </div>
    )
  }
  autoFocus (e) {
    e.target.focus()
  }
  validataeUserInput () {
    if (this.state.account.length <= 0 || this.state.password.length <=0 ) {
      return
    }
    if (this.state.account.length < 5 ||
      this.state.account.length > 15 ||
      this.state.password.length < 6 ||
      this.state.password.length > 18
    ) {
      this.setState({
        errorMsgTxt: '用户名和密码不匹配'
      })
    } else {
      this.setState({
        errorMsgTxt: ''
      })
    }
  }
  updateVcode () {
    this.setState({
      vcodeUrl: getVcode()
    })
  }
  handleUsername (e) {
    this.setState({
      account: e.target.value
    })
  }
  handlePassword (e) {
    this.setState({
      password: e.target.value
    })
  }
  handleVcode (e) {
    this.setState({
      vcode: e.target.value
    }, () => {
      if (this.state.vcode.length > 0) {
        this.setState({
          vcodeErrorMsgTxt: ''
        })
      }
    })
  }
  formSubmit (e) {
    const parm = {
      username: this.state.account,
      password: this.state.password,
      vcode: this.state.vcode
    }
    if ((e.type === 'keyup' && e.keyCode === 13) || e.type === 'click') {
      fetchPost('/', parm).then((res) => {
        if (res.ret === 200) {
          this.props.history.push({
            pathname:'/admin',
            query: {
              username: res.data.username
            }
          })
          localStorage.setItem('username', res.data.username)
        } else if (res.ret === 400) {
          this.setState({
            vcodeErrorMsgTxt: '验证码错误'
          })
        } else if (res.ret === 422) {
          this.setState({
            vcodeErrorMsgTxt: res.msg
          })
        } else if (res.ret === 423) {
          this.setState({
            errorMsgTxt: res.msg
          })
        }
      }).catch((msg) => {
        console.log(msg)
      })
    }
  }

}