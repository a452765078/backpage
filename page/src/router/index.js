import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    // {
    //     path: '/',
    //     name: 'root',
    //     redirect: '/system/users',
    //     component: () => import('../views/home.vue')
    // },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/system',
        name: '系统管理',
        children: [
            {
                path: 'user',
                name: '用户管理',
                component: () => import('../views/user.vue')
            },
            {
                path: 'menu',
                name: '菜单管理',
                component: () => import('../views/menu.vue')
            }, {
                path: 'role',
                name: '角色管理',
                component: () => import('../views/role.vue')
            }, {
                path: 'dept',
                name: '部门管理',
                component: () => import('../views/dept.vue')
            }
        ]
    },
    {
        path: '/audit',
        name: '审批',
        children: [
            {
                path: 'leave',
                name: '请假',
                component: () => import('../views/leave.vue')
            }, {
                path: 'approve',
                name: '审核',
                component: () => import('../views/approve.vue')
            }
        ]
    }


]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router