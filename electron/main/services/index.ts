import { Container } from 'inversify'

import {DatabaseService} from "./database"

const container = new Container();

container.bind(DatabaseService.key)
    .to(DatabaseService).inSingletonScope();

export default container
