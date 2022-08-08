import {useAppService} from "../composables";

export const initUniversalViewHandle = async (_id: string, auto?: boolean) => {
    const universalService = useAppService()
    await universalService.upsertView(_id, auto)
}

export const toggleUniversalViewHandle = async (_id: string) => {
    const universalService = useAppService()
    await universalService.togggleView(_id)
}

export const toggleMutedViewHandle = async (_id: string) => {
    const universalService = useAppService()
    await universalService.toggleMutedView(_id)
}
