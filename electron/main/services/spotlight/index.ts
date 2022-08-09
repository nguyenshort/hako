import {inject, injectable} from "inversify"
import {UniversalService} from "../universal";
import {DatabaseService} from "../database";
import {join} from "path";
import {ROOT_PATH} from "../../index";
import {app, BrowserView} from "electron";

@injectable()
export class SpotlightService {

    static key: symbol = Symbol.for(SpotlightService.name)

    view?: Electron.BrowserView
    isOpened: boolean = false

    constructor(
        @inject(UniversalService.key) readonly mainService: UniversalService,
        @inject(DatabaseService.key) readonly databaseService: DatabaseService
    ) {}

    async #build() {
        if(!this.mainService.win) {
            return
        }

        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/spotlight`
        const preload = join(__dirname, '../preload/index.js')
        const indexHtml = join(ROOT_PATH.dist, 'index.html')

        const view: Electron.BrowserView = new BrowserView({
            webPreferences: {
                spellcheck: false,
                preload,
                nodeIntegration: false
            },
        })
        view.setBackgroundColor('rgba(255,255,255,0)')

       //  this.mainService.win.addBrowserView(view)

        const [width, height] = this.mainService.win.getContentSize()
        view.setBounds({
            x: 75,
            y: 0,
            width: width - 75,
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

        this.view = view
        this.mainService.win.addBrowserView(this.view)
    }

    /**
     * Thực ra là toggle spotlight view
     */
    async show() {

        console.log('🌧 Toggle spotlight')

        // đang mở => đóng
        if(this.isOpened) {
            console.log('🌧 Close spotlight')
            this.isOpened = false

            if(this.view) {
                // effect
                // this.win?.removeBrowserView(this.spotlightView!)
                /**
                 * Xoá view sẽ tạo ra độ trễ không mong muốn
                 */
                // this.spotlightView = undefined
                this.mainService.insertToStackView('spotlight-view', true)

                setTimeout(() => {
                    this.view?.webContents.send('toggle-spotlight', false)
                }, 400)
            }

        }

        // đang đóng => mở
        else {
            console.log('🌧 Open spotlight')
            this.isOpened = true
            if(!this.view) {
                console.log('🌧 Build spotlight view')
                await this.#build()
            } else {
                // this.win?.addBrowserView(this.spotlightView)
            }
            this.mainService.insertToStackView('spotlight-view')
            this.view?.webContents.send('toggle-spotlight', true)
            // this.spotlightView?.webContents?.openDevTools()
        }

        // focus vào view gần nhất
        await this.mainService.focusLastView()
    }
}
