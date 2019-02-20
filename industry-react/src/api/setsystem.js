import 'whatwg-fetch'
import 'es6-promise'
import createSign from './createsign.js'
const BASE_URL = process.env.REACT_APP_API

export function getTimeInfo (url, data = {}) {
  const time = new Date().getTime()
  let param = Object.assign({}, data, {
    'service': 'App.SystemSetting.TimeInfoList',
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

export function initSubmit (url = '/', data = {}) {
  const time = new Date().getTime()
  const param = Object.assign({}, data, {
    'service': 'App.SystemSetting.Initialization',
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

export function restartSubmit (url = '/', data = {}) {
  const time = new Date().getTime()
  const param = Object.assign({}, data, {
    'service': 'App.SystemSetting.Restart',
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

export function submitForm (url = '/', data = {}) {
  const time = new Date().getTime()
  const param = Object.assign({}, data, {
    'service': 'App.SystemSetting.RestTime',
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

