import { defineStore } from 'pinia'
import {IApp} from "../../shared/models/app";

interface State extends Record<string, any> {
    apps: IApp[],
    stackViews: string[],
    counterInit: number
}

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useMainStore = defineStore('workspace', {
    state: (): State => ({
        apps: [],
        counterInit: 0,
        stackViews: []
    }),
    getters: {
        hasApp: (state: State) => state.apps.length > 0,
        activeView: (state: State) => state.stackViews[0],
    },
    actions: {
        setApps(shortcuts: IApp[]) {
            this.apps = shortcuts
        },
        removeApp(id: string) {
            this.apps = this.apps.filter(shortcut => shortcut._id !== id)
        },
        setCounterInit(counter: number) {
            this.counterInit = counter
        },
        setStackViews(stackViews: string[]) {
            this.stackViews = stackViews
        },
        pushStackView(route: string) {
            const _stacks = this.stackViews.filter(stack => stack !== route)
            this.stackViews = [route, ..._stacks]
        }
    }
})
