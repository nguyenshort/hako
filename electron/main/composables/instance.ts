import {DatabaseService} from "../services/database.service";
import container from "../services";
import {MainService} from "../services/main.service";

export const useDatabase = (): DatabaseService => {
    return container.get<DatabaseService>(DatabaseService.key)
}

export const useMainServie = (): MainService => {
    return container.get<MainService>(MainService.key)
}
