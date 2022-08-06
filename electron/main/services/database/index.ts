import {injectable} from "inversify"

import Datastore from '@seald-io/nedb'
import type Nedb from "@seald-io/nedb"

@injectable()
export class DatabaseService {
    static key: symbol = Symbol.for('DatabaseService')

    user: Nedb = new Datastore({ filename: 'database/user' })
    shortcuts: Nedb = new Datastore({ filename: 'database/shortcut' })

    async init() {
        await Promise.all([
            this.user.loadDatabaseAsync(),
            this.shortcuts.loadDatabaseAsync()
        ])
    }
}
