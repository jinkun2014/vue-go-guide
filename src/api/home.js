import request from '@/utils/request'

const index = async (params) => {
  return await request.get(`/home`, {params})
}
const save = async (params) => {
  return await request.post(`/save`, params)
}
const login = async (params) => {
  return await request.get(`/login/${params.password}`)
}

export {
  index,
  save,
  login
}
