import 'whatwg-fetch'
import 'es6-promise'
import createSign from './createsign'
const BASE_URL = process.env.REACT_APP_API
export function getMenu (url = '/') {
  const time = new Date().getTime()
  const param = {
    service: 'App.LeftMenu.Index',
    tips: time
  }
  const params = Object.assign({}, param, {
    sign: createSign(param)
  })
  const arr = []
  for (let key of Object.keys(params)) {
    arr.push(`${key}=${encodeURIComponent(params[key])}`)
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