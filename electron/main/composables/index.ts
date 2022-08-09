import {DatabaseService} from "../services/database";
import container from "../services";
import {UniversalService} from "../services/universal";
import {AppService} from "../services/app";
import {SpotlightService} from "../services/spotlight";

export const useDatabase = (): DatabaseService => {
    return container.get<DatabaseService>(DatabaseService.key)
}

export const useMainService = (): UniversalService => {
    return container.get<UniversalService>(UniversalService.key)
}

export const useAppService= (): AppService => {
    return container.get<AppService>(AppService.key)
}


export const useSpotlightService = (): SpotlightService => {
    return container.get<SpotlightService>(SpotlightService.key)
}
