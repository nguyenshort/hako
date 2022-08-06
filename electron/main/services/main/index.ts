import {injectable} from "inversify";
import {app, BrowserWindow, shell} from "electron";
import {join} from "path"
import windowStateKeeper from "electron-window-state";
import {ROOT_PATH} from "../../index";

@injectable()
export class MainService {

    static key: symbol = Symbol.for('MainService')

    #win?: Electron.BrowserWindow

    constructor() {
        this.#init()
    }

    #init() {}

    #createMainWindow() {
        const preload = join(__dirname, '../preload/index.js')
        const iconPath = join(__dirname, app.isPackaged ? '../..' : '../../../public')

        const mainWindowState = windowStateKeeper({
            defaultWidth: 1024,
            defaultHeight: 768,
        })

        const options: Electron.BrowserWindowConstructorOptions = {
            title: 'Main window',
            icon: join(iconPath, 'favicon.ico'),
            width: mainWindowState.width,
            height: mainWindowState.height,
            titleBarOverlay: {
                height: 28, // 30px - 2px safety boundary to ensure buttons don't get taller than title bar
            },
            transparent : true,
            titleBarStyle : 'hiddenInset',
            webPreferences: {
                spellcheck: false,
                preload,
                // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
                // Consider using contextBridge.exposeInMainWorld
                // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
                nodeIntegration: true
            },
        }

        this.#win = new BrowserWindow(options)

        if(!this.#win) {
            app.exit(0)
            return
        }

        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
        const indexHtml = join(ROOT_PATH.dist, 'index.html')
        if (app.isPackaged) {
            this.#win.loadFile(indexHtml)
        } else {
            this.#win.loadURL(url)
            // Open devTool if the app is not packaged
            // win.webContents.openDevTools()
        }

        // Test actively push message to the Electron-Renderer
        this.#win.webContents.on('did-finish-load', () => {
            this.#win?.webContents.send('main-process-message', new Date().toLocaleString())
        })

        // Make all links open with the browser, not with the application
        this.#win.webContents.setWindowOpenHandler(({ url }) => {
            if (url.startsWith('https:')) shell.openExternal(url)
            return { action: 'deny' }
        })
    }
}
