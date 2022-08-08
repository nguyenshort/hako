import {injectable} from "inversify"

import Datastore from '@seald-io/nedb'
import type Nedb from "@seald-io/nedb"

@injectable()
export class DatabaseService {
    static key: symbol = Symbol.for(DatabaseService.name)

    user: Nedb = new Datastore({ filename: 'database/user' })
    apps: Nedb = new Datastore({ filename: 'database/apps' })

    async init() {
        await Promise.all([
            this.user.loadDatabaseAsync(),
            this.apps.loadDatabaseAsync()
        ])
    }
}
