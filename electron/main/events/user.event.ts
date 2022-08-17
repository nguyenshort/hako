import {useMainServie, useUserServie} from "../composables/instance";
import {ipcMain} from "electron";
import {UserDocument} from "@entities/user.entity";

export const userEventsRegister = () => {
    ipcMain.handle('get-user', async (_) => {
        const userService = useUserServie()
        return userService.user
    })
    ipcMain.handle('update-user', async (_, input: Partial<UserDocument>) => {
        const userService = useUserServie()
        const mainService = useMainServie()
        await userService.updateUser(input)
        mainService.emitToVue('user:change', userService.user)
    })
}
