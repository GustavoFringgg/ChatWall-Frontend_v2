import './assets/main.css'
import './assets/all.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import GoogleLoginPlugin from 'vue3-google-login'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(GoogleLoginPlugin, {
  clientId: '1072945734683-ejmelj2bj41gs2i9cigebk6qp1rdmq0s.apps.googleusercontent.com',
})
app.use(createPinia())
app.use(router)
app.mount('#app')
