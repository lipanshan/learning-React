import React, {Component} from 'react'
const fileNameDefault = '升级包只支持".zip"、".rar"格式,单个文件不大于5M'
const fileMaxSize = 5 * 1024 * 1024
export default class Systemupgrade extends Component {

  constructor(props) {
    super(props)
    this.state = {
      initStep: '',
      currentTarget: 0,
      countTimer: null,
      countNum: 3,
      initTime: '',
      version: '',
      fileName: fileNameDefault,
      fileList: ''
    }
  }

  componentWillMount () {
  }

  render() {
    return (
      <div className="set-wrap">
        <div className="update-system">
          <div onClick={this.selectedHandle.bind(this, 0)} className={`wrap ${this.state.initStep} ${this.state.currentTarget === 0 ? 'active' : ''}`}>
            <div className="icon">
              <img className="icon1" src={require('../static/images/update1.png')} alt=""/>
              <img className="icon2" src={require('../static/images/update1-active.png')} alt=""/>
            </div>
            <h2 className="title">系统升级</h2>
            <p className="subtitle">上次升级：{this.state.initTime}</p>
            <p className="subtitle">当前版本：{this.state.version}</p>
          </div>
          <div onClick={this.selectedHandle.bind(this, 1)} className={`wrap ${this.state.initStep} ${this.state.currentTarget === 1 ? 'active' : ''}`}>
            <div className="icon">
              <img className="icon1" src={require('../static/images/update2.png')} alt=""/>
              <img className="icon2" src={require('../static/images/update2-active.png')} alt=""/>
            </div>
            <h2 className="title">系统升级</h2>
            <p className="subtitle">上次升级：{this.state.initTime}</p>
            <p className="subtitle">当前版本：{this.state.version}</p>
          </div>
        </div>
        <h2><span className="reqire">*</span>选择文件（系统）</h2>
        <div className="form-group">
          <p className="update-btn">{this.state.fileName}</p>
          <div className="input"><input accept=".zip,.rar" type="file" ref="fileWrap" value="" onChange={this.changeHandle.bind(this)}/><span>选择升级包</span></div>
        </div>
      </div>
    )
  }

  getTimeInfoList () {}

  selectedHandle (index) {
    this.setState({
      currentTarget: index
    })
  }

  timeCount (time, callBack) {
    clearTimeout(this.state.countTimer)
    if (time < 0) {
      this.setState({
        countTimer: null,
      })
      typeof callBack === 'function' && callBack()
      return false
    }
    const newTime = time - 1
    this.setState({
      countNum: time,
      countTimer: setTimeout(() => {
        this.timeCount(newTime, callBack)
      }, 1000)
    })
  }

  changeHandle () {
    const file = this.refs.fileWrap.files[0]
    if (!(file.type && (/zip$/.test(file.type) || /rar$/.test(file.type)))) {
      this.setState({
        fileList: '',
        fileName: fileNameDefault
      })
     return true
    }
    if (file.size && file.size > fileMaxSize) {
      this.setState({
        fileList: '',
        fileName: fileNameDefault
      })
      return true
    }
    this.setState({
      fileList: this.refs.fileWrap.value,
      fileName: file.name
    }, () => console.log(this.state.fileList))
  }
}