import {CreateAppInput} from "@dtos/app.dto";
import {useMainServie} from "../composables/instance";
import {AppDocument} from "@entities/app.entity";
import {ipcMain, Menu, MenuItem, MenuItemConstructorOptions} from "electron";

export const appEventsRegister = () => {
    ipcMain.handle('create-app', async (_, input: CreateAppInput) => {
        const mainService = useMainServie()
        await mainService.createApp(input)
    })

    ipcMain.handle('remove-app', async (_, _id: string) => {
        const mainService = useMainServie()
        await mainService.removeApp(_id)
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

    ipcMain.on('re-apps-order', async (_, apps: Array< Pick<AppDocument, '_id' | 'order'>>) => {
        const mainService = useMainServie()
        await mainService.reAppsOrder(apps)
    })
}
