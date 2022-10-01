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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router