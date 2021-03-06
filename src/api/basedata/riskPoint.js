import { postRequest, deleteRequest, putRequest } from '@/utils/request'

// 分页获取风险点列表
export function getriskPointList(data) {
  return postRequest('/basicData/dangerous/deleted/list', data)
}

// 添加风险点
export function addriskPoint(data) {
  return postRequest('/basicData/enterpriseriskPointInfo/add', data)
}

// 修改风险点
export function updateriskPoint(id, data) {
  return putRequest(`/basicData/enterpriseriskPointInfo/update/${id}`, data)
}

// 删除风险点
export function deleteriskPoint(id) {
  return deleteRequest(`/basicData/enterpriseriskPointInfo/delete/${id}`)
}

// 历史修改记录风险点
export function historyriskPoint(id) {
  return postRequest(`/basicData/enterpriseQualificationInfo/historys/${id}`)
}
