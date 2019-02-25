import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {getMenu} from '../api/menu'
import ScrollBar from 'react-scrollbar'

export default class Menu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      authorizeType: '',
      equipmentNumber: '',
      termOfValidity: '',
      logoUrl: require('../static/images/logo2.png'),
      systemName: '',
      systemVersion: '',
      menuList: [],
      active: this.props.location.pathname.substring(1)
    }
  }

  componentWillMount () {
    getMenu().then((res) => {
      if (res.ret === 200) {
        this.setState({
          authorizeType: res.data.authorizeInfo.authorizeType,
          equipmentNumber: res.data.authorizeInfo.equipmentNumber,
          termOfValidity: res.data.authorizeInfo.termOfValidity,
          // logoUrl: res.data.systemInfo.logoUrl,
          systemName: res.data.systemInfo.systemName,
          systemVersion: res.data.systemInfo.systemVersion,
          menuList: (() => {
            const arr = []
            const currentPath = this.props.history.location.pathname.substring(1)
            for (let item of res.data.leftMenu) {
              arr.push(Object.assign({}, item, {
                collapse:  item.pathUrl === currentPath || item.subset.find((obj) => obj.pathUrl === currentPath)? '' : 'hide'
              }))
            }
            return arr
          })()
        })
      }
    }).catch((msg) => {
      console.log(msg)
    })
  }
  render() {
    return (
      <div className="menu">
        <h1><img src={this.state.logoUrl} alt=""/></h1>
        <ScrollBar speed={0.1} className="menu-list">
          <ul className="menu-content">
            {
              this.state.menuList.map((item, index) => (
                <li key={item.id} className="item">
                  <div className={`menu-txt menu${index} ${item.pathUrl === this.state.active ? 'active' : ''}`} onClick={this.switchHandle.bind(this, item)}>
                    <span className="left-icon"></span>
                    <Link to={`/${item.pathUrl}`} onClick={this.menuSelect.bind(this, item)} className="title">{item.name}</Link>
                    {
                      item.subset.length ? <span onClick={this.toggleMenu.bind(this, item)} className={`arrow-icon ${item.collapse ? '' : 'up'}`}></span> : ''
                    }
                  </div>
                  <ul className={`menu-content ${item.collapse}`}>
                    {
                      item.subset.map((data, i) => (<li key={data.id} className="item">
                          <div className={`menu-txt ${data.pathUrl === this.state.active ? 'active' : ''}`} onClick={this.switchHandle.bind(this, data)}>
                          <span className="left-icon"></span>
                          <Link to={`/${data.pathUrl}`} className="title">{data.name}</Link>
                          {
                            data.subset.length ? <span className="arrow-icon"></span> : ''
                          }
                        </div>
                        </li>
                      ))
                    }
                  </ul>
                </li>
              ))
            }
          </ul>
        </ScrollBar>
        <div className="version-info">
          <h3 className="title">授权正常</h3>
          <p className="subtitle">设备编号</p>
          <p className="txt">{this.state.equipmentNumber}</p>
          <p className="subtitle">有效期</p>
          <p className="txt">{this.state.termOfValidity}</p>
          <p className="subtitle">授权类型</p>
          <p className="txt">{this.state.authorizeType}</p>
        </div>
      </div>
    )
  }
  toggleMenu (data, e) {
    const arr = []
    for (let item of this.state.menuList) {
      if (item.id === data.id) {
        arr.push(Object.assign({}, item, {
          collapse: data.collapse ? '' : 'hide'
        }))
      } else {
        arr.push(item)
      }
    }
    this.setState({
      menuList: arr
    })
    e.stopPropagation()
    e.preventDefault()
  }

  menuSelect (data) {
    const arr = []
    for (let item of this.state.menuList) {
      if (item.id === data.id) {
        arr.push(Object.assign({}, item, {
          collapse: ''
        }))
      } else {
        arr.push(item)
      }
    }
    this.setState({
      menuList: arr
    })
  }
  switchHandle (data) {
    this.setState({
      active: data.pathUrl
    })
  }

}