import Cookies from 'js-cookie'

const TokenKey = 'order_admin_template_token'

export function getToken1() {
  return Cookies.get(TokenKey)
}

export function setToken1(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken1() {
  return Cookies.remove(TokenKey)
}
