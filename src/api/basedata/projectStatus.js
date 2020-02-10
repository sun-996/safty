import { postRequest, deleteRequest, putRequest, getRequest } from '@/utils/request'

// 项目情况 -> 添加
export function projectStatusAdd(data) {
  return postRequest('/basicData/projects/add', data)
}

// 获取项目情况所有的经纬度
export function getCoordinates() {
  return getRequest('/basicData/projects/getCoordinates')
}

// 项目情况 -> 删除
export function projectStatusDelete(id) {
  return deleteRequest(`/basicData/projects/delete/${id}`)
}

// 项目情况 -> 修改
export function projectStatusUpdate(data) {
  return putRequest(`/basicData/projects/update/${data.id}`, data)
}

// 项目情况 -> 查看
export function projectStatusList(data) {
  return postRequest('/basicData/projects/list', data)
}

// 项目数量 -> 查看
export function getProjectCount() {
  return getRequest('/basicData/projects/getProjectCount')
}

// 项目情况 历史修改
export function historyProjectStatus(id) {
  return postRequest(`/basicData/projects/historys/${id}`)
}

// 项目情况 添加危险源
export function dangerousAdd(data) {
  return postRequest('/basicData/dangerous/add', data)
}

// 项目情况 查看危险源
export function dangerousList(projectId) {
  return postRequest(`/basicData/dangerous/list/${projectId}`)
}

// 项目情况 修改危险源
export function dangerousUpdate(data) {
  return putRequest(`/basicData/dangerous/update/${data.id}`, data)
}

// 项目情况 删除危险源
export function dangerousDelete(id) {
  return deleteRequest(`/basicData/dangerous/delete/${id}`)
}

// 项目情况 查看危险源历史
export function historyDangerous(id) {
  return postRequest(`/basicData/dangerous/historys/${id}`)
}
