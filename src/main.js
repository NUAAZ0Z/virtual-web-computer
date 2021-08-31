import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import viewer from 'v-viewer'


import 'viewerjs/dist/viewer.css'
import './assets/style/app.scss'

const app = createApp(App).use(store).use(router).use(viewer)

app.mount('#app')
