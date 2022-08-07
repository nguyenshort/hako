import {ICreateShortcut} from "@shared/interface/shortcut"
import {useDatabase, useMainService, useUniversalService} from "../composables";
import {Menu, Notification} from 'electron'
import type { MenuItem, MenuItemConstructorOptions } from 'electron'

export const createShortcutHandle = async (shortcut: ICreateShortcut) => {
    console.log("Creating shortcut...", shortcut.name)
    const db = useDatabase()
    const mainService = useMainService()
    try {
        const _shortcut = await db.shortcuts.insertAsync(shortcut)
        mainService.notifyToBaseView("after-shortcut-created", _shortcut)
    } catch (e) {
        console.log('Error creating shortcut', e)
    }
}

export const getShortcutsHandle = async () => {
    try {
        const dbs = useDatabase()
        return await dbs.shortcuts.findAsync({})
            .sort({order: 1})
    } catch (e) {
        console.log('Error getting shortcuts', e)
    }
}

export const removeShortcutsHandle = async (id: string) => {
    try {
        const dbs = useDatabase()
        const mainService = useMainService()

        console.log("Removing shortcut...", id)
        await dbs.shortcuts.removeAsync({ _id: id }, { multi: false })
        mainService.notifyToBaseView("after-shortcut-removed", id)
    } catch (e) {
        console.log('Error getting shortcuts', e)
    }
}



export const toggleBaseView = async (visiable: boolean) => {
    const mainService = useMainService()
    await mainService.toggleBaseView(visiable)
}

export const openShortcutContextHanle = async (_id: string) => {
    console.log('✅ Context menu for:', _id)

    const universalService = useUniversalService()

    /**
     * Xoá shortcut ra khỏi db
     * Remove khỏi stack views
     * Thông báo xoá thành công
     * Todo: Update UI
     */
    const clickDeleteHandle = async () => {
        await universalService.removeView(_id)
        await removeShortcutsHandle(_id)
        new Notification({ title: 'Xoá thành công', body: 'Thành công' }).show()
    }

    const menus: Array<(MenuItemConstructorOptions) | (MenuItem)> = [
        {
            label: 'Tắt tiếng'
        },
        {
            label: 'Xoá tài khoản',
            click: clickDeleteHandle
        }
    ]

    const ctxMenu = Menu.buildFromTemplate(menus)

    ctxMenu.popup()
}
