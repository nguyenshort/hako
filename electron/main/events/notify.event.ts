import {ipcMain, Notification} from "electron"

export const notifyEventsRegister = () => {
    ipcMain.handle('show-notification', (_, title: string, body: string) => {
        new Notification({ title, body }).show()
    })
}
