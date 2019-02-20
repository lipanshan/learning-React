import 'whatwg-fetch'
import 'es6-promise'
import createSign from './createsign.js'
const BASE_URL = process.env.REACT_APP_API

export function submitFrom (url = '', data = {}) {
  const time = new Date().getTime()
  const param = Object.assign({}, data, {
    server: 'App.User.CheckPassword',
    tips: time
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