export interface AppDocument {
    _id: string
    name: string
    icon: string
    url: string
    order?: number
    muted?: boolean
    isCustom?: boolean
}
