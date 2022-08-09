import {injectable} from "inversify";
import {app, BrowserView, BrowserWindow, WebPreferences} from "electron";
import {join} from "path"
import windowStateKeeper from "electron-window-state";
import {ROOT_PATH} from "../../index";
import {useAppService, useSpotlightService} from "../../composables";

@injectable()
export class UniversalService {

    static key: symbol = Symbol.for(UniversalService.name)

    win?: Electron.BrowserWindow

    universalView?: Electron.BrowserView

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
        this.insertToStackView('universal-view')
        // focus
    }

    /**
     * Thêm bớt view vào stack
     * @param view
     * @param removed
     */
    insertToStackView(view: string, removed?: boolean) {
        // Loại ra khỏi trong stack nếu đã có
        const _stacks = this.stackApps.filter(stack => stack !== view)

        if(!removed) {
            _stacks.unshift(view)
        }

        this.stackApps = _stacks

        console.log(`🌧 ${removed ? 'Removed' : 'Insert'} StackView:`, view)
    }

    /**
     * Tiêm universal view vào window
     */
    async injectUniversalView() {

        console.log('🌧 Injecting Universal view')

        if(!this.win) {
            // Không có windown => create
            return
        }

        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

        const view: Electron.BrowserView|undefined = await this.buildVueApp(url)
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

    /**
     * Tạo view mặc định. Vue App
     * @param url
     */
    async buildVueApp(url: string) {

        if(!this.win) {
            return
        }

        const preload = join(__dirname, '../preload/universal.js')
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
            view.webContents.openDevTools()
        }

        return view
    }

    /**
     * Show app chinhs
     */
    showUniversalView() {
        if(!this.universalView) {
            return
        }

        this.win?.setTopBrowserView(this.universalView)

        this.insertToStackView('universal-view')
        this.focusLastView()
    }

    notifyToUniversalView(event: string, data: any) {
        this.win?.emit(event, data)
        this.universalView?.webContents.send(event, data)
    }

    focusLastView() {
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
            const spotlightService = useSpotlightService()
            this.win.setTopBrowserView(spotlightService.view!)

            spotlightService.view?.webContents.focus()
        }

        this.notifyToUniversalView('focus-last-view', lastView)
    }
}
