import 'whatwg-fetch'
import 'es6-promise'
import createSign from './createsign'
const BASE_URL = process.env.REACT_APP_API
export function getData (url = '/') {
  const time = new Date().getTime()
  const str = {
    service: 'App.SystemIndex.DataList',
    tips: time
  }
  const s = Object.assign({}, str, {
    sign: createSign(str)
  })
  const arr = []
  for (let key of Object.keys(s)) {
    arr.push(`${key}=${encodeURIComponent(s[key])}`)
  }
  const fullUrl = `http://${BASE_URL}${url}`
  return fetch(fullUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: arr.join('&')
  }).then((res) => {
    return Promise.resolve(res.json())
  })
}
export function getNetWordData (url = '/') {
  const time = new Date().getTime()
  const str = {
    service: 'App.SystemIndex.NetWorkCardInfoListNow',
    tips: time
  }
  const s = Object.assign({}, str, {
    sign: createSign(str)
  })
  const arr = []
  for (let key of Object.keys(s)) {
    arr.push(`${key}=${encodeURIComponent(s[key])}`)
  }
  const fullUrl = `http://${BASE_URL}${url}`
  return fetch(fullUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: arr.join('&')
  }).then((res) => {
    return Promise.resolve(res.json())
  })
}