import 'whatwg-fetch'
import 'es6-promise'
import createSign from './createsign.js'
const BASE_URL = process.env.REACT_APP_API

export function getNetworkInfo (url = '/') {
  const time = new Date().getTime()
  let param = {
    'service': 'App.NetworkSetting.NetCardInfoList',
    'tips': time
  }
  const s = Object.assign({}, param, {
    sign: createSign(param)
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

export function ediotrNetwork (url = '/', data = {}) {
  const time = new Date().getTime()
  let param = Object.assign({}, data, {
    'service': 'App.NetworkSetting.NetCardEdit',
    'tips': time
  })
  const s = Object.assign({}, param, {
    sign: createSign(param)
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