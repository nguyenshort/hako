import {ICreateShortcut} from "@shared/interface/shortcut"
import type Nedb from "@seald-io/nedb"

export const createShortcutHandle = async (db: Nedb, shortcut: ICreateShortcut) => {
    console.log("Creating shortcut...", shortcut.name)
    try {
        await db.insertAsync(shortcut)
    } catch (e) {
        console.log('Error creating shortcut', e)
    }
}

export const getShortcutsHandle = async (db: Nedb) => {
    try {
        return await db.findAsync({})
            .sort({order: 1})
    } catch (e) {
        console.log('Error getting shortcuts', e)
    }
}

export const removeShortcutsHandle = async (db: Nedb, id: string) => {
    try {
        console.log("Removing shortcut...", id)
        return await db.removeAsync({ _id: id }, { multi: false })
    } catch (e) {
        console.log('Error getting shortcuts', e)
    }
}
