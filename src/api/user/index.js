import { postRequest, getRequest } from '@/utils/request'

// 验证邮箱是否存在
export function checkEmail(email) {
  return getRequest('/register/check/email/' + email, {})
}

// es6新语法
// 验证手机是否存在
export function checkResponsiblePersonPhone(responsiblePersonPhone) {
  return getRequest(
    `/register/check/responsiblePersonPhone/${responsiblePersonPhone}`,
    {}
  )
}

// 获取企业信息
export function getEnterpriseOptions() {
  return getRequest('/register/getEnterpriseOptions')
}

// 验证统一社会信息代码
export function checkCreditCode(creditCode) {
  return getRequest(`/register/check/creditCode/${creditCode}`, {})
}

// 验证用户名是否存在
export function checkUsername(username) {
  return getRequest(`/register/check/username/${username}`, {})
}

// 忘记密码 -> 验证码
export function getForgotPasswordCaptcha(data) {
  return postRequest('/forgotPassword/captcha', data)
}

// 忘记密码 -> 验证码验证
export function checkForgotPasswordCaptcha(data) {
  return postRequest('/forgotPassword/check', data)
}

// 忘记密码 -> 修改密码
export function updatePassword(data) {
  return postRequest('/forgotPassword/updatePassword', data)
}

// 忘记密码 -> 修改个人信息
export function refreshUserInfo() {
  return getRequest('/config/refreshUser', {})
}

// 注册
export function register(data) {
  return postRequest('/register/submit', data)
}

// 注册验证码
export function getRegisterCaptcha(data) {
  return postRequest('/register/captcha', data)
}

// 个人资料 -> 验证码
export function getUpdateInfoCaptcha(data) {
  return postRequest('/user/updateInfo/captcha', data)
}

// 个人资料 -> 验证码验证
export function checkUpdateInfoCaptcha(data) {
  return postRequest('/user/updateInfo/check', data)
}

// 个人资料 -> 修改个人信息
export function updateInfo(data) {
  return postRequest('/user/updateInfo/submit', data)
}

// 修改密码 -> 发送验证码
export function getUpdatePasswordCaptcha(data) {
  return postRequest('/user/updatePassword/captcha', data)
}

// 修改密码 -> 验证码验证
export function checkUpdatePasswordCaptcha(data) {
  return postRequest('/user/updatePassword/check', data)
}

// 修改密码 -> 修改密码
export function updatePasswordData(data) {
  return postRequest('/user/updatePassword/submit', data)
}

// 登录
export function login(data) {
  return postRequest('/login', data)
}
