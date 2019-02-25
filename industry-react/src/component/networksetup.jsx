import React, {Component} from 'react'
import MyInput from './my-input.jsx'
import {getNetworkInfo, ediotrNetwork} from '../api/setnetwork'

export default class Networksetup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      data: [{
        dns: '',
        dns_back: '',
        gateway: '',
        ip: '',
        mask: '',
        name: '',
        status: '',
        type: ''
      }],
      saveFlag: true,
      timer: null,
      saveMessage: '',
      countNum: 3,
      saveFail: false
    }
  }

  componentWillMount () {
    this.getInfo(0)
  }
  render() {
    return (<div className="setnetwork">
        <form>
          <div className="form-group paddingt22">
            <div className="label-txt"><span className="require-icon">*</span>网卡</div>
            <div className="network-wrap">
              {
                this.state.data.length && this.state.data.map((item, index) => (
                  <div key={index} onClick={this.SelectHandle.bind(this, index)} className={`network${item.status === '0' ? ' unconnect' : ''}${this.state.current === index ? ' active': ''}`}>
                      <div className="name">{item.name}</div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="form-group paddingt22 paddingb30">
            <div className="label-txt"><span className="require-icon">*</span>上网方式</div>
            <div className="radio-group">
              <label><span>静态IP上网</span><input type="radio" value="static" name="type" checked={this.state.data[this.state.current] && this.state.data[this.state.current].type === 'static'} onChange={this.typeHandle.bind(this)}/></label>
              <label><span>动态IP上网</span><input type="radio" value="dhcp" name="type" checked={this.state.data[this.state.current] && this.state.data[this.state.current].type === 'dhcp'} onChange={this.typeHandle.bind(this)}/></label>
            </div>
          </div>
          <div className="form-group paddingb30">
            <div className="label-txt"><span className="require-icon">*</span>IP地址</div>
            <div className="input-groups">
              <MyInput value={this.state.data[this.state.current].ip}
                       disabled={this.state.data[this.state.current].disabled}
                       onChange={this.ipAddressHandle.bind(this)}
                       className={this.state.data[this.state.current].ipError ? ' error' : ''}></MyInput>
            </div>
          </div>
          <div className="form-group paddingb30">
            <div className="label-txt"><span className="require-icon">*</span>子网掩码</div>
            <div className="input-groups">
              <MyInput value={this.state.data[this.state.current].mask}
                       disabled={this.state.data[this.state.current].disabled}
                       onChange={this.maskHandle.bind(this)} className={this.state.data[this.state.current].maskError ? ' error' : ''}></MyInput>
            </div>
          </div>
          <div className="form-group paddingb30">
            <div className="label-txt"><span className="require-icon"></span>网管</div>
            <div className="input-groups">
              <MyInput value={this.state.data[this.state.current].gateway}
                       disabled={this.state.data[this.state.current].disabled}
                       onChange={this.gatewayHandle.bind(this)}></MyInput>
            </div>
          </div>
          <div className="form-group paddingb30">
            <div className="label-txt"><span className="require-icon">*</span>DNS</div>
            <div className="input-groups">
              <MyInput value={this.state.data[this.state.current].dns}
                       onChange={this.dnsHandle.bind(this)} className={this.state.data[this.state.current].dnsError ? ' error' : ''}></MyInput>
            </div>
          </div>
          <div className="form-group paddingb30">
            <div className="label-txt"><span className="require-icon"></span>备用DNS</div>
            <div className="input-groups">
              <MyInput value={this.state.data[this.state.current].dns_back}
                       onChange={this.dns_backHandle.bind(this)}></MyInput>
            </div>
          </div>
          <div className="form-action">
            <div className="submit-btn" onClick={this.submitFrom.bind(this)} >保存 <span className={`save-message${!this.state.saveMessage ? ' hide': ''}${this.state.saveFail ? ' fail': ''}`}>{this.state.saveMessage}<span>({this.state.countNum}S)</span></span></div>
          </div>
        </form>
      </div>)
  }


  timeCount (time, callBack) {
    clearTimeout(this.state.timer)
    if (time < 0) {
      this.setState({
        timer: null,
      })
      typeof callBack === 'function' && callBack()
      return false
    }
    const newTime = time - 1
    this.setState({
      countNum: time,
      timer: setTimeout(() => {
        this.timeCount(newTime, callBack)
      }, 1000)
    })
  }
  getInfo (index) {
    getNetworkInfo().then((res) => {
      const arr = []
      if (res.ret === 200) {
       for (let item of res.data) {
         arr.push(Object.assign({}, item, {
           ipError: false,
           maskError: false,
           dnsError: false,
           disabled: false
         }))
       }
        this.setState({
          data: arr,
          current: index
        })
      } else if (res.ret === 499) {
        this.props.history.push({pathname: '/login'})
      }
    }).catch((msg) => {
      console.log(msg)
    })
  }
  SelectHandle (index, e) {
    this.setState({
      current: index
    })
  }
  ipAddressHandle (e) {
    const arr = JSON.parse(JSON.stringify(this.state.data))
    arr[this.state.current].ip = e
    arr[this.state.current].ipError = !/((\d{1,3}\.){3}\d{1,3})/g.test(e)
    this.setState({
      data: arr
    })
  }
  maskHandle (e) {
    const arr = JSON.parse(JSON.stringify(this.state.data))
    arr[this.state.current].mask = e
    arr[this.state.current].maskError = !/((\d{1,3}\.){3}\d{1,3})/g.test(e)
    this.setState({
      data: arr
    })
  }
  gatewayHandle (e) {
    const arr = JSON.parse(JSON.stringify(this.state.data))
    arr[this.state.current].gateway = e
    this.setState({
      data: arr
    })
  }
  dnsHandle (e) {
    const arr = JSON.parse(JSON.stringify(this.state.data))
    arr[this.state.current].dns = e
    arr[this.state.current].dnsError = !/((\d{1,3}\.){3}\d{1,3})/g.test(e)
    this.setState({
      data: arr
    })
  }
  dns_backHandle (e) {
    const arr = JSON.parse(JSON.stringify(this.state.data))
    arr[this.state.current].dns_back = e
    this.setState({
      data: arr
    })
  }
  typeHandle (e) {
    const arr = JSON.parse(JSON.stringify(this.state.data))
    arr[this.state.current].type = e.target.value
    arr[this.state.current].disabled = e.target.value === 'dhcp'
    this.setState({
      data: arr
    })
  }
  submitFrom () {
    if (this.state.data[this.state.current].ipError ||
      this.state.data[this.state.current].maskError ||
      this.state.data[this.state.current].dnsError ||
      !this.state.saveFlag) {
      return
    }
    this.setState({
      saveFlag: false
    })

    const formData = Object.assign({}, this.state.data[this.state.current])
    ediotrNetwork('/', formData).then((res) => {
      if (res.ret === 200) {
        console.log(res)
        this.setState({
          saveFail: false,
          saveMessage: '恭喜您，保存完成！'
        })
      } else if (res.ret === 499) {
        this.props.history.push('/login')
      } else {
        this.setState({
          saveFail: true,
          saveMessage: '抱歉，保存失败！'
        })
      }
      this.timeCount(3, () => {
        this.setState({
         countNum: 3,
            saveFlag: true,
            saveMessage: ''
        })
      })
    }).catch((msg) => {
      console.log(msg)
    })
  }
}