import UserAgent from 'user-agents'
import {useSession} from "./session";
import {BrowserView, WebPreferences} from "electron"

import {join} from "path";

/**
 * Tạo view to web mục tiêu
 * B1: Tạo UserAgent
 * B2: Custom session
 * Todo: Fix secure context error
 */
export const useUniversalView = async (id: string) => {

    // Custom: UserAgent. Đây là object
    const userAgent = new UserAgent().toString()
    console.log('🔥 User Agent')

    // Custom: session
    const session = useSession(id)
    const sharedWebPreferences = useWebPrefs()
    sharedWebPreferences.session = session
    console.log('🔥 Session')

    const view: Electron.BrowserView = new BrowserView({
        webPreferences: sharedWebPreferences,
    })

    view.webContents.setUserAgent(userAgent)

    view.setBackgroundColor('#FFFFFFFF')

    return view
}

const useWebPrefs = (): WebPreferences => {

    const preload = join(__dirname, '../../../../preload/universal.js')

    return {
        spellcheck: false,
        nodeIntegration: false,
        contextIsolation: true,
        plugins: true,
        scrollBounce: true,
        preload
    }
}
