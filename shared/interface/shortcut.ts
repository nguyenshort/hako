export interface IShortcut {
    _id: string
    name: string
    icon: string
    url: string
    order?: number
}

export type ICreateShortcut = Pick<IShortcut, 'name' | 'icon' | 'url'>
