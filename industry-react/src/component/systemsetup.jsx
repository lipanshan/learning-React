import React, {Component} from 'react'
import {Select, DatePicker} from 'antd'
import {getTimeInfo, initSubmit, restartSubmit, submitForm} from '../api/setsystem'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const Option = Select.Option
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export default class Systemsetup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      options: [
      ],
      initTime: '',
      countNum: 3,
      initStep: '',
      restartStep: '',
      restartTime: '',
      setTimeStep: '',
      setTimeTime: '',
      currentTarget: 0,
      timer: null,
      countTimer: null,
      timeArea: '',
      time: null,
      formMessage: '',
      formMessageTxt:'',
      formData: {
        zone: '',
        date: '',
        time: ''
      },
      saveFlag: true
    }
  }

  componentWillMount () {
    this.getTimeInfoList()
  }

  render() {
    return (
      <div className="set-system">
        <div onClick={this.selectedHandle.bind(this, 0)} className={`wrap ${this.state.initStep} ${this.state.currentTarget === 0 ? 'active' : ''}`}>
          <div className="icon">
            <img className="icon1" src={require('../static/images/init-icon.png')} alt=""/>
            <img className="icon2" src={require('../static/images/init-icon-active.png')} alt=""/>
            <img className="icon3" src={require('../static/images/success.png')} alt=""/>
          </div>
          <h2 className="title">系统初始化需要3分钟~~</h2>
          <h2 className="title-success">恭喜您，系统初始化完成（{this.state.countNum}s）</h2>
          <div className="progress">
            <div className="progress-wrap">
              <div className="progress-bar"></div>
            </div>
          </div>
          <p className="subtitle">上次初始化：{this.state.initTime}</p>
          <div className="btn">
            <span onClick={this.initHandle.bind(this)} className="btn1">系统初始化</span>
            <span className="btn2">正在初始化</span>
          </div>
        </div>
        <div onClick={this.selectedHandle.bind(this, 1)} className={`wrap ${this.state.restartStep} ${this.state.currentTarget === 1 ? 'active' : ''}`}>
          <div className="icon">
            <img className="icon1" src={require('../static/images/restare-icon.png')} alt=""/>
            <img className="icon2" src={require('../static/images/restare-icon-active.png')} alt=""/>
            <img className="icon3" src={require('../static/images/success.png')} alt=""/>
          </div>
          <h2 className="title">系统重启大约需要2分钟~~</h2>
          <h2 className="title-success">恭喜您，系统重启完成（{this.state.countNum}s）</h2>
          <div className="progress">
            <div className="progress-wrap">
              <div className="progress-bar"></div>
            </div>
          </div>
          <p className="subtitle">上次重启：{this.state.restartTime}</p>
          <div className="btn">
            <span onClick={this.restartHandle.bind(this)} className="btn1">重启设备</span>
            <span className="btn2">正在重启</span>
          </div>
        </div>
        <div onClick={this.selectedHandle.bind(this, 3)} className={`wrap ${this.state.currentTarget === 3 ? 'active' : ''}`}>
          <div className="icon">
            <img className="icon1" src={require('../static/images/time-icon.png')} alt=""/>
            <img className="icon2" src={require('../static/images/time-icon-active.png')} alt=""/>
          </div>
          <p className="time-subtitle">上次设置时间：{this.state.setTimeTime}</p>
          <div className="btn">
            <span onClick={this.setTimeHandle.bind(this)} className="btn1">时间设置</span>
          </div>
          <div className={`time-form ${this.state.setTimeStep}`}>
            <div className="form-group">
              <label className="label">时区</label>
              <Select value={this.state.timeArea} onChange={this.timeAreaHandle.bind(this)} className="form-control" ref="areaSelect">
                {
                  this.state.options.map((item, index) => (
                    <Option key={item.zoneValue} label={item.zoneValue} time={item.zoneTime} value={item.zoneName}>{item.zoneName}</Option>
                  ))
                }
              </Select>
            </div>
            <div className="form-group">
              <label className="label">时间</label>
              <DatePicker  className="form-control"
                           disabledDate={this.disabledDate.bind(this)}
                           format={TIME_FORMAT}
                           value={this.state.time}
                           placeholder="开始时间"
                           onChange={this.onTimeChange.bind(this)}
              ></DatePicker>
            </div>
            <p className={`tip-message ${this.state.formMessage}`}>{this.state.formMessageTxt}({this.state.countNum}s)</p>
            <div className="action">
              <span onClick={this.submitFrom.bind(this)} className="save-btn">保存</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getTimeInfoList () {
    getTimeInfo('').then((res) => {
      if (res.ret === 200) {
        const time = moment(`${res.data.date} ${res.data.time}`, TIME_FORMAT)
        this.setState({
          timeArea: res.data.zoneList.find((item) => {
              return item.zoneValue === res.data.zone
            }).zoneName,
          options: res.data.zoneList,
          formData: Object.assign({}, this.state.formData, {
            zone: res.data.zone,
            date: res.data.date,
            time: res.data.time
          }),
          time: time
        })
        this.disabledDate(time)
      } else if (res.ret === 499) {
        this.props.history.push({pathname: '/login'})
      }
    }).catch((msg) => {
      console.log(msg)
    })
  }


  timeout (time, callback) {
    clearTimeout(this.state.timer)
    if (time <= 0) {
      this.setState({
        timer: null,
      })
      typeof callback === 'function' && callback()
      return false
    }
    const newTime = time - 1
    this.setState({
      timer: setTimeout(() => {
        this.timeout(newTime, callback)
      }, 1000)
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

  disabledDate (e) {
    if (!e || !this.state.formData.date || !this.state.formData.time) {
      return false
    }
    return e.valueOf() < new Date(`${this.state.date} ${this.state.time}`)
  }

  initHandle (e) {
    if (!this.state.saveFlag) {
      return
    }
    this.setState({
      saveFlag: false
    })
    initSubmit().then((res) => {
      if (res.ret === 200) {
        const time = 3 * 60
        this.setState({
          initStep: 'initing'
        }, () => this.timeout(time, () => {
          this.setState({
            timer: null,
            initStep: 'init-success'
          }, () => {
            this.timeCount(3, () => {
              this.setState({
                countNum: 3,
                initStep: ''
              })
              this.props.history.push({pathname: '/login'})
            })
          })
        }))
      } else if (res.ret === 499) {
        this.props.history.push({pathname: '/login'})
      }
      this.setState({
        saveFlag: true
      })
    }).catch((msg) => {
      console.log(msg)
    })
  }

  restartHandle () {
    if (!this.state.saveFlag) {
      return
    }
    this.setState({
      saveFlag: false
    })
    restartSubmit().then((res) => {
      if (res.ret === 200) {
        const time = 2 * 60
        this.setState({
          restartStep: 'initing'
        }, () => this.timeout(time, () => {
          this.setState({
            timer: null,
            restartStep: 'init-success'
          }, () => {
            this.timeCount(3, () => {
              this.setState({
                countNum: 3,
                restartStep: ''
              })
              this.props.history.push({pathname: '/login'})
            })
          })
        }))
      } else if (res.ret === 499) {
        this.props.history.push({pathname: '/login'})
      }
      this.setState({
        saveFlag: true
      })
    }).catch((msg) => {
      console.log(msg)
    })
  }

  setTimeHandle () {
    this.setState({
      setTimeStep: 'initing'
    })
  }

  selectedHandle (index) {
    this.setState({
      currentTarget: index
    })
  }

  timeAreaHandle (selected, e) {
    this.setState({
      formData: Object.assign({}, this.state.formData, {
        zone: e.props.label,
        date: e.props.time.split(' ')[0],
        time: e.props.time.split(' ')[1]
      }),
      timeArea: selected,
      time: moment(e.props.time, TIME_FORMAT)
    })
  }

  onTimeChange (e) {
    this.setState({
      time: e,
      formData: Object.assign({}, this.state.formData, {
        date: e._i.split(' ')[0],
        time: e._i.split(' ')[1]
      })
    })
  }

  submitFrom () {
    if (!this.state.time || !this.state.timeArea || !this.state.saveFlag) {
      return
    }
    this.setState({
      saveFlag: false
    })
    submitForm('', this.state.formData).then((res) => {
      if (res.ret === 200) {
        this.setState({
          formMessage: 'success',
          formMessageTxt: '恭喜您，设置成功！'
        })

      } else if (res.ret === 499) {
        this.props.history.push({pathname: '/login'})
      } else {
        this.setState({
          formMessage: 'error',
          formMessageTxt: '抱歉，设置失败！'
        })
      }
      this.timeCount(3, () => {
        this.setState({
          setTimeStep: '',
          countNum: 3,
          saveFlag: true
        })
      })
    }).catch((msg) => {
      console.log(msg)
    })
  }

}