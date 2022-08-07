export interface IShortcut {
    _id: string
    name: string
    icon: string
    url: string
    order?: number
    muted?: boolean
}

export type ICreateShortcut = Pick<IShortcut, 'name' | 'icon' | 'url'>

export type ICallback = (...args: any[]) => void|Promise<void>
