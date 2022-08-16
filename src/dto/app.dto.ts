import {AppDocument} from "@entities/app.entity"

export type CreateAppInput = Partial<Omit<AppDocument, '_id'>>
export type UpdateAppsOrderInput = Array<Pick<AppDocument, '_id' | 'order'>>
