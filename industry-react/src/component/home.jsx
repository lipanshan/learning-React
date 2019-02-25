import React, {Component} from 'react'
import echarts from 'echarts'
import {getData, getNetWordData} from "../api/home";

let timer = null
let timer2 = null
export default class home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      attack: 0,
      tcp: 0,
      udp: 0,
      icmp: 0,
      attackUnit: false,
      tcpUnit: false,
      udpUnit: false,
      icmpUnit: false,
      inputXdata: [],
      inputData: [],
      outputData: [],
      cpu: {},
      harddisk: [],
      memory: [],
      echarts1: null,
      echarts2: null,
      echarts3: null,
      echarts4: null,
      maxAmount: 0,
      count: 0,
      resizeTimer: null
    }
  }
  componentDidMount () {
    this.setState({
      echarts1: echarts.init(this.refs.lineChartWrap),
      echarts2: echarts.init(this.refs.cpuChartWrap),
      echarts3: echarts.init(this.refs.harddiskChartWrap),
      echarts4: echarts.init(this.refs.memoryChartWrap),
    }, () => {
      this.state.echarts1.showLoading()
      this.state.echarts2.showLoading()
      this.state.echarts3.showLoading()
      this.state.echarts4.showLoading()
      this.getInfo()
      this.getNetWord()
    })
    window.onresize = () => {
      clearTimeout(this.state.resizeTimer)
      this.setState({
        resizeTimer: setTimeout(() => {
          this.echartResize()
        }, 400)
      })
    }
  }

  componentWillUnmount () {
    // clearTimeout(this.state.timer)
    // clearTimeout(this.state.timer2)
    clearTimeout(timer)
    clearTimeout(timer2)
  }

  render() {
    return (
      <div className="home-wrap">
        <div className="data">
          <div className="column1">
            <div className="icon"></div>
            <div className="txt">
              <h2 className="title">威胁命中警告</h2>
              <p className={`num ${ this.state.attackUnit ? 'w' : ''}`}>{this.state.attack}</p>
            </div>
          </div>
          <div className="column2">
            <div className="txt">
              <h2 className="title">TCP</h2>
              <p className={`num ${ this.state.tcpUnit ? 'w' : ''}`}>{this.state.tcp}</p>
            </div>
          </div>
          <div className="column2">
            <div className="txt">
              <h2 className="title">UCP</h2>
              <p className={`num ${ this.state.udpUnit ? 'w' : ''}`}>{this.state.udp}</p>
            </div>
          </div>
          <div className="column2">
            <div className="txt">
              <h2 className="title">ICMP</h2>
              <p className={`num ${ this.state.icmpUnit ? 'w' : ''}`}>{this.state.icmp}</p>
            </div>
          </div>
        </div>
        <div className="chart-row2">
          <h2>网卡流量数据</h2>
          <div className="network-chart" ref="lineChartWrap"></div>
        </div>
        <div className="chart-row3">
          <div className="cpu-chart">
            <h2>CPU</h2>
            <div className="cpu" ref="cpuChartWrap">
            </div>
          </div>
          <div className="harddisk-chart">
            <h2>硬盘</h2>
            <div className="harddisk" ref="harddiskChartWrap">
            </div>
          </div>
          <div className="memory-chart">
            <h2>内存</h2>
            <div className="memory" ref="memoryChartWrap">
            </div>
          </div>
        </div>
      </div>
    )
  }

  getInfo () {
    getData().then((res) => {
      if (res.ret === 200) {
        this.setState({
          attack: res.data.ThreatWarningNum,
          attackUnit: res.data.ThreatWarningNumUnit,
          tcp: res.data.ToTCPNum,
          udp: res.data.ToUDPNum,
          icmp: res.data.ToICMPNum,
          tcpUnit: !!res.data.ToTCPNumUnit,
          udpUnit: !!res.data.ToUDPNumUnit,
          icmpUnit: !!res.data.ToICMPNumUnit
        })
        this.formatChart(res.data)
      } else if (res.ret === 499) {
        this.props.history.push({pathname: '/login'})
      }
    }).catch((msg) => {
      console.log(msg)
    })
  }
  lineChart () {
    // 基于准备好的dom，初始化 echarts 实例并绘制图表。
    this.state.echarts1.setOption({
      animationEasing: 'cubicOut',
      legend: {
        show: true,
        icon: 'line',
        x: 'right',
        padding: [10, 200, 0, 0]
      },
      title: {
        text: '吞吐量',
        textStyle: {
          color: '#666',
          fontSize: '12px'
        }
      },
      color: ['#fec08f', '#fe4543'],
      grid: {
        left: '4%',   // 与容器左侧的距离
        right: '4%' // 与容器右侧的距离
      },
      tooltip: {show: false},
      xAxis: {
        axisTick : {show: false},//去掉刻度
        splitLine:{
          show:false
        },
        inverse: true,
        showMinLabel: true,
        showMaxLabel: true,
        data: this.state.inputXdata,
        axisLabel: {
          interval: this.state.inputXdata.length - 2,
          rotate: 0,
          formatter: function (value, s) {
            if (s === 0) {
              return ''
            } else {
              return '60秒'
            }
          }
        }
      },
      yAxis: {
        axisTick : {show: false},//去掉刻度
        splitLine:{
          show:true
        },
        position: 'right',
        axisLabel: {
          nameLocation: 'top',
          formatter: (value) => {
            if (value === 0) {
              return 0
            } else {
              return ''
            }
          }
        },
        name: `${this.state.maxAmount}kbps`
      },
      series: [{
        type: 'line',
        name: '入流量',
        showSymbol: false,
        hoverAnimation: false,
        data: this.state.inputData
      },
        {
          type: 'line',
          name: '出流量',
          showSymbol: false,
          hoverAnimation: false,
          data: this.state.outputData
        }]
    })
    this.state.echarts1.hideLoading()
    this.setTimeoutFn2()
  }
  lineChart2 () {
    const numArr = []
    this.state.echarts2.setOption({
      legend: {
        show: true,
        icon: 'line',
        x: 'right',
        padding: [10, 200, 0, 0]
      },
      title: {
        text: '%利用率',
        textStyle: {
          color: '#666',
          fontSize: '12px'
        }
      },
      color: ['#fec08f', '#fe4543'],
      grid: {
        left: '11%',   // 与容器左侧的距离
        right: '13%' // 与容器右侧的距离
      },
      tooltip: {show: false},
      xAxis: {
        axisTick : {show: false},//去掉刻度
        splitLine:{
          show:false
        },
        inverse: true,
        showMinLabel: true,
        showMaxLabel: true,
        data: this.state.cpu.xdata,
        axisLabel: {
          interval: this.state.cpu.data.length-2,
          rotate: 0,
          formatter: function (value) {
            if (value === 1) {
              return ''
            } else {
              return `${value}秒`
            }
          }
        }
      },
      yAxis: {
        axisTick : {show: false},//去掉刻度
        splitLine:{
          show:true
        },
        position: 'right',
        showMinLabel: true,
        axisLabel: {
          formatter: function (value) {
            numArr.push(value)
            numArr.sort((a, b) => b - a)
            var texts = [];
            if (value === 0) {
              texts.push('0');
            } else if (numArr[0] >= value) {
              texts.push(`${value}%`);
            } else {
              texts.push('');
            }
            return texts;
          }
        }
      },
      series: {
        type: 'line',
        data: this.state.cpu.data
      }
    })
    this.state.echarts2.hideLoading()
  }
  pieChart1 () {
    var percent = 0
    this.state.echarts3.setOption( {
      tooltip: {
        trigger: 'item',
        formatter: "{b}({d}%)"
      },
      color: ['#36b63d', '#f1f1f1'],
      legend: {
        icon: 'rect',
        x: 'left',
        y: 'bottom',
        itemWidth: 12,
        itemHeight: 12,
        formatter: function (d) {
          return d
        }
      },
      series: [
        {
          type:'pie',
          radius: ['60%', '70%'],
          avoidLabelOverlap: false,
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle : {  //图形样式
            normal: { //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
              label: {  //饼图图形上的文本标签
                show: true  //平常不显示
              },
              labelLine: {     //标签的视觉引导线样式
                show: true  //平常不显示
              }
            }
          },
          label:{
            normal:{
              show: false,
              formatter: function (d) {
                if (/已用/g.test(d.name)) {
                  percent = d.percent
                }
                return d.percent
              }
            }
          },
          data: this.state.harddisk
        }
      ]
    })
    this.state.echarts3.setOption({
      title: {
        text: `${percent}%`,
        textStyle : {
          fontWeight : 600 ,
          fontSize : 24    //文字的字体大小
        },
        x: 'center',
        y: 'center'
      },
    })
    this.state.echarts3.hideLoading()
  }
  pieChart2 () {
    let percent = 0
    this.state.echarts4.setOption( {
      title: {
        text: `${percent}%`,
        textStyle : {
          fontWeight : 600 ,
          fontSize : 24    //文字的字体大小
        },
        x: 'center',
        y: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{b}({d}%)"
      },
      color: ['#6244e4', '#f1f1f1'],
      legend: {
        icon: 'rect',
        x: 'left',
        y: 'bottom',
        itemWidth: 12,
        itemHeight: 12
      },
      series: [
        {
          type:'pie',
          radius: ['60%', '70%'],
          avoidLabelOverlap: false,
          labelLine: {
            normal: {
              show: false
            }
          },
          label:{
            normal:{
              show: false,
              formatter: function (d) {
                if (/已用/g.test(d.name)) {
                  percent = d.percent
                }
                return d.percent
              }
            }
          },
          data: this.state.memory
        }
      ]
    })
    this.state.echarts4.setOption({
      title: {
        text: `${percent}%`,
        textStyle : {
          fontWeight : 600 ,
          fontSize : 24    //文字的字体大小
        },
        x: 'center',
        y: 'center'
      },
    })
    this.state.echarts4.hideLoading()
  }
  formatChart (data) {
    this.setState({
      harddisk: [{
        value: parseFloat(data.Disk.Used),
        name:`已用:${data.Disk.Used}`
      }, {
        value: parseFloat(data.Disk.Unused),
        name:`未用:${data.Disk.Unused}`,
        itemStyle: {
          emphasis: {color: '#f1f1f1'}
        }
      }],
      memory: [
        {
          value: parseFloat(data.Memory.Used),
          name:`已用:${data.Memory.Used}`
        },
        {
        value: parseFloat(data.Memory.Unused),
        name:`未用:${data.Memory.Unused}`,
        itemStyle: {
          emphasis: {color: '#f1f1f1'}
        }
      }
      ],
      cpu: (() => {
        const cpu = Object.assign({}, {xdata: [], data: []})
        data.CPUArr.forEach((item, index) => {
          cpu.data.push(parseFloat(item.UtilizationRate))
          cpu.xdata.push(parseFloat(item.second))
        })
        return cpu
      })()
    })
    this.lineChart2()
    this.pieChart1()
    this.pieChart2()
    this.setTimeoutFn()
  }
  setTimeoutFn () {
    // clearTimeout(this.state.timer)
    clearTimeout(timer)
    timer =  setTimeout(() => {
      this.getInfo()
    }, 30000)
    // this.setState({
    //   timer: setTimeout(() => {
    //     this.getInfo()
    //   }, 30000)
    // })
  }
  getNetWord () {
    getNetWordData().then((res) => {
      if (res.ret === 200) {
        this.setState({
          maxAmount: res.data.MaxAmount,
        })
        this.formatChart2(res.data)
        this.lineChart()
      } else if (res.ret === 499) {
        this.props.history.push({pathname: '/login'})
      }
    }).catch((msg) => {
      console.log(msg)
    })
  }
  formatChart2 (data) {
    this.setState((() => {
      let inputXdataArr = []
      let inputDataArr = []
      let outputDataArr = []
      inputXdataArr.push(data.InputArr[0].timestamp)
      for (let i = inputXdataArr.length; i < 60; i++) {
        inputXdataArr.push(new Date(data.InputArr[0].timestamp).getTime() - 1000)
      }
      if (this.state.count === 0) {
        for (let i = 0; i < 60; i++) {
          outputDataArr.push('')
          inputDataArr.push('')
        }
      } else {
        outputDataArr = this.state.echarts1.getOption().series[1].data
        inputDataArr = this.state.echarts1.getOption().series[0].data
      }
      outputDataArr.unshift(data.OutputArr[data.OutputArr.length - 1].amount)
      inputDataArr.unshift(data.InputArr[data.InputArr.length - 1].amount)
      outputDataArr.pop()
      inputDataArr.pop()
      const arr1 = JSON.parse(JSON.stringify(inputDataArr))
      const arr2 = JSON.parse(JSON.stringify(outputDataArr))
      arr1.sort((a, b) => b - a)
      arr2.sort((a, b) => b - a)
      let count = this.state.count
      if (count < 60) {
        count++
      }
      return {
        inputXdata: inputXdataArr,
        inputData: inputDataArr,
        outputData: outputDataArr,
        maxAmount: Math.max(arr1[0], arr2[0]),
        count: count
      }
    })())
  }
  setTimeoutFn2 () {
    // clearTimeout(this.state.timer2)
    // this.setState({
    //   timer2: setTimeout(() => {
    //     this.getNetWord()
    //   }, 1000)
    // })
    clearTimeout(timer2)
    timer2 = setTimeout(() => {
      this.getNetWord()
    }, 1000)
  }
  echartResize () {
    this.state.echarts1.resize()
    this.state.echarts2.resize()
    this.state.echarts3.resize()
    this.state.echarts4.resize()
  }

}