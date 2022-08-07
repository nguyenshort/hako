import {ICreateShortcut} from "@shared/interface/shortcut"
import {useDatabase, useMainService} from "../composables";

export const createShortcutHandle = async (shortcut: ICreateShortcut) => {
    console.log("Creating shortcut...", shortcut.name)
    const db = useDatabase()
    try {
        await db.shortcuts.insertAsync(shortcut)
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
        console.log("Removing shortcut...", id)
        return await dbs.shortcuts.removeAsync({ _id: id }, { multi: false })
    } catch (e) {
        console.log('Error getting shortcuts', e)
    }
}



export const toggleBaseView = async (visiable: boolean) => {
    const mainService = useMainService()
    await mainService.toggleBaseView(visiable)
}
