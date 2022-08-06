import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import {router} from "@plugins/routes"
import VueMitter from '@nguyenshort/vue3-mitt'
// import './samples/node-api'

const app = createApp(App)

app.use(router)
app.use(VueMitter)

app.mount('#app')
