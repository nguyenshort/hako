export interface IApp {
    _id: string
    name: string
    icon: string
    url: string
    order?: number
    muted?: boolean
    isCustom?: boolean
}

export type ICreateShortcut = Pick<IApp, 'name' | 'icon' | 'url' | 'isCustom'>

export type ICallback = (...args: any[]) => void|Promise<void>
