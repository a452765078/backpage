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
    }, {
        path: '/system/user',
        name: 'users',
        component: () => import('../views/user.vue')
    }, {
        path: '/system/menu',
        name: 'menu',
        component: () => import('../views/menu.vue')
    }, {
        path: '/system/role',
        name: 'role',
        component: () => import('../views/role.vue')
    }, {
        path: '/system/dept',
        name: 'dept',
        component: () => import('../views/dept.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router