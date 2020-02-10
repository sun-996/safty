import { postRequest, deleteRequest, putRequest, getRequest } from '@/utils/request'

// 企业基本信息 -> 添加
export function enterpriseBasicInfoAdd(data) {
  return postRequest('/basicData/enterpriseBasicInfo/add', data)
}

// 获取企业基本信息所有的经纬度
export function getCoordinates() {
  return getRequest('/basicData/enterpriseBasicInfo/getCoordinates')
}

// 企业基本信息 -> 删除
export function enterpriseBasicInfoDelete(id) {
  return deleteRequest(`/basicData/enterpriseBasicInfo/delete/${id}`)
}

// 企业基本信息 -> 修改
export function enterpriseBasicInfoUpdate(data) {
  return putRequest(`/basicData/enterpriseBasicInfo/update/${data.id}`, data)
}

// 企业基本信息 -> 查看
export function enterpriseBasicInfoList(data) {
  return postRequest('/basicData/enterpriseBasicInfo/list', data)
}

// 企业基本信息 -> 历史修改记录
export function historyEnterpriseBasicInfo(id) {
  return postRequest(`/basicData/enterpriseBasicInfo/historys/${id}`)
}

// 安全生产信息-查看
export function safeProductionInfoList(data) {
  return postRequest('/basicData/safeProductionInfo/list', data)
}

// 安全生产信息 -> 修改
export function safeProductionInfoUpdate(data) {
  return putRequest(`/basicData/safeProductionInfo/update/${data.id}`, data)
}

// 安全生产信息 -> 删除
export function safeProductionInfoDelete(id) {
  return deleteRequest(`/basicData/safeProductionInfo/delete/${id}`)
}

// 安全生产信息 -> 添加
export function safeProductionInfoAdd(data) {
  return postRequest('/basicData/safeProductionInfo/add', data)
}

// 安全生产信息 -> 历史修改记录
export function historySafeProductionInfo(id) {
  return postRequest(`/basicData/safeProductionInfo/historys/${id}`)
}
