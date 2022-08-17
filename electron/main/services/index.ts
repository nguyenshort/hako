import { Container } from 'inversify'

import {DatabaseService} from "./database.service"
import {MainService} from "./main.service";
import {UserService} from "./user.service";

const container = new Container();

container.bind(DatabaseService.key)
    .to(DatabaseService).inSingletonScope()
container.bind(UserService.key)
    .to(UserService).inSingletonScope()
container.bind(MainService.key)
    .to(MainService).inSingletonScope()

export default container
