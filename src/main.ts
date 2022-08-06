import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import {router} from "@plugins/routes"
import VueMitter from '@nguyenshort/vue3-mitt'
import {createPinia} from "pinia";
// import './samples/node-api'

const pinia = createPinia()

const app = createApp(App)

app.use(router)
app.use(VueMitter)
app.use(pinia)

app.mount('#app')
