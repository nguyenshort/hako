import type { App } from 'vue'
import {reactive} from "vue";

export const APP_BRIDGE_CONSTANT = Symbol.for('AppBridge')

const plugin = {
  install(app: App) {

    const appBridge = reactive(window.appBridge)

    app.provide(APP_BRIDGE_CONSTANT, appBridge)

    app.config.globalProperties.$appBridge = appBridge
  }
}

export default plugin
