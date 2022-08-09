import {injectable} from "inversify"

import Datastore from '@seald-io/nedb'
import type Nedb from "@seald-io/nedb"
import {IApp} from "../../../../shared/models/app";

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

    async getApps() {

    }

    async findApp(_id: string) {
        return this.apps.findOneAsync<IApp>({ _id })
    }

    async removeApp(_id: string) {
        return this.apps.findOneAsync<IApp>({ _id })
    }

    async updateApp(query: any, update: Record<any, any>) {
        return await this.apps.updateAsync(query, {
            $set: update
        }, { returnUpdatedDocs: true })
    }
}
