import {injectable} from "inversify";
import {app, BrowserView, BrowserWindow, WebPreferences} from "electron";
import {join} from "path"
import windowStateKeeper from "electron-window-state";
import {ROOT_PATH} from "../../index";

@injectable()
export class MainService {

    static key: symbol = Symbol.for('MainService')

    win?: Electron.BrowserWindow

    baseView?: Electron.BrowserView

    spotlightView?: Electron.BrowserView
    opendSpotlight: boolean = false

    constructor() {
        this.#init()
    }

    #init() {}
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
        await this.injectBaseView()
    }

    async injectBaseView() {

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

        this.baseView = view
        console.log('🛰 Injected base view ')
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

    async toggleBaseView(visible: boolean) {
        if(!this.baseView) {
            await this.injectBaseView()
            await this.toggleBaseView(visible)
            return
        }

        if(visible) {
           this.win?.setTopBrowserView(this.baseView)
        }
    }

    notifyToBaseView(event: string, data: any) {
        this.win?.emit(event, data)
        this.baseView?.webContents.send(event, data)
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

            this.spotlightView = view
        }

        // đang mở => đóng
        if(this.opendSpotlight) {
            console.log('🌧 Close spotlight')
            this.opendSpotlight = false

            if(this.spotlightView) {
                this.win?.removeBrowserView(this.spotlightView)
            }

            return
        }

        // đang đóng => mở
        else {
            console.log('🌧 Open spotlight')
            this.opendSpotlight = true
            if(!this.spotlightView) {
                console.log('🌧 Build spotlight view')
                await build()
            } else {
                this.win?.addBrowserView(this.spotlightView)
            }

            // this.spotlightView?.webContents?.openDevTools()
        }
    }
}
