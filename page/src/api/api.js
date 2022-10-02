import axios from './index.js'

function login(para) {
    let params = {}
    let method = 'POST'
    params.url = '/login'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function getPermissionList(para) {
    let params = {}
    let method = 'GET'
    params.url = '/users/getPermissionList'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function getUsersList(para) {
    let params = {}
    let method = 'GET'
    params.url = '/users/list'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function delUsersInfo(para) {
    let params = {}
    let method = 'POST'
    params.url = '/users/delete'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function getRolesList(para) {
    let params = {}
    let method = 'GET'
    params.url = '/roles/list'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function getDeptList(para) {
    let params = {}
    let method = 'GET'
    params.url = '/dept/list'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function operateUsers(para) {
    let params = {}
    let method = 'POST'
    params.url = '/users/operate'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function getMenuList(para) {
    let params = {}
    let method = 'GET'
    params.url = '/menu/list'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function operateMenu(para) {
    let params = {}
    let method = 'POST'
    params.url = '/menu/operate'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

export default {
    login,
    getPermissionList,
    getUsersList,
    delUsersInfo,
    getRolesList,
    getDeptList,
    operateUsers,
    getMenuList,
    operateMenu
}