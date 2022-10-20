import axios from './index.js'

function login(para) {
    let params = {}
    let method = 'POST'
    params.url = '/users/login'
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
    params.url = '/roles/allList'
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
    params.url = '/roles/operate'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function getRolesListByPage(para) {
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

function operateRole(para) {
    let params = {}
    let method = 'POST'
    params.url = '/roles/operate'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function updateRolePermission(para) {
    let params = {}
    let method = 'POST'
    params.url = '/roles/update/permission'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}
function operateDept(para) {
    let params = {}
    let method = 'POST'
    params.url = '/dept/operate'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function getLeaveList(para) {
    let params = {}
    let method = 'GET'
    params.url = '/leave/list'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function operateLeave(para) {
    let params = {}
    let method = 'POST'
    params.url = '/leave/operate'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function operateApprove(para) {
    let params = {}
    let method = 'POST'
    params.url = '/leave/approve'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function getAllUserList(para) {
    let params = {}
    let method = 'GET'
    params.url = '/users/all/list'
    params.method = method
    if (method === 'POST') {
        params.data = para
    } else {
        params.params = para
    }

    return axios({ ...params })
}

function getLeaveCount(para) {
    let params = {}
    let method = 'GET'
    params.url = '/leave/count'
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
    operateMenu,
    getRolesListByPage,
    operateRole,
    updateRolePermission,
    operateDept,
    getLeaveList,
    operateLeave,
    operateApprove,
    getAllUserList,
    getLeaveCount
}