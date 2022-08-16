declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $appBridge: typeof window.appBridge
    }
}

export {}  // Important! See note.
