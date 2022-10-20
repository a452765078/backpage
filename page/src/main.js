import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import store from './storage/store'


const app = createApp(
    App
)
// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }





Object.keys(ElementPlusIconsVue).forEach((key) => {
    app.component(key, ElementPlusIconsVue[key]);
});

app.use(store)

// 注册一个全局自定义指令  v-has
app.directive('has', {
    //当绑定的元素插入到DOM中时
    // inserted: function (el) {
    //     console.log("inserted", el)
    // },

    mounted: function (el, bind, vnode) {
        let actionList = bind.instance.$store.state.actionList
        let action = bind.value
        let isHas = actionList.includes(action)
        if (!isHas) el.parentNode.removeChild(el)
    }
})

app.use(ElementPlus, {
    locale: zhCn,
})

app.use(router).mount('#app')
