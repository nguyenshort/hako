import {ipcMain, Notification} from 'electron'
import {ICreateShortcut} from "@shared/interface/shortcut"
import {createShortcutHandle, getShortcutsHandle, removeShortcutsHandle} from "./shortcut.event"
import {initUniversalViewHandle} from "./universal.event"

export const eventsRegister = () => {

    // Các event liên quan tới thông báo
    ipcMain.handle('show-notification', (_, title: string, message: string) => {
        new Notification({ title, body: message }).show()
    })
    /**
     * Các handle liên quan tới shortcut
     */
    ipcMain.handle('create-shortcut', async (_, args: ICreateShortcut) => createShortcutHandle(args))
    ipcMain.handle('gets-shortcut', async () => getShortcutsHandle())
    ipcMain.handle('remove-shortcut', async (_, id: string) => removeShortcutsHandle(id))

    /**
     * Init universal view
     */
    ipcMain.handle('init-universal-view', (_, _id) => initUniversalViewHandle(_id))
}
