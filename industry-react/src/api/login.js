import 'whatwg-fetch'
import 'es6-promise'
import createSign from './createsign.js'
import rsa from '../assets/rsa.js'
const BASE_URL = process.env.REACT_APP_API

export function fetchPost (url, data = {}) {
  const time = new Date().getTime()
  const ragUsername = getRSACode(data.username)
  const ragPassword = getRSACode(data.password)
  let param = {
    'service': 'App.User.Login',
    'username': ragUsername,
    'password': ragPassword,
    'vcode': data.vcode,
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
export function getVcode (url, param = {}) {
  const time = new Date().getTime()
  const data = Object.assign({}, param, {
    service: 'App.User.VcodeCreate',
    tips: time
  })
  return `http://${process.env.REACT_APP_API}?service=App.User.VcodeCreate&tips=${time}&sign=${createSign(data)}`
}

function getRSACode (newStr){
  //公钥
  const PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm39nQmLTyX/Ej961KxU+gJW4UgqEQnoaJowSgkK/4qNJAduIz7bhHWtxZ9SRNwUAXwZWZzh81dfYIkvhc5jikIVOEZoChOtUnkP+2jrpQmYMRSHwVQbsM+/k3U4Al7gQrJDwzRgxePyrtisZHpUtkN77bJXgQGEfDX09WytG4MTFk99hdXM8vllw4Nyw+ErZL3uVGK2tjFc1hCFXMXQwpWkDH2NDcGTxYacQp4ljyIouDQCf3Lhw0m+qhxL1jNYxk9oCzFkZFOoat2PRhmV7Lp6E/+dWnWXIT86EaI7Fqy238rhnD2WQ4dD/fxq1yXADgaoT24549Xzmywd3hDo8mQIDAQAB-----END PUBLIC KEY-----'
  const obj = rsa()
  const crypt = new obj.JSEncrypt();
  crypt.setPublicKey(PUBLIC_KEY);
  //使用公钥加密
  const encrypted = crypt.encrypt(newStr);
  return encrypted
}