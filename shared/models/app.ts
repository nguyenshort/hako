export interface IApp {
    _id: string
    name: string
    icon: string
    url: string
    order?: number
    muted?: boolean
    isCustom?: boolean
}

export type IAppInput = Partial<Omit<IApp, '_id'>>

export type ICallback = (...args: any[]) => void|Promise<void>
