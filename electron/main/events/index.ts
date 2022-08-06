import {ipcMain, Notification} from 'electron'
import {IShortcut} from "../../../shared/interface/shortcut";
import {IHakoDatabase} from "../database";
import {createShortcutHandle, responseShortcutsHandle} from "./shortcut.event";

export const eventsRegister = (db: IHakoDatabase) => {

    // Các event liên quan tới thông báo
    ipcMain.handle('show-notification', (_, title: string, message: string) => {
        new Notification({ title, body: message }).show()
    })
    /**
     * Các handle liên quan tới shortcut
     */
    ipcMain.handle('create-shortcut', async (_, args: Omit<IShortcut, 'id'>) => createShortcutHandle(db.shortcuts, args))
    ipcMain.handle('gets-shortcut', async () => responseShortcutsHandle(db.shortcuts))
}
