import {ipcMain} from 'electron'
import {ICreateShortcut} from "@shared/interface/shortcut"
import {
    createShortcutHandle,
    getShortcutsHandle,
    openShortcutContextHanle, openSpotlightHandle,
    removeShortcutsHandle,
    toggleBaseView
} from "./shortcut.event"
import {initUniversalViewHandle, toggleMutedViewHandle, toggleUniversalViewHandle} from "./universal.event"
import {fireNotify} from "./notify.event";

export const eventsRegister = () => {

    // Các event liên quan tới thông báo
    ipcMain.handle('show-notification', (_, title: string, message: string) => fireNotify(title, message))
    ipcMain.handle('open-spotlight', () => openSpotlightHandle())

    /**
     * Các handle liên quan tới shortcut
     */
    ipcMain.handle('create-shortcut', async (_, args: ICreateShortcut) => createShortcutHandle(args))
    ipcMain.handle('gets-shortcut', async () => getShortcutsHandle())
    ipcMain.handle('remove-shortcut', async (_, id: string) => removeShortcutsHandle(id))
    // Context menu
    ipcMain.handle('open-shortcut-context', async (_, _id: string) => openShortcutContextHanle(_id))

    /**
     * Base View
     */
    ipcMain.handle('toggle-base-view', async (_) => toggleBaseView())

    /**
     * Init universal view
     */
    ipcMain.handle('init-universal-view', (_, _id, auto) => initUniversalViewHandle(_id, auto))
    ipcMain.handle('toggle-universal-view', (_, _id) => toggleUniversalViewHandle(_id))
    ipcMain.handle('toggle-muted-view', (_, _id) => toggleMutedViewHandle(_id))
}
