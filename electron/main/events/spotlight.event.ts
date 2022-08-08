import {ipcMain} from "electron";
import {useMainService} from "../composables";

export const spotlightEventsRegister = () => {
    ipcMain.handle('open-spotlight', async () => {
        const mainService = useMainService()
        await mainService.openSpotlight()
    })
}
