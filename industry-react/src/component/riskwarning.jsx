import React, {Component} from 'react'
import {LocaleProvider, Select, Input, DatePicker, Table, Pagination} from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import {getTableDate} from '../api/riskwarning'
const Option = Select.Option

export default class RiskWarning  extends Component {

  constructor(props) {
    super(props)
    this.state = {
      children1: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '风险名称'
        },
        {
          value: 2,
          label: '源IP'
        },
        {
          value: 3,
          label: '目标IP'
        }
      ],
      children2: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: 'tcp'
        },
        {
          value: 2,
          label: 'udp'
        },
        {
          value: 3,
          label: 'icmp'
        }
      ],
      endOpen: false,
      loading: false,
      tableData: [],
      tableColumns: [
        {
          title: '序号',
          dataIndex: 'number',
          key: 'number'
        },
        {
          title: '名称',
          dataIndex: 'riskName',
          key: 'riskName',
          render: (text) => (<span title={text}>{text}</span>)
        },
        {
          title: '类型',
          dataIndex: 'riskType',
          key: 'riskType',
        },
        {
          title: '源IP',
          dataIndex: 'sourceIp',
          key: 'sourceIp',
        },
        {
          title: '目标IP',
          dataIndex: 'targetIp',
          key: 'targetIp',
        },
        {
          title: '最后访问',
          dataIndex: 'dateTime',
          key: 'dateTime',
          sorter: true
        }
      ],
      queryParam: {
        condition: 0,
        keyword: '',
        riskType: 0,
        startTime: null,
        endTime: null,
        pageIndex: 1,
        pageSize: 10,
        pageNum: 1
      }
    }
  }

  componentDidMount() {
    this.getTableInfo(this.state.queryParam)
  }

  render() {
    return (<LocaleProvider locale={zhCN}>
      <div className='riskwarning'>
        <div className="search-wrap">
          <span className="title">筛选条件</span>
          <Select className="select" defaultValue={this.state.queryParam.condition} onChange={this.selectHandle1.bind(this)}>
            {
              this.state.children1.map((item) => (
                item ? <Option key={item.value} value={item.value} >{item.label}</Option> : ''
              ))
            }
          </Select>
          <Input className="search-input" onChange={this.searchHandle.bind(this)} placeholder="关键字" type="text"/>
          <span className="title">类型</span>
          <Select className="select" defaultValue={this.state.queryParam.riskType} onChange={this.selectHandle2.bind(this)}>
            {
              this.state.children2.map((item) => (
                item ? <Option key={item.value}  value={item.value} >{item.label}</Option> : ''
              ))
            }
          </Select>
          <span className="title">时间</span>
          <DatePicker
            className="datepicker-wrap"
            disabledDate={this.disabledStartDate}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={this.state.queryParam.startTime}
            placeholder="开始时间"
            onChange={this.onStartChange}
            onOpenChange={this.handleStartOpenChange} />
          <DatePicker
            className="datepicker-wrap"
            disabledDate={this.disabledEndDate}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            value={this.state.queryParam.endTime}
            placeholder="结束时间"
            onChange={this.onEndChange}
            open={this.state.endOpen}
            onOpenChange={this.handleEndOpenChange} />
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
  getTableInfo (param = {}) {
    this.setState({
      loading: true
    })
    getTableDate('', param).then((res) => {
      if (res.ret === 200) {
        this.setState({
          tableData: res.data.list,
          queryParam: Object.assign({}, this.state.queryParam, {
            pageNum: res.data.pageNum
          }),
          loading: false
        })
      } else if (res.ret === 499) {
        this.props.history.push('/login')
      }
    })
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.queryParam.endTime;
    if (!startValue || !endValue) {
      return startValue.valueOf() > new Date().getTime();
    }
    return !(startValue.valueOf() >= endValue.valueOf() && startValue.valueOf() < new Date().getTime());
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.queryParam.startTime;
    if (!endValue || !startValue) {
      return endValue.valueOf() > new Date().getTime();
    }
    return !(endValue.valueOf() <= Math.min(startValue.valueOf(), new Date().getTime()));
  }
  onChange = (field, value) => {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        [field]: value
      })
    });
  }

  onStartChange = (value) => {
    this.onChange('startTime', value);
  }

  onEndChange = (value) => {
    this.onChange('endTime', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }
  clickHandle () {
    this.getTableInfo(this.state.queryParam)
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
        condition: selected
      })
    }, () => this.getTableInfo(this.state.queryParam))
  }
  selectHandle2 (selected) {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        riskType: selected
      })
    }, () => this.getTableInfo(this.state.queryParam))
  }
  paginationChange (pagination) {
    this.setState({
      queryParam: Object.assign({}, this.state.queryParam, {
        pageIndex: pagination
      })
    }, () => this.getTableInfo(this.state.queryParam))
  }

}