import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import {router} from "@plugins/routes"
import VueMitter from '@nguyenshort/vue3-mitt'
import VueLottie from '@nguyenshort/vue-lottie'
import {createPinia} from "pinia";
// import './samples/node-api'
import Vant from 'vant'
import 'vant/lib/index.css'
import animejs from "@plugins/animejs";

const pinia = createPinia()

const app = createApp(App)

app.use(animejs)
app.use(Vant)
app.use(router)
app.use(VueMitter)
app.use(VueLottie)
app.use(pinia)

app.mount('#app')
