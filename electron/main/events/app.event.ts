import {ipcMain, Menu, MenuItem, MenuItemConstructorOptions} from "electron";
import {IApp, ICreateShortcut} from "@shared/interface/shortcut"
import {useAppService, useDatabase, useMainService} from "../composables"

export const appEventsRegister = () => {
    ipcMain.handle('create-app', async (_, shortcut: ICreateShortcut) => {

        console.log("Creating app...", shortcut.name)
        const db = useDatabase()
        const mainService = useMainService()
        try {
            const _shortcut = await db.apps.insertAsync({
                ...shortcut,
                isCustom: false
            })
            mainService.notifyToUniversalView("after-app-created", _shortcut)

            // Gửi thông báo
            // fireNotify("Thành công", `Đã tạo shortcut ${_shortcut.name}`)

        } catch (e) {
            console.log('Error creating app', e)
        }

    })


    // Todo: transform to events
    ipcMain.handle('gets-my-apps', async () => {
        try {
            const dbs = useDatabase()
            return await dbs.apps.findAsync({})
                .sort({order: 1})
        } catch (e) {
            console.log('Error getting shortcuts', e)
        }
    })



    ipcMain.handle('remove-app', async (_, id: string) => {
        try {
            const dbs = useDatabase()
            const mainService = useMainService()

            const app: IApp = await dbs.apps.findOneAsync({_id: id})
            if(!app) {
                // Không có app này
                return
            }

            console.log("🔥Removing app: ", app.name)

            await dbs.apps.removeAsync({ _id: app._id }, { multi: false })
            mainService.notifyToUniversalView("after-app-removed", app._id)

            // fireNotify("Thành công", `Đã xóa app ${app.name}`)

        } catch (e) {
            console.log('Error getting shortcuts', e)
        }

    })


    ipcMain.handle('open-app-context', async (_, _id: string) => {
        console.log('✅ Context menu for:', _id)

        const universalService = useAppService()
        const dbServices = useDatabase()

        const shortcut: IApp = await dbServices.apps.findOneAsync({ _id })
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
            // await removeShortcutsHandle(_id)
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
    })


    ipcMain.handle('upsert-app-view', async (_, _id, auto) => {
        const universalService = useAppService()
        await universalService.upsertView(_id, auto)
    })

    ipcMain.handle('show-app-view', async (_, _id) => {
        const universalService = useAppService()
        await universalService.togggleView(_id)
    })

    ipcMain.handle('toggle-muted-app-view', async (_, _id) => {
        const universalService = useAppService()
        await universalService.toggleMutedView(_id)
    })


}
