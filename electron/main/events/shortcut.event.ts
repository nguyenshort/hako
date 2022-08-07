import {ICreateShortcut, IShortcut} from "@shared/interface/shortcut"
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

        const shortcut: IShortcut = await dbs.shortcuts.findOneAsync({_id: id})
        if(!shortcut) {
            // Không có shortcut này
            return
        }

        console.log("🔥Removing shortcut: ", shortcut.name)

        await dbs.shortcuts.removeAsync({ _id: shortcut._id }, { multi: false })
        mainService.notifyToBaseView("after-shortcut-removed", shortcut._id)

        new Notification({ title: 'Xoá thành công', body: `Bạn đã xoá ${shortcut.name}` }).show()

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
    const dbServices = useDatabase()

    const shortcut: IShortcut = await dbServices.shortcuts.findOneAsync({ _id })
    if(!shortcut) {
        // Không có shortcut này
        return
    }

    /**
     * Xoá shortcut ra khỏi db
     * Remove khỏi stack views
     * Thông báo xoá thành công
     * Todo: Update UI
     */
    const clickDeleteHandle = async () => {
        await removeShortcutsHandle(_id)
        await universalService.removeView(_id)
    }

    const clickToggleMuted = async () => {
        await universalService.toggleMutedView(_id)
    }

    const menus: Array<(MenuItemConstructorOptions) | (MenuItem)> = [
        {
            label: shortcut.muted ? 'Bật tiếng' : 'Tắt tiếng',
            click: clickToggleMuted
        },
        {
            label: 'Xoá tài khoản',
            click: clickDeleteHandle
        }
    ]

    const ctxMenu = Menu.buildFromTemplate(menus)

    ctxMenu.popup()
}
