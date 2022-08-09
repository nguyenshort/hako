import {ipcMain, Menu, MenuItem, MenuItemConstructorOptions} from "electron";
import {useAppService, useDatabase, useMainService} from "../composables"
import {IApp, IAppInput} from "../../../shared/models/app";
import {AppChanel} from "../../../shared/chanel";
import {AppEvents} from "../../../shared/events/app.events";

export const appEventsRegister = () => {

    ipcMain.handle(AppChanel.CREATE, async (_, shortcut: IAppInput) => {

        console.log("Creating app...", shortcut.name)
        const db = useDatabase()
        const mainService = useMainService()
        try {
            const _shortcut = await db.apps.insertAsync({
                ...shortcut,
                isCustom: false
            })
            mainService.notifyToUniversalView(AppEvents.CREATED, _shortcut)

            // Gửi thông báo
            // fireNotify("Thành công", `Đã tạo shortcut ${_shortcut.name}`)

        } catch (e) {
            console.log('Error creating app', e)
        }

    })

    ipcMain.handle(AppChanel.APPS, async () => {
        try {
            const dbs = useDatabase()
            return await dbs.apps.findAsync({})
                .sort({order: 1})
        } catch (e) {
            console.log('Error getting shortcuts', e)
        }
    })

    ipcMain.handle(AppChanel.REMOVE, async (_, _id: string) => {
        console.log("🔥Removing App ID: ", _id)
        try {
            const dbs = useDatabase()
            const mainService = useMainService()

            const app: IApp = await dbs.apps.findOneAsync({ _id })
            if(!app) {
                // Không có app này
                return
            }

            console.log("🔥Removing App: ", app.name)

            await dbs.apps.removeAsync({ _id: app._id }, { multi: false })
            mainService.notifyToUniversalView(AppEvents.REMOVED, app._id)

            // fireNotify("Thành công", `Đã xóa app ${app.name}`)

        } catch (e) {
            console.log('Error getting shortcuts', e)
        }

    })

    ipcMain.handle(AppChanel.CONTEXT, async (_, _id: string) => {
        console.log('✅ Context menu for:', _id)

        const mainService = useMainService()
        const universalService = useAppService()
        const dbServices = useDatabase()

        const app: IApp = await dbServices.apps.findOneAsync({ _id })
        if(!app) {
            // Không có app này
            return
        }

        /**
         * Xoá app ra khỏi db
         * Remove khỏi stack views
         * Thông báo xoá thành công
         * Todo: Update UI
         */
        const clickDeleteHandle = async () => {
            await dbServices.removeApp(_id)
            await universalService.removeView(_id)
            mainService.notifyToUniversalView(AppEvents.REMOVED, _id)
        }

        const clickToggleMuted = async () => {
            await universalService.toggleMuted(_id)
            await mainService.notifyToUniversalView(AppEvents.UPDATED, app)
        }

        const menus: Array<(MenuItemConstructorOptions) | (MenuItem)> = [
            {
                label: app.muted ? 'Tắt tiếng' : 'Bật tiếng',
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

    ipcMain.handle(AppChanel.UPSERT, async (_, _id, auto) => {
        const universalService = useAppService()
        await universalService.upsertView(_id, auto)
    })

    ipcMain.handle(AppChanel.SHOW, async (_, _id) => {
        const universalService = useAppService()
        await universalService.togggleView(_id)
    })

    ipcMain.handle(AppChanel.MUTE, async (_, _id) => {
        const universalService = useAppService()
        await universalService.toggleMuted(_id)
    })

}
