import {useUniversalService} from "../composables";

export const initUniversalViewHandle = async (_id: string) => {
    const universalService = useUniversalService()
    await universalService.upsertView(_id)
}
