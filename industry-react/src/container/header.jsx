import React, {Component} from 'react'
import {signOut} from '../api/login'

export default class header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      nickname: (localStorage.getItem('username') || props.location.query.username || ''),
      h1: '瑞星工控智能分析系统v1.0',
      avatarUrl: require('../static/images/avatar.png')
    }
  }
  render() {
    return (
      <div className="header-wrap">
        <h1>{this.state.h1}</h1>
        <div className="avatar-wrap">
          <img src={this.state.avatarUrl} alt=""/>
          <span className="nickname">{this.state.nickname}</span>
          <span onClick={this.signout.bind(this)} className="sign-out">退出</span>
        </div>
        
      </div>
    )
  }
  signout () {
    signOut().then((res) => {
      if (res.ret === 200) {
        console.log(res)
      } else if (res.ret === 499) {
        this.props.history.push('/login')
      }
    }).catch((msg) => {
      console.log(msg)
    })
  }

}