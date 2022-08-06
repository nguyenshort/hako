import Datastore from '@seald-io/nedb'
import type Nedb from "@seald-io/nedb"

export type IHakoDatabase = Record<'shortcuts' | 'user', Nedb>
const db: IHakoDatabase = {
    shortcuts: new Datastore({ filename: 'database/shortcut' }),
    user: new Datastore({ filename: 'database/user' })
}

export default db
