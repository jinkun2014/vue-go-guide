import axios from 'axios'
import {getToken, removeToken} from '@/utils/auth'
import {Message} from 'element-ui'
import store from '@/store'

// 创建实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

//设置默认请求头
service.defaults.headers = {
  'Content-Type': 'application/json'
}

// 请求拦截
service.interceptors.request.use(
  config => {
    // 登录认证
    let token = getToken()
    if (token && config.url === '/save') {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['Authorization'] = token

      // // 添加通用参数
      // if (config.method == 'post') {
      //   config.data = {
      //     ...config.data,
      //     token: token,
      //   }
      // } else if (config.method == 'get') {
      //   config.params = {
      //     token: token,
      //     ...config.params
      //   }
      // }
      config.url = config.url + '/' + token
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // if (response) {
    //   return response
    // }
    const res = response.data
    // 请求成功
    if (res.code === 200) {
      return res.data
    }

    Message({
      message: res.msg || '服务器异常!',
      type: 'error',
      duration: 2 * 1000
    })

    if (res.code === 401) {
      // 清除Token
      removeToken()

      // 关闭编辑
      store.dispatch('home/setEditable', false)
    }

    //
    // // 认证失败
    // if (res.resultCode === '00006') {
    //   removeToken()
    //   Dialog.confirm({
    //     title: '提示',
    //     message: '登录已经过期,请重新登录!'
    //   }).then(() => {
    //     location.reload()
    //   }).catch(() => {
    //     // on cancel
    //   })
    // } else {
    //   console.log(res.message || '服务器异常!')
    // }
    return Promise.reject(new Error(res.msg || '服务器异常!'))
  },
  err => {
    //这里是返回状态码不为200时候的错误处理
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误'
          break
        case 401:
          err.message = '未授权，请登录'
          break
        case 403:
          err.message = '拒绝访问'
          break
        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`
          break
        case 408:
          err.message = '请求超时'
          break
        case 500:
          err.message = '服务器内部错误'
          break
        case 501:
          err.message = '服务未实现'
          break
        case 502:
          err.message = '网关错误'
          break
        case 503:
          err.message = '服务不可用'
          break
        case 504:
          err.message = '网关超时'
          break
        case 505:
          err.message = 'HTTP版本不受支持'
          break
        default:
          err.message = '请求异常'
      }
    }

    //请求错误
    if (err && err.message) {
      // 网络错误
      if (err.message.indexOf('Network Error') != -1) {
        err.message = '网络错误'
      }
      //请求超时
      if (err.message.indexOf('timeout') != -1) {
        err.message = '请求超时'
      }
    }

    Message({
      message: err.message || '服务器异常!',
      type: 'error',
      duration: 2 * 1000
    })

    console.log('err' + err.message || '服务器异常!') // for debug
    return Promise.reject(err)
  }
)

export default service
