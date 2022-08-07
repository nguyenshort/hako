import {ipcRenderer, contextBridge} from "electron"
import {IShortcut} from "@shared/interface/shortcut";

contextBridge.exposeInMainWorld('ipcRenderer', {

    // Các event liên quan tới shortcut
    createShortcut: (shortcut: Omit<IShortcut, 'id'>) => ipcRenderer.invoke('create-shortcut', shortcut),
    getShortcuts: () => ipcRenderer.invoke('gets-shortcut'),
    removeShortcut: (id: string) => ipcRenderer.invoke('remove-shortcut', id),


    // Thông báo
    showNotification: (title: string, message: string) => ipcRenderer.invoke('show-notification', title, message),

    // universal
    initUniversalView: (args: any) => ipcRenderer.invoke('init-universal-view', args),
    toggleUniversalView: (_id: string) => ipcRenderer.invoke('toggle-universal-view', _id),
})
