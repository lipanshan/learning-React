import React from 'react'
import Bundle from '../../component/bundle'
export const NeedChangepassword = (props) => (
  <Bundle load={() => import("../../component/changepassword.jsx")}>
    {(Container) => <Container {...props}/>}
  </Bundle>
)
export const NeedIpEarlyWarning = (props) => (
  <Bundle load={() => import("../../component/ipearlywarning.jsx")}>
    {(Container) => <Container {...props}/>}
  </Bundle>
)
export const NeedRiskWarning = (props) => (
  <Bundle load={() => import("../../component/riskwarning")}>
    {(Contatiner) => <Contatiner {...props}/>}
  </Bundle>
)
export const NeedPortLog = (props) => (
  <Bundle load={() => import("../../component/portlog.jsx")} >
    {(Container) => <Container {...props}/>}
  </Bundle>
)
export const NeedSystemsetup = (props) => (
  <Bundle load={() => import("../../component/systemsetup.jsx")}>
    {(Container) => <Container {...props}/>}
  </Bundle>
)
export const NeedSystemupgrade = (props) => (
  <Bundle load={() => import("../../component/systemupgrade.jsx")}>
    {(Container) => <Container {...props}/>}
  </Bundle>
)
export const NeedNetworksetup = (props) => (
  <Bundle load={() => import("../../component/networksetup.jsx")}>
    {(Container) => <Container {...props} />}
  </Bundle>
)