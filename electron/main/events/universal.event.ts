import {ICreateShortcut} from "@shared/interface/shortcut"
import type Nedb from "@seald-io/nedb"

export const initUniversalViewHandle = async (db: Nedb, _id: string) => {
    console.log('Request init universal view:', _id)
}
