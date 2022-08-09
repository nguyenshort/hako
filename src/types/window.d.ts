import {App} from "vue"
import {appAPIS, helpAPIS, mainAPIS} from "../../shared/api";

type IEvent = 'after-shortcut-created' | 'after-shortcut-removed' | 'after-updated-shortcut' | 'toggle-spotlight' | 'focus-last-view' | string

declare global {
    interface Window {
        $vue: App<Element>
        appFn: typeof appAPIS
        helpFn: typeof helpAPIS
        mainFn: typeof mainAPIS
    }
}
