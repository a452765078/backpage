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

app.use(ElementPlus, {
    locale: zhCn,
})

app.use(router).mount('#app')
