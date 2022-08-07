import {DatabaseService} from "../services/database";
import container from "../services";
import {MainService} from "../services/main";
import {UniversalService} from "../services/universal";

export const useDatabase = (): DatabaseService => {
    return container.get<DatabaseService>(DatabaseService.key)
}

export const useMainService = (): MainService => {
    return container.get<MainService>(MainService.key)
}

export const useUniversalService= (): UniversalService => {
    return container.get<UniversalService>(UniversalService.key)
}
