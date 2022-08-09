import {BrowserWindow, WebPreferences} from "electron"
import {join} from "path"
import windowStateKeeper from "electron-window-state";

export const useMainWindow = (): Electron.BrowserWindow => {
    const mainWindowState = windowStateKeeper({
        defaultWidth: 990,
        defaultHeight: 768,
    })

    return  new BrowserWindow({
        title: 'Hako Apps',
        width: mainWindowState.width,
        height: mainWindowState.height,
        transparent : true,
        titleBarStyle : 'hidden'
    })
}

export const useAllowedRoutes = () => ['/', '/spotlight', '/settings', '/apps']

export const useBaseURL = () => `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

export const useWebPrefs = (): WebPreferences => {

    // ../preload/index.js
    const preload = join(__dirname, '../preload/index.js')

    return {
        spellcheck: false,
        nodeIntegration: false,
        contextIsolation: true,
        plugins: true,
        scrollBounce: true,
        preload
    }
}
