import {DatabaseService} from "../services/database";
import container from "../services";

export const useDatabase = (): DatabaseService => {
    return container.get<DatabaseService>(DatabaseService.key)
}
