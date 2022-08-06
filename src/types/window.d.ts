import {App} from "vue"

export interface ipcRendererAPI {
    showNotification: (title: string, message: string) => Promise<void>

    createShortcut: (shortcut: any) => Promise<void>,
    getShortcuts: () => Promise<any[]>,
    removeShortcut: (id: string) => Promise<void>,
    initUniversalView: (args: any) => Promise<void>
}

declare global {
    interface Window {
        $vue: App<Element>
        ipcRenderer: ipcRendererAPI
    }
}
