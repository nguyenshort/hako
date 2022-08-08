import {injectable} from "inversify";
import {app, BrowserView, BrowserWindow, WebPreferences} from "electron";
import {join} from "path"
import windowStateKeeper from "electron-window-state";
import {ROOT_PATH} from "../../index";
import {useAppService} from "../../composables";

@injectable()
export class MainService {

    static key: symbol = Symbol.for(MainService.name)

    win?: Electron.BrowserWindow

    universalView?: Electron.BrowserView

    spotlightView?: Electron.BrowserView
    isOpenedSpotlight: boolean = false

    stackApps: string[] = []

    async createMainWindow() {

        console.log('Creating main window')

        const mainWindowState = windowStateKeeper({
            defaultWidth: 990,
            defaultHeight: 768,
        })

        this.win = new BrowserWindow({
            title: 'Hako Apps',
            width: mainWindowState.width,
            height: mainWindowState.height,
            transparent : true,
            titleBarStyle : 'hidden'
        })

        if(!this.win) {
            app.exit(0)
            return
        }
        await this.injectUniversalView()

        // inject to stacks
        this.insertViewStack('universal-view')
        // focus
    }

    insertViewStack(view: string, removed?: boolean) {
        // Loại ra khỏi trong stack nếu đã có
        const _stacks = this.stackApps.filter(stack => stack !== view)

        if(!removed) {
            _stacks.unshift(view)
        }

        this.stackApps = _stacks

        console.log(`🌧 ${removed ? 'Removed' : 'Insert'} View stacks:`, view)
    }

    async injectUniversalView() {

        console.log('🌧 Injecting base view')

        if(!this.win) {
            // Không có windown => create
            await this.createMainWindow()
            return
        }

        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

        const view: Electron.BrowserView|undefined = await this.buildBaseView(url)
        if(!view) {
            return
        }

        view.webContents.on('did-finish-load', () => {
            view.webContents.send('main-process-message', new Date().toLocaleString())
        })

        view.webContents.setWindowOpenHandler(({ url }) => {
            console.log(url)
            // if (url.startsWith('https:')) shell.openExternal(url)
            return { action: 'deny' }
        })

        this.universalView = view
        console.log('🛰 Injected universal view ')
    }

    async buildBaseView(url: string) {

        if(!this.win) {
            // Không có windown => create
            await this.createMainWindow()
            return
        }

        const preload = join(__dirname, '../preload/index.js')
        const indexHtml = join(ROOT_PATH.dist, 'index.html')

        const options: WebPreferences = {
            spellcheck: false,
            preload,
            nodeIntegration: false
        }

        const view: Electron.BrowserView = new BrowserView({
            webPreferences: options,
        })

        view.setBackgroundColor('rgba(255,255,255,0)')
        this.win.addBrowserView(view)
        const [width, height] = this.win.getContentSize()

        view.setBounds({
            x: 0,
            y: 0,
            width: width,
            height: height
        })
        view.setAutoResize({
            width: true,
            height: true,
        })

        if (app.isPackaged) {
            await view.webContents.loadFile(indexHtml)
        } else {
            await view.webContents.loadURL(url)
            // Open devTool if the app is not packaged
            // view.webContents.openDevTools()
        }

        return view
    }

    async toggleUniversalView() {
        if(!this.universalView) {
            await this.injectUniversalView()
            await this.toggleUniversalView()
            return
        }

        this.win?.setTopBrowserView(this.universalView)

        this.insertViewStack('universal-view')
        await this.focusLastView()
    }

    notifyToBaseView(event: string, data: any) {
        this.win?.emit(event, data)
        this.universalView?.webContents.send(event, data)
    }

    /**
     * Thực ra là toggle spotlight view
     */
    async openSpotlight() {

        console.log('🌧 Toggle spotlight')

        const build = async () => {
            const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/spotlight`

            const view: Electron.BrowserView = (await this.buildBaseView(url))!

            view.webContents.on('did-finish-load', () => {
                view.webContents.send('main-process-message', new Date().toLocaleString())
            })

            view.webContents.setWindowOpenHandler(({url}) => {
                console.log(url)
                // if (url.startsWith('https:')) shell.openExternal(url)
                return {action: 'deny'}
            })

            this.win!.addBrowserView(view)

            /**
             * Set bounds
             * Mặc dù không thích điều này. Những ko change order của windows dc
             * @link https://github.com/electron/electron/issues/15899
             */
            const [width, height] = this.win!.getContentSize()
            view.setBounds({
                x: 75,
                y: 0,
                width: width - 75,
                height: height
            })

            this.spotlightView = view
            console.log('🛰 Injected spotlight view ')
            this.win?.addBrowserView(this.spotlightView)
        }

        // đang mở => đóng
        if(this.isOpenedSpotlight) {
            console.log('🌧 Close spotlight')
            this.isOpenedSpotlight = false

            if(this.spotlightView) {
                // effect
                // this.win?.removeBrowserView(this.spotlightView!)
                /**
                 * Xoá view sẽ tạo ra độ trễ không mong muốn
                 */
                // this.spotlightView = undefined
                this.insertViewStack('spotlight-view', true)

                setTimeout(() => {
                    this.spotlightView?.webContents.send('toggle-spotlight', false)
                }, 400)
            }

        }

        // đang đóng => mở
        else {
            console.log('🌧 Open spotlight')
            this.isOpenedSpotlight = true
            if(!this.spotlightView) {
                console.log('🌧 Build spotlight view')
                await build()
            } else {
                // this.win?.addBrowserView(this.spotlightView)
            }
            this.insertViewStack('spotlight-view')
            this.spotlightView?.webContents.send('toggle-spotlight', true)
            // this.spotlightView?.webContents?.openDevTools()
        }

        // focus vào view gần nhất
        await this.focusLastView()
    }

    async focusLastView() {
        console.log('🎯Focus last view', this.stackApps)
        if (!this.win) {
            return
        }
        const lastView: string = this.stackApps[0]!
        if(lastView.startsWith('app-')) {

            console.log('🌧 Focus universal view')
            const universalService = useAppService()
            const viewID = lastView.replace('app-', '')

            const view = universalService.views[viewID]
            this.win.setTopBrowserView(view)
            view.webContents?.focus()

        } else if(lastView === 'universal-view') {
            console.log('🌧 Focus base view')
            this.win.setTopBrowserView(this.universalView!)
            this.universalView?.webContents.focus()
        } else if(lastView === 'spotlight-view') {
            console.log('🌧 Focus spotlight view')
            this.win.setTopBrowserView(this.spotlightView!)
            this.spotlightView?.webContents.focus()
        }

        this.notifyToBaseView('focus-last-view', lastView)
    }
}
