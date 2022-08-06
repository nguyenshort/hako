import {App} from "vue"

export interface ipcRendererAPI {
    showNotification: (title: string, message: string) => Promise<void>

    createShortcut: (shortcut: any) => Promise<void>,
    getShortcuts: () => Promise<any[]>,
}

declare global {
    interface Window {
        $vue: App<Element>
        ipcRenderer: ipcRendererAPI
    }
}
