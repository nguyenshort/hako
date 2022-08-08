import { defineStore } from 'pinia'
import {IApp} from "@shared/interface/shortcut";

interface State extends Record<string, any> {
    shortcuts: IApp[],
    focused?: IApp,
    componentView: 'workspace' | 'app-deleted' | 'my-shortcuts'
    counterInit: number
}

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useWorkspaceStore = defineStore('workspace', {
    state: (): State => ({
        shortcuts: [],
        focused: undefined,
        componentView: 'workspace',
        counterInit: 0
    }),
    getters: {
        hasShortcut: (state: State) => state.shortcuts.length > 0
    },
    actions: {
        setShortcuts(shortcuts: IApp[]) {
            this.shortcuts = shortcuts
        },
        removeShortcut(id: string) {
            this.shortcuts = this.shortcuts.filter(shortcut => shortcut._id !== id)
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
