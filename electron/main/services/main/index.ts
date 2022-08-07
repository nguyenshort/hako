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

    constructor() {
        this.#init()
    }

    #init() {}
    async createMainWindow() {

        console.log('Creating main window')

        const mainWindowState = windowStateKeeper({
            defaultWidth: 1024,
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

        const preload = join(__dirname, '../preload/index.js')
        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
        const indexHtml = join(ROOT_PATH.dist, 'index.html')

        const options: WebPreferences = {
            spellcheck: false,
            preload,
            nodeIntegration: false
        }

        const view: Electron.BrowserView = new BrowserView({
            webPreferences: options,
        })

        view.setBackgroundColor('#FFFFFFFF')
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

        this.baseView = view
        console.log('🛰 Injected base view ')
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
}
