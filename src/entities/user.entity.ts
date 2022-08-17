export interface UserDocument {
    _id: string
    license?: string
    isActive?: boolean
    theme?: 'auto' | 'light' | 'dark' | string
    lazyApp?: boolean
    language?: string
}
