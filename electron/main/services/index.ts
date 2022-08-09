import { Container } from 'inversify'

import {DatabaseService} from "./database"
import {UniversalService} from "./universal";
import {AppService} from "./app";
import {SpotlightService} from "./spotlight";

const container = new Container();

container.bind(UniversalService.key)
    .to(UniversalService).inSingletonScope()
container.bind(DatabaseService.key)
    .to(DatabaseService).inSingletonScope()
container.bind(AppService.key)
    .to(AppService).inSingletonScope()
container.bind(SpotlightService.key)
    .to(SpotlightService).inSingletonScope()

export default container
