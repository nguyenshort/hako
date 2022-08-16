import {injectable} from "inversify"

import Datastore from '@seald-io/nedb'
import type Nedb from "@seald-io/nedb"
import {AppDocument, IAppInput} from "../../../src/entities/app.entity";

@injectable()
export class DatabaseService {
    static key: symbol = Symbol.for(DatabaseService.name)

    user: Nedb = new Datastore<AppDocument>({ filename: 'database/user' })
    app: Nedb = new Datastore({ filename: 'database/apps' })

    /**
     * Todo: fix in production
     * @Link https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/76
     */
    async init() {
        await Promise.all([
            this.user.loadDatabaseAsync(),
            this.app.loadDatabaseAsync()
        ])
    }

    /**
     * App Query
     */
    async apps() {
        return this.app.findAsync({})
            .sort({order: 1})
    }

    async createApp(input: IAppInput) {
        return this.app.insertAsync(input)
    }

    async findApp(_id: string) {
        return this.app.findOneAsync<AppDocument>({ _id })
    }

    async removeApp(_id: string) {
        return this.app.removeAsync({ _id }, { multi: false })
    }

    async updateApp(query: any, update: Record<any, any>) {
        return await this.app.updateAsync(query, {
            $set: update
        }, { returnUpdatedDocs: true })
    }
}
