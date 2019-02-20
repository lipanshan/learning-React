import React, {Component} from 'react'
import {Input} from 'antd'
import {submitFrom} from '../api/changepassword'

const REQUIRE_MSG1 = '请填写'
const REQUIRE_MSG3 = '两次密码不一致'

export default class Changepassword extends Component {

  constructor(props) {
    super(props)
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      message1: '',
      message2: '',
      message3: '',
      maxLength: 26
    }
  }

  render() {
    return (
      <div className="change-password">
        <div className="form">
          <div className={`form-group ${!!this.state.message1 ? 'error' : ''}`}>
            <label className="form-label">原密码</label>
            <Input value={this.state.oldPassword} maxLength={this.state.maxLength} type="password" onBlur={this.blurHandle.bind(this)} onChange={this.passwordHandle.bind(this)} className="form-control" />
          </div>
          {
            this.state.message1 ? (<p className="error-msg">{this.state.message1}</p>) : ''
          }
          <div className={`form-group ${!!this.state.message2 ? 'error' : ''}`}>
            <label className="form-label">新密码</label>
            <Input value={this.state.newPassword} maxLength={this.state.maxLength} type="password" onBlur={this.nblurHandle.bind(this)} onChange={this.npasswordHandle.bind(this)} className="form-control" />
          </div>
          {
            this.state.message2 ? (<p className="error-msg">{this.state.message2}</p>) : ''
          }
          <div className={`form-group ${!!this.state.message3 ? 'error' : ''}`}>
            <label className="form-label">确认新密码</label>
            <Input value={this.state.confirmNewPassword} maxLength={this.state.maxLength} type="password" onBlur={this.cblurHandle.bind(this)} onChange={this.cpasswordHandle.bind(this)} className="form-control" />
          </div>
          {
            this.state.message3 ? (<p className="error-msg">{this.state.message3}</p>) : ''
          }
          <div className="action">
            <span onClick={this.clickHandle.bind(this)} className="submit">保存</span>
          </div>
        </div>
      </div>
    )
  }

  passwordHandle (e) {
    this.setState({
      oldPassword: e.target.value,
    })
  }

  blurHandle (e) {
    let txt = ''
    if (!e.target.value) {
      txt = REQUIRE_MSG1
    } else {
      txt = ''
    }
    this.setState({
      message1: txt
    })
  }

  npasswordHandle (e) {
    this.setState({
      newPassword: e.target.value
    })
  }

  nblurHandle (e) {
    if (!e.target.value) {
      this.setState({
        message2: REQUIRE_MSG1
      })
      return
    } else if (e.target.value === this.state.confirmNewPassword && this.state.confirmNewPassword) {
      this.setState({
        message2: '',
        message3: ''
      })
      return
    } else if (e.target.value !== this.state.confirmNewPassword && this.state.confirmNewPassword) {
      this.setState({
        message2: '',
        message3: REQUIRE_MSG3
      })
      return
    } else {
      this.setState({
        message2: ''
      })
    }
  }

  cpasswordHandle (e) {
    this.setState({
      confirmNewPassword: e.target.value
    })
  }

  cblurHandle (e) {
    if (!e.target.value) {
      this.setState({
        message3: REQUIRE_MSG1
      })
      return
    } else if (e.target.value === this.state.newPassword && this.state.newPassword) {
      this.setState({
        message2: '',
        message3: ''
      })
      return
    } else if (e.target.value !== this.state.newPassword && this.state.newPassword) {
      this.setState({
        message2: '',
        message3: REQUIRE_MSG3
      })
      return
    } else {
      this.setState({
        message3: ''
      })
    }
  }

  clickHandle () {
    let note = false
    if (!this.state.oldPassword) {
      this.setState({
        message1: REQUIRE_MSG1
      })
      note = true
    }
    if (!this.state.newPassword) {
      this.setState({
        message2: REQUIRE_MSG1
      })
      note = true
    }
    if (!this.state.confirmNewPassword) {
      this.setState({
        message3: REQUIRE_MSG1
      })
      note = true
    }
    if (this.state.newPassword !== this.state.confirmNewPassword) {
      this.setState({
        message3: REQUIRE_MSG3
      })
      note = true
    }
    if (note) {
      return
    }
    submitFrom('', {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword,
      confirmNewPassword: this.state.confirmNewPassword
    }).then((res) => {
      if (res.ret === 200) {
        console.log(res)
        this.props.history.push({pathname: '/login'})
      } else if (res.ret === 499) {
        this.props.history.push({pathname: '/login'})
      }
    }).catch((msg) => {
      console.log(msg)
    })
  }
}