import {useUniversalService} from "../composables";

export const initUniversalViewHandle = async (_id: string) => {
    const universalService = useUniversalService()
    await universalService.upsertView(_id)
}

export const toggleUniversalViewHandle = async (_id: string) => {
    const universalService = useUniversalService()
    await universalService.togggleView(_id)
}

export const toggleMutedViewHandle = async (_id: string) => {
    const universalService = useUniversalService()
    await universalService.toggleMutedView(_id)
}
