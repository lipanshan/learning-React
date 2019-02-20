import React, {Component} from 'react'
import {LocaleProvider, Select, Input, Table, Pagination} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import {getPortLog} from '../api/portlog'
const Option = Select.Option

export default class Portlog extends Component {

  constructor(props) {
    super(props)
    this.state = {
      children: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '端口'
        },
        {
          value: 2,
          label: '协议'
        }
      ],
      children2: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '流量统计'
        },
        {
          value: 2,
          label: '风险两'
        },
        {
          value: 3,
          label: '源IP地址'
        },
        {
          value: 4,
          label: '目标IP地址'
        }
      ],
      children3: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '大于'
        },
        {
          value: 2,
          label: '小于'
        },
        {
          value: 3,
          label: '等于'
        }
      ],
      children4: [
        {
          value: 1,
          label: '当天'
        },
        {
          value: 2,
          label: '近一周'
        },
        {
          value: 3,
          label: '近一个月'
        }
      ],
      loading: false,
      tableData: [],
      tableColumns: [
        {
          title: '序号',
          dataIndex: 'number',
          key: 'number'
        },
        {
          title: '源端口/协议',
          dataIndex: 'sourcePort',
          key: 'sourcePort',
        },
        {
          title: '访问量',
          dataIndex: 'countNum',
          key: 'countNum',
        },
        {
          title: '风险量',
          dataIndex: 'riskNum',
          key: 'riskNum',
        },
        {
          title: '源IP',
          dataIndex: 'sourceIpNum',
          key: 'sourceIpNum',
        },
        {
          title: '目标IP',
          dataIndex: 'targetIpNum',
          key: 'targetIpNum',
        },
        {
          title: '首次时间',
          dataIndex: 'firstTime',
          key: 'firstTime',
        },
        {
          title: '最后访问',
          dataIndex: 'endTime',
          key: 'endTime',
          sorter: true
        }
      ],
      queryParam: {
        condition: 0,
        keyword: '',
        riskType: 0,
        where: 0,
        num: '',
        datetime: 1,
        pageIndex: 1,
        pageSize: 10,
        pageNum: 1
      }
    }
  }

  componentDidMount () {
    this.getInfo(this.state.queryParam)
  }

  render() {
    return (<LocaleProvider locale={zhCN}>
      <div className="port-log">
        <div className="search-wrap">
          <span className="title">筛选条件</span>
          <Select className="select" defaultValue={this.state.queryParam.condition} onChange={this.selectHandle1.bind(this)}>
            {
              this.state.children.map((item) => (
                item ? <Option key={item.value} value={item.value} >{item.label}</Option> : ''
              ))
            }
          </Select>
          <Input className="search-input" value={this.state.queryParam.keyword} onChange={this.searchHandle.bind(this)} placeholder="关键字" type="text"/>
          <span className="title">筛选条件</span>
          <Select className="select" defaultValue={this.state.queryParam.riskType} onChange={this.selectHandle2.bind(this)}>
            {
              this.state.children2.map((item) => (
                item ? <Option key={item.value}  value={item.value} >{item.label}</Option> : ''
              ))
            }
          </Select>
          <Select className="select" defaultValue={this.state.queryParam.where} onChange={this.selectHandle3.bind(this)}>
            {
              this.state.children3.map((item) => (
                item ? <Option key={item.value}  value={item.value} >{item.label}</Option> : ''
              ))
            }
          </Select>
          <Input className="search-input" value={this.state.queryParam.num} onChange={this.searchHandle2.bind(this)} placeholder="数量" type="text"/>
          <span className="title">时间</span>
          <Select className="select" defaultValue={this.state.queryParam.datetime} onChange={this.selectHandle4.bind(this)}>
            {
              this.state.children4.map((item) => (
                item ? <Option key={item.value}  value={item.value} >{item.label}</Option> : ''
              ))
            }
          </Select>
          <span onClick={this.clickHandle.bind(this)} className="search-btn">搜索</span>
        </div>
        <div className="table">
          <Table
            dataSource={this.state.tableData}
            rowKey={record => record.number}
            columns={this.state.tableColumns}
            loading={this.state.loading}
            pagination={false}
          ></Table>
          <div className="pagination-wrap">
            <Pagination className="" defaultCurrent={this.state.queryParam.pageIndex} onChange={this.paginationChange.bind(this)} total={this.state.queryParam.pageNum}></Pagination>
          </div>
        </div>
      </div>
      </LocaleProvider>)
  }

  getInfo (param) {
    getPortLog('', param).then((res) => {
      if (res.ret === 200) {
        console.log(res)
        this.setState({
          tableData: res.data.list,
          queryParam: Object.assign({}, this.state.queryParam, {
            pageNum: res.data.pageNum
          })
        })
      } else if (res.ret === 499) {
        this.props.history.push('/login')
      }
    })
  }

  selectHandle1 (selected) {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        condition: selected
      }, () => this.getInfo(this.state.queryParam))
    })
  }
  searchHandle (e) {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        keyword: e.target.value
      })
    })
  }

  selectHandle2 (selected) {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        riskType: selected
      }, () => this.getInfo(this.state.queryParam))
    })
  }

  selectHandle3 (selected) {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        where: selected
      }, () => this.getInfo(this.state.queryParam))
    })
  }

  selectHandle4 (selected) {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        datetime: selected
      }, () => this.getInfo(this.state.queryParam))
    })
  }

  searchHandle2 (e) {
    const num = isNaN(e.target.value) ? e.target.value : ''
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        num: num
      })
    })
  }

  clickHandle () {
    this.getInfo(this.state.queryParam)
  }

  paginationChange (pagination) {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        pageIndex: pagination
      })
    }, () => this.getInfo(this.state.queryParam))
  }
}