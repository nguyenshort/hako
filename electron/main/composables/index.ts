import {DatabaseService} from "../services/database";
import container from "../services";
import {MainService} from "../services/main";
import {AppService} from "../services/app";

export const useDatabase = (): DatabaseService => {
    return container.get<DatabaseService>(DatabaseService.key)
}

export const useMainService = (): MainService => {
    return container.get<MainService>(MainService.key)
}

export const useUniversalService= (): AppService => {
    return container.get<AppService>(AppService.key)
}
