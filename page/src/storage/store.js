import { createStore } from 'vuex'
import storage from './index'

export default createStore({
    state: {
        userInfo: storage.getItem('userName'),
        count: 0
    },
    mutations: {
        login(state, param) {
            state.userInfo = param
        },
        getCount(state, param) {
            state.count = param
        }
    },
    actions: {
        login(ctx, param) {
            ctx.commit('login', param)
        },
        getCount(ctx, param) {
            ctx.commit('getCount', param)
        }
    }
})

