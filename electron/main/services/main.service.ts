import {injectable} from "inversify";
import {app, BrowserWindow} from "electron";
import {join} from "path";

export const ROOT_PATH = {
    // /dist
    dist: join(__dirname, '../..'),
    // /dist or /public
    public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

const preload = join(__dirname, '../preload/index.js')

@injectable()
export class MainService {
    #win?: Electron.BrowserWindow

    constructor() {
        this.#init()
    }

    #init() {}

    #createMainWindow() {
        this.#win = new BrowserWindow({
            title: 'Main window',
            icon: join(ROOT_PATH.public, 'favicon.ico'),
            frame: false,
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
        })
    }
}
