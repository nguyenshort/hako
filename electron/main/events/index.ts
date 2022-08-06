import {ipcMain, Notification} from 'electron'
import {ICreateShortcut} from "@shared/interface/shortcut";
import {IHakoDatabase} from "../database";
import {createShortcutHandle, getShortcutsHandle, removeShortcutsHandle} from "./shortcut.event";

export const eventsRegister = (db: IHakoDatabase) => {

    // Các event liên quan tới thông báo
    ipcMain.handle('show-notification', (_, title: string, message: string) => {
        new Notification({ title, body: message }).show()
    })
    /**
     * Các handle liên quan tới shortcut
     */
    ipcMain.handle('create-shortcut', async (_, args: ICreateShortcut) => createShortcutHandle(db.shortcuts, args))
    ipcMain.handle('gets-shortcut', async () => getShortcutsHandle(db.shortcuts))
    ipcMain.handle('remove-shortcut', async (_, id: string) => removeShortcutsHandle(db.shortcuts, id))
}
