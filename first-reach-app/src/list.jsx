import React, {Component} from 'react'

export default class List extends Component {
  render() {
    return (
      <ul className={this.props.className}>
        {this.props.list.map((item, index) => {
          return <li key={index} onClick={this.clickHandler.bind(this, item.id)} >{item.value}</li>
        })}
      </ul>
    )
  }
  clickHandler (id) {
    this.props.deleteFn(id)
  }

}