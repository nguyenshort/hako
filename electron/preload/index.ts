import {ipcRenderer, contextBridge} from "electron"
import {IShortcut} from "../main/interface/shortcut";

contextBridge.exposeInMainWorld('ipcRenderer', {

    // Các event liên quan tới shortcut
    createShortcut: (shortcut: IShortcut) => ipcRenderer.invoke('create-shortcut', shortcut),
    getShortcuts: () => ipcRenderer.invoke('gets-shortcut'),


    // Thông báo
    showNotification: (title: string, message: string) => ipcRenderer.invoke('show-notification', title, message),
})
