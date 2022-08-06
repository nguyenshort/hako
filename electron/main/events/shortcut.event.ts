import {IShortcut} from "../interface/shortcut"
import type Nedb from "@seald-io/nedb"

export const createShortcutHandle = async (db: Nedb, shortcut: IShortcut) => {
    console.log("Creating shortcut...", shortcut.name)
    try {
        await db.insertAsync(shortcut)
    } catch (e) {
        console.log('Error creating shortcut', e)
    }
}

export const responseShortcutsHandle = async (db: Nedb) => {
    try {
        return await db.findAsync({})
    } catch (e) {
        console.log('Error getting shortcuts', e)
    }
}
