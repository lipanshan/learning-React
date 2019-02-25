import React, {Component} from 'react'
import {LocaleProvider, Select, Input, Table, Pagination} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import {getData} from '../api/ipwarnning'

const Option = Select.Option

export default class Ipearlywarning  extends Component {

  constructor(props) {
    super(props)
    this.state = {
      children: [
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
          title: '源IP',
          dataIndex: 'sourceIp',
          key: 'sourceIp'
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
          title: '目标量',
          dataIndex: 'targetNum',
          key: 'targetNum',
        },
        {
          title: '最后访问',
          dataIndex: 'dateTime',
          key: 'dateTime',
          sorter: true
        }
      ],
      queryParam: {
        keyword: '',
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
    return (
      <LocaleProvider locale={zhCN}>
        <div className="ip-warnning">
          <div className="search-wrap">
            <span className="title">源IP</span>
            <Input className="search-input" onChange={this.searchHandle.bind(this)} placeholder="关键字" type="text"/>
            <span className="title">时间</span>
            <Select className="select" value={this.state.queryParam.datetime} onChange={this.selectHandle1.bind(this)}>
              {
                this.state.children.map((item) => (
                  item ? <Option key={item.value} value={item.value} >{item.label}</Option> : ''
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
              <Pagination className="" current={this.state.queryParam.pageIndex} onChange={this.paginationChange.bind(this)} total={this.state.queryParam.pageNum}></Pagination>
            </div>
          </div>
        </div>
      </LocaleProvider>
    )
  }

  getInfo (params) {
    getData('', params).then((res) => {
      if (res.ret === 200) {
        console.log(res)
        this.setState({
          tableData: res.data.list,
          queryParam: Object.assign({}, this.state.queryParam, {
            pageNum: res.data.pageNum,
            pageSize: res.data.pageSize,
            pageIndex: res.data.pageIndex
          })
        })
      } else if (res.ret === 499) {
        this.props.history.push('/login')
      }
    })
  }

  searchHandle (e) {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        keyword: e.target.value
      })
    })
  }

  selectHandle1 (selected) {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        datetime: selected
      })
    }, () => this.getInfo(this.state.queryParam))
  }

  clickHandle () {
    this.getInfo(this.state.queryParam)
  }

  paginationChange (pagination) {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        pageIndex: pagination
      })
    }, () => this.getTableInfo(this.state.queryParam))
  }

}