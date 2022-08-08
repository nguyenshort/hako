import { Container } from 'inversify'

import {DatabaseService} from "./database"
import {MainService} from "./main";
import {AppService} from "./app";

const container = new Container();

container.bind(MainService.key)
    .to(MainService).inSingletonScope()
container.bind(DatabaseService.key)
    .to(DatabaseService).inSingletonScope()
container.bind(AppService.key)
    .to(AppService).inSingletonScope()

export default container
