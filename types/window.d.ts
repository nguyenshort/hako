import {App} from "vue"
import {appBridge} from "../electron/preload";

declare global {
    interface Window {
        $vue: App<Element>
        appBridge: typeof appBridge
    }
}
