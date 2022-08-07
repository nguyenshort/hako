export interface IShortcut {
    _id: string
    name: string
    icon: string
    url: string
    order?: number
}

export type ICreateShortcut = Pick<IShortcut, 'name' | 'icon' | 'url'>

export type ICallback = (...args: any[]) => void|Promise<void>
