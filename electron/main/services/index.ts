import { Container } from 'inversify'

import {DatabaseService} from "./database.service"
import {MainService} from "./main.service";

const container = new Container();

container.bind(MainService.key)
    .to(MainService).inSingletonScope()
container.bind(DatabaseService.key)
    .to(DatabaseService).inSingletonScope()

export default container
