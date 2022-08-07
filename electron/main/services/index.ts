import { Container } from 'inversify'

import {DatabaseService} from "./database"
import {MainService} from "./main";
import {UniversalService} from "./universal";

const container = new Container();

container.bind(MainService.key)
    .to(MainService).inSingletonScope()
container.bind(DatabaseService.key)
    .to(DatabaseService).inSingletonScope()
container.bind(UniversalService.key)
    .to(UniversalService).inSingletonScope()

export default container
