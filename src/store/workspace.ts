import { defineStore } from 'pinia'
import {IShortcut} from "@shared/interface/shortcut";

interface State extends Record<string, any> {
    shortcuts: IShortcut[],
    focusedShortcut: IShortcut | null,
}

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useWorkspaceStore = defineStore('workspace', {
    state: (): State => ({
        shortcuts: [],
        focusedShortcut: null,
    }),
    getters: {
        hasShortcut: (state: State) => state.shortcuts.length > 0,
        focused: (state: State) => state.focusedShortcut,
        focusedDeleted: (state: State) => {
            if (!state.focusedShortcut) {
                return false
            }
            return state.shortcuts.filter(shortcut => shortcut._id === state.focusedShortcut?._id).length === 0
        }
    },
    actions: {
        setShortcuts(shortcuts: IShortcut[]) {
            this.shortcuts = shortcuts
        },
        removeShortcut(id: string) {
            this.shortcuts = this.shortcuts.filter(shortcut => shortcut._id !== id)
        },
        setFocusedShortcut(shortcut: IShortcut | null) {
            this.focusedShortcut = shortcut
        }
    }
})
