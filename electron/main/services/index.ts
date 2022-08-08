import { Container } from 'inversify'

import {DatabaseService} from "./database"
import {UniversalService} from "./universal";
import {AppService} from "./app";

const container = new Container();

container.bind(UniversalService.key)
    .to(UniversalService).inSingletonScope()
container.bind(DatabaseService.key)
    .to(DatabaseService).inSingletonScope()
container.bind(AppService.key)
    .to(AppService).inSingletonScope()

export default container
