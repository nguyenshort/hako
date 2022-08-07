import {App} from "vue"
import {ICallback} from "@shared/interface/shortcut";

export interface ipcRendererAPI {
    showNotification: (title: string, message: string) => Promise<void>

    createShortcut: (shortcut: any) => Promise<void>,
    getShortcuts: () => Promise<any[]>,
    removeShortcut: (id: string) => Promise<void>,
    openShortcutContext: (id: string) => Promise<void>,

    toggleBaseView: (visiable: boolean) => Promise<void>,
    useEvent: (event: string, callback: ICallback) => void,

    initUniversalView: (args: any) => Promise<void>
    toggleUniversalView: (_id: string) => Promise<void>
}

declare global {
    interface Window {
        $vue: App<Element>
        ipcRenderer: ipcRendererAPI
    }
}
