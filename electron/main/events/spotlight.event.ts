import {ipcMain} from "electron";
import {useSpotlightService} from "../composables";

export const spotlightEventsRegister = () => {
    ipcMain.handle('open-spotlight', async () => {
        const mainService = useSpotlightService()
        await mainService.show()
    })
}
