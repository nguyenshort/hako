import {useMainService} from "../composables";
import {ipcMain} from "electron";

export const universalEventsRegister = () => {
    ipcMain.handle('show-universal-view', async (_) => {
        const mainService = useMainService()
        await mainService.showUniversalView()
    })


}
