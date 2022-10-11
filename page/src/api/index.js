import axios from 'axios'
import config from '../config/index'
import storage from '../storage/index'

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