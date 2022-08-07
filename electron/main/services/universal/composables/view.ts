import UserAgent from 'user-agents'
import {useSession} from "./session";
import {BrowserView, WebPreferences} from "electron"

/**
 * Tạo view to web mục tiêu
 * B1: Tạo UserAgent
 * B2: Custom session
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
    return {
        spellcheck: false,
        nodeIntegration: false,
        contextIsolation: true,
        plugins: true, // PDF reader
        scrollBounce: true
    }
}
