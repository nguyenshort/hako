import {injectable} from "inversify";
import {app, BrowserWindow, shell} from "electron";
import {join} from "path"
import windowStateKeeper from "electron-window-state";
import {ROOT_PATH} from "../../index";

@injectable()
export class MainService {

    static key: symbol = Symbol.for('MainService')

    win?: Electron.BrowserWindow

    constructor() {
        this.#init()
    }

    #init() {}
    async createMainWindow(preload: string) {
        const mainWindowState = windowStateKeeper({
            defaultWidth: 1024,
            defaultHeight: 768,
        })

        const options: Electron.BrowserWindowConstructorOptions = {
            title: 'Main window',
            icon: join(ROOT_PATH.public, 'favicon.ico'),
            width: mainWindowState.width,
            height: mainWindowState.height,
            transparent : true,
            titleBarStyle : 'hidden',
            webPreferences: {
                spellcheck: false,
                preload,
                nodeIntegration: false
            },
        }

        this.win = new BrowserWindow(options)

        if(!this.win) {
            app.exit(0)
            return
        }

        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
        const indexHtml = join(ROOT_PATH.dist, 'index.html')
        if (app.isPackaged) {
            await this.win.loadFile(indexHtml)
        } else {
            await this.win.loadURL(url)
            // Open devTool if the app is not packaged
            // win.webContents.openDevTools()
        }

        // Test actively push message to the Electron-Renderer
        this.win.webContents.on('did-finish-load', () => {
            this.win?.webContents.send('main-process-message', new Date().toLocaleString())
        })

        // Make all links open with the browser, not with the application
        this.win.webContents.setWindowOpenHandler(({ url }) => {
            if (url.startsWith('https:')) shell.openExternal(url)
            return { action: 'deny' }
        })
    }
}
