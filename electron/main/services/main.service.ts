import {inject, injectable} from "inversify";
import {app as electronApp, BrowserView} from "electron"
import {join} from "path"
import consola from 'consola'
import {ROOT_PATH} from "../index";
import {IApp, IAppInput} from "../../../shared/models/app";
import {DatabaseService} from "./database.service";
import {useAppView} from "../composables/view";
import {useAllowedRoutes, useBaseURL, useMainWindow, useWebPrefs} from "../composables/browser"

@injectable()
export class MainService {

    static key: symbol = Symbol.for(MainService.name)

    private readonly logger = consola.withScope('MainService')

    win?: Electron.BrowserWindow
    // Danh sách các view đang được hiển thị
    views: Record<string, BrowserView> = {}
    // Stack các view đang được hiển thị
    stackViews: string[] = []
    // Danh sách các app của user đã cài
    apps: IApp[] = []

    constructor(
        @inject(DatabaseService.key) readonly databaseService: DatabaseService
    ) {}

    async init() {
        this.logger.success('🌧 Init MainService')
        // set list app
        const apps = await this.databaseService.apps()
        this.setApps(apps)
        this.win = useMainWindow()
        await this.pushRoute('/')
    }

    /**
     * Thêm bớt view vào stack
     * @param view
     * @param removed
     */
    pushToStackView(view: string, removed?: boolean) {
        // Loại ra khỏi trong stack nếu đã có
        const _stacks = this.stackViews.filter(stack => stack !== view)

        if(!removed) {
            _stacks.unshift(view)
        }

        this.stackViews = _stacks

        console.log(`🌧 ${removed ? 'Removed' : 'Insert'} StackView:`, view)
    }

    /**
     * Tiêm universal view vào window
     */
    async injectVueApp(route: string) {

        const baseURL = useBaseURL()
        const url = `${baseURL}${route}`

        console.log('🌧 Injecting Universal view')

        if(!this.win) {
            // Không có windown => create
            return
        }

        const view: Electron.BrowserView = new BrowserView({
            webPreferences: useWebPrefs(),
        })
        view.setBackgroundColor('rgba(255,255,255,0)')
        this.win.addBrowserView(view)

        const [width, height] = this.win.getContentSize()

        view.setBounds({
            x: route === '/' ? 0 : 75,
            y: 0,
            width: route === '/' ? width : width - 75,
            height: height
        })
        view.setAutoResize({
            width: true,
            height: true,
        })

        if (electronApp.isPackaged) {
            const indexHtml = join(ROOT_PATH.dist, 'index.html')
            await view.webContents.loadFile(indexHtml)
        } else {
            await view.webContents.loadURL(url)
            // Open devTool if the app is not packaged
            view.webContents.openDevTools()
        }


        view.webContents.on('did-finish-load', () => {
            view.webContents.send('main-process-message', new Date().toLocaleString())
        })

        view.webContents.setWindowOpenHandler(({ url }) => {
            console.log(url)
            // if (url.startsWith('https:')) shell.openExternal(url)
            return { action: 'deny' }
        })

        this.views[route] = view

       //  this.pushToStackView(route)
        console.log('🛰 Injected Universal:', route)
    }

    /**
     * Tạo browser view cho app có custom proxy...
     * @param _id
     */
    async injectApp(_id: string) {
        const app: IApp = await this.databaseService.findApp(_id)

        // Không có app trong db
        if(!app) {
            return
        }
        console.log(`Init App: ${app.name}`)

        /**
         * Đã tồn tại view này
         */
        if (this.views[_id]) {
            this.pushToStackView(_id)
            return
        }

        // Tạo view
        const view = await useAppView(app._id)

        this.win!.addBrowserView(view)
        const [width, height] = this.win!.getContentSize()

        view.setBounds({
            x: 75,
            y: 0,
            width: width - 75,
            height: height
        })
        view.setAutoResize({
            width: true,
            height: true,
        })

        if(!view) {
            return
        }

        await view.webContents.loadURL(app.url)

        view.webContents.on('did-finish-load', () => {
            view.webContents.send('main-process-message', new Date().toLocaleString())
        })

        view.webContents.setWindowOpenHandler(({ url }) => {
            console.log(url)
            // if (url.startsWith('https:')) shell.openExternal(url)
            return { action: 'deny' }
        })

        this.views[_id] = view
        // this.pushToStackView(_id)
    }

    /**
     * Navigation tới router tương ứng. Upsert ếu đã có router
     */
    async pushRoute(route: string, focus = true) {

        const lastID = this.stackViews[0]

        /**
         * push vaào view đang nằm trong top => prevent
         */
        if(lastID === route) {
            console.log('🌧 Route is same')

            // for spotlight
            if(route === '/spotlight') {
                // Nếu là spotlight => close... Toogle method
                return
            }

            return
        }

        // Nếu chưa có view => create
        if(!this.views[route]) {
            const routes = useAllowedRoutes()
            if(routes.includes(route)) {
                await this.injectVueApp(route)
            } else {
                await this.injectApp(route)
            }
        }
        this.pushToStackView(route)

        if(focus) {
            this.autoFocus()
        }
    }

    // Tự động active screen trên cùng dựa trên stack
    autoFocus() {
        console.log('🎯StackViews:', this.stackViews)
        if (!this.win) {
            return
        }
        const lastView: string = this.stackViews[0]

        if(!lastView) {
            return electronApp.exit(0)
        }

        const viewID = lastView.replace('app-', '')
        console.log('🌧 Focus To:', viewID)

        if(!this.views[viewID]) {
            return
        }
        this.win.setTopBrowserView(this.views[viewID])
        this.views[viewID].webContents.focus()

        // Push event to mainview
        this.views['/'].webContents.send('focused:change', this.stackViews)
    }

    /**
     * CURD App
     */

    findApp(_id: string) {
        const index = this.apps.findIndex(app => app._id === _id)
        return {
            index,
            app: this.apps[index]
        }
    }

    /**
     * tạo app vào db và gửi sự kiện cho Vue
     * @param input
     */
    async createApp(input: IAppInput) {
        this.logger.info("Creating app...", input.name)
        const app = await this.databaseService.createApp(input) as IApp

        this.logger.success('🌧 Created App:', app)

        this.emitToVue('app:created', app)

        this.setApps([app, ...this.apps])
        return app
    }

    /**
     * Cập nhật danh sách apps và gửi lại cho vue
     * @param apps
     */
    setApps(apps: IApp[]) {
        this.apps = apps
        this.emitToVue('apps:set', apps)
    }

    emitToVue(event: string, data?: any) {
        useAllowedRoutes().map((route) => this.views[route] && this.views[route].webContents.send(event, data))
    }

    /**
     * Xoas app ra khỏi db và window
     * @param _id
     */
    async removeApp(_id: string) {
        console.log('Remove view:', _id)
        // Xoá ra khỏi views
        if (this.views[_id]) {
            this.win?.removeBrowserView(this.views[_id])
            delete this.views[_id]
            this.pushToStackView(_id, true)

            // Thay đổi focus hiện tại
            this.autoFocus()
        }
        // Xoá ra khỏi db
        console.log('🌧 Remove App:', _id)
        await this.databaseService.removeApp(_id)

        // Gửi event
        this.setApps(this.apps.filter(app => app._id !== _id))
        this.emitToVue('app:removed', _id)
    }

    /**
     * Cập nhật app trong apps và trong db
     * @param _id
     * @param input
     */
    async updateApp(_id: string, input: Partial<Omit<IApp, '_id'>>) {

        const index = this.apps.findIndex(app => app._id === _id)
        if(index === -1) {
            return
        }
        const app = { ...this.apps[index], ...input }
        await this.databaseService.updateApp(_id, app)
        this.setApps([...this.apps.slice(0, index), app, ...this.apps.slice(index + 1)])
        this.emitToVue('app:updated', app)
    }

    /**
     * Tìm app theo _id
     * Update muted theo app tìm thấy ở trên
     * @param _id
     */
    async toggleMutedApp(_id: string) {
        this.logger.debug('🌧 Toggle Muted App:', _id)
        const { index } = this.findApp(_id)
        if(index === -1) {
            return
        }
        // Cập nhật db
        await this.updateApp(_id, { muted: !this.apps[index].muted })
        // Cập nhật view
        if(this.views[_id]) {
            this.views[_id].webContents.audioMuted = !this.apps[index].muted
        }
        this.logger.success('🌧 Muted App:', _id, this.apps[index].muted)
        // Gửi sự kiện
        this.emitToVue('app:mute:change', this.apps[index])

    }

}
