import {ipcMain, ipcRenderer, Menu, MenuItem, MenuItemConstructorOptions, Notification} from "electron";
import {useDatabase, useMainServie} from "../composables/instance";
import {IApp, IAppInput} from "../../../shared/models/app";

export const eventsRegister = () => {

    // Sự kiện hệ thống
    ipcMain.once('app:mounted', async () => {
        const mainService = useMainServie()
        await mainService.initApps()
    })

    /**
     * Notify
     */
    ipcMain.handle('push-notify', (_, title: string, body: string) => {
        console.log('🔥', title, body)
        new Notification({ title, body }).show()
    })

    ipcMain.handle('push-route', async (_, route: string) => {
        const mainService = useMainServie()
        await mainService.pushRoute(route)
    })


    /**
     * App
     */
    ipcMain.handle('create-app', async (_, input: IAppInput) => {
        const mainService = useMainServie()
        await mainService.createApp(input)
    })

    ipcMain.handle('get-my-apps',() => {
        const mainService = useMainServie()
        return mainService.apps
    })

    ipcMain.handle('open-app-context', async (_, _id: string) => {
        console.log('✅ Context menu for:', _id)

        const mainService = useMainServie()

        const { app } = mainService.findApp(_id)
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
        const clickDeleteHandle = async () => mainService.removeApp(_id)

        const clickToggleMuted = async () => mainService.toggleMutedApp(_id)
            // await universalService.toggleMuted(_id)

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

    ipcMain.on('re-apps-order', async (_, apps: Array< Pick<IApp, '_id' | 'order'>>) => {
        const mainService = useMainServie()
        await mainService.reAppsOrder(apps)
    })

}
