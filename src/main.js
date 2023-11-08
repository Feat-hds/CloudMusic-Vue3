import { createApp } from 'vue'
import App from './App.vue'
import '@/icons/index.js'
// import 'element-plus/es/components/icon/style/css'
import '@/css/el-style.css'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import router from '@/router/router';
import 'element-plus/theme-chalk/el-message.css'
import SvgIcon from '@/components/svgIcon.vue'
import Myitem from '@/components/Myitem.vue'
import Part from '@/components/Part.vue'
import Mytitle from '@/components/Mytitle.vue'
import store from '@/store'
import { vLoading } from 'element-plus/es/components/loading/src/directive'
import Duration from '@/components/Duration.vue'
import Playnumber from '@/components/Playnumber.vue'
import Tags from '@/components/Tags.vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(store)
app.component('svg-icon', SvgIcon);
app.component('part', Part);
app.component('myitem', Myitem);
app.component('mytitle', Mytitle);
app.component('duration', Duration);
app.component('playnumber', Playnumber);
app.component('tags', Tags);
app.directive('load', vLoading)
app.mount('#app')