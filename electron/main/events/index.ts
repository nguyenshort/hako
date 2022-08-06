import {ipcMain, Notification} from 'electron'
import {ICreateShortcut} from "@shared/interface/shortcut";
import {IHakoDatabase} from "../database";
import {createShortcutHandle, getShortcutsHandle, removeShortcutsHandle} from "./shortcut.event";
import {initUniversalViewHandle} from "./universal.event";

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

    /**
     * Init universal view
     */
    ipcMain.handle('init-universal-view', (_, _id) => initUniversalViewHandle(db.shortcuts, _id))
}
