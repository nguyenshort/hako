import {contextBridge, ipcRenderer} from "electron"
import {CreateAppInput, UpdateAppsOrderInput} from "@dtos/app.dto"
import {UserDocument} from "@entities/user.entity";

let timerSpotlight = 0
let block = false

window.addEventListener('keyup', async (e) => {

    if(block) {
        return
    }
    if (e.key !== 'Shift') {
        return
    }
    if (Date.now() - timerSpotlight < 500) {
        block = true
        await ipcRenderer.invoke('push-route', '/spotlight')

        block = true

        setTimeout(() => {
            block = false
        }, 300)

    }

    timerSpotlight = Date.now()
})

export const appBridge = {
    pushRoute: (route: string, focus?: boolean) => ipcRenderer.invoke('push-route', route, focus),
    popRoute: () => ipcRenderer.invoke('pop-route'),
    pushNotify: (title: string, message: string) => ipcRenderer.invoke('push-notify', title, message),
    addEventListener: (event: string, callback: (...args: any[]) => void|Promise<void>) => ipcRenderer.on(event, (event, data) => callback(data)),

    // CURD Application
    createApp: (shortcut: CreateAppInput) => ipcRenderer.invoke('create-app', shortcut),
    getMyApps: () => ipcRenderer.invoke('get-my-apps'),
    removeApp: (_id: string) => ipcRenderer.invoke('remove-app', _id),
    reAppOrder: (apps: UpdateAppsOrderInput) => ipcRenderer.send('re-apps-order', apps),

    // Mở context menu
    openAppContext: (id: string) => ipcRenderer.invoke('open-app-context', id),


    // CURD User
    getUser: (): Promise<UserDocument> => ipcRenderer.invoke('get-user'),
    updateUser: (input: Partial<UserDocument>) => ipcRenderer.invoke('update-user', input),
}

contextBridge.exposeInMainWorld('appBridge', appBridge)
