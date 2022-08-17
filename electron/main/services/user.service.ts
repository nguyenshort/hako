import { app } from 'electron'
import {inject, injectable} from "inversify"
import consola from 'consola'
import {DatabaseService} from "./database.service"
import {UserDocument} from "@entities/user.entity";

@injectable()
export class UserService {

    static key: symbol = Symbol.for(UserService.name)
    private readonly logger = consola.withScope('UserService')

    user?: UserDocument

    constructor(
        @inject(DatabaseService.key) readonly databaseService: DatabaseService
    ) {}

    /**
     * Upsert user
     */
    async init() {
        this.user = await this.databaseService.getUser()
        if(!this.user) {
            this.logger.info('Creating new user')

            const lag = app.getLocale()

            const user: Partial<UserDocument> = {
                theme: 'auto',
                license: '',
                isActive: true,
                language: ['vi', 'en'].includes(lag) ? lag : 'en',
                lazyApp: false
            }
           this.user = (await this.databaseService.createUser(user)) as UserDocument
        }
        this.logger.success('UserService initialized')
    }

    async updateUser(input: Partial<UserDocument>) {
        if(!this.user) {
            await this.init()
        }
        if(!this.user) {
            return
        }
        this.user = Object.assign(this.user, input)
        return this.databaseService.updateUser(input)
    }
}
