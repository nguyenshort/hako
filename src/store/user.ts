import { defineStore } from 'pinia'
import {UserDocument} from "@entities/user.entity";

interface State extends Record<string, any> {
    user?: UserDocument
}

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useUserStore = defineStore('user', {
    state: (): State => ({
        user: undefined
    }),
    getters: {},
    actions: {
        setUser(_user: UserDocument) {
            this.user = _user
        }
    }
})
