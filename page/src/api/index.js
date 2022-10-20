import { WindPower } from '@element-plus/icons-vue'
import axios from 'axios'
import config from '../config/index'
import storage from '../storage/index'
import router from '../router/index'

axios.interceptors.request.use(function (config) {
    // console.log("config", config)
    let token = storage.getItem('token')
    config.headers.authorization = `Bearer ${token}`
    return config
}, function (err) {
    return Promise.reject(err)
})

axios.interceptors.response.use(function (response) {
    let data = response.data
    if (data.code === 200) {
        return data.data;
    } else if (data.code === 40001) {
        console.log("token已过期需要进行登录", data)
        alert("TOKEN已过期，请登录")
        // window.location.href = '/login'   //不可行，不停重复跳转
        router.push("/login")
    } else {
        //TODO
    }
}, function (err) {
    return Promise.reject(err)
})

if (config.mock) {
    axios.defaults.baseURL = 'https://www.fastmock.site/mock/265974f1c80795b24fa2ac2a315d6b7b/api'
} else {
    axios.defaults.baseURL = '/api'
}

axios.defaults.timeout = 3000

export default axios