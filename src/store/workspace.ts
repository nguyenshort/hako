import { defineStore } from 'pinia'
import {IApp} from "../../shared/models/app";

interface State extends Record<string, any> {
    apps: IApp[],
    focused?: IApp,
    componentView: 'workspace' | 'app-deleted' | 'my-shortcuts'
    counterInit: number
}

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useMainStore = defineStore('workspace', {
    state: (): State => ({
        apps: [],
        focused: undefined,
        componentView: 'workspace',
        counterInit: 0
    }),
    getters: {
        hasApp: (state: State) => state.apps.length > 0
    },
    actions: {
        setApps(shortcuts: IApp[]) {
            this.apps = shortcuts
        },
        removeApp(id: string) {
            this.apps = this.apps.filter(shortcut => shortcut._id !== id)
        },
        setFocused(shortcut?: IApp) {
            this.focused = shortcut
        },
        setComponentView(name: 'workspace' | 'my-shortcuts') {
            this.componentView = name
        },
        setCounterInit(counter: number) {
            this.counterInit = counter
        }
    }
})
