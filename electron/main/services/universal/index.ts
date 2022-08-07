import {inject, injectable} from "inversify"
import type { BrowserView } from "electron";
import {MainService} from "../main";
import {useUniversalView} from "./composables/view";
import {DatabaseService} from "../database";
import {IShortcut} from "@shared/interface/shortcut";

@injectable()
export class UniversalService {

    static key: symbol = Symbol.for('UniversalService')

    views: Record<string, BrowserView> = {}

    constructor(
        @inject(MainService.key) readonly mainService: MainService,
        @inject(DatabaseService.key) readonly databaseService: DatabaseService
    ) {}

    async upsertView(_id: string) {

        if(!this.mainService.win) {
            return
        }

        const shortcut: IShortcut = await this.getShortcut(_id)
        // Không có shortcut trong db
        if(!shortcut) {
            return
        }
        console.log('Init view for shortcut:', shortcut.name)

        /**
         * Đã tồn tại view này
         * Todo: Focus view
         */
        if (this.views[_id]) {
            return
        }

        const view = await useUniversalView(_id)
        view.webContents.audioMuted = true

        await this.injectView(view, shortcut)
    }

    async getShortcut(_id: string) {
        try {
          return this.databaseService.shortcuts.findOneAsync({_id})
        } catch (e) {}
    }

    async injectView(view: BrowserView, shortcut: IShortcut) {
        if(!this.mainService.win) {
            return
        }

        this.mainService.win.addBrowserView(view)
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

        await view.webContents.loadURL(shortcut.url)

        this.views[shortcut._id] = view
        await this.mainService.notifyToBaseView('injected-universal-view', shortcut._id)
        console.log('Injected view:', shortcut.name)
    }

    async togggleView(_id: string) {
        console.log('Toggle view:', _id)
        if(!this.mainService.win) {
            return
        }
        const view = this.views[_id]
        if(!view) {
            // Không có view này
            return
        }
        this.mainService.win.setTopBrowserView(view)
    }

    async removeView(_id: string) {
        console.log('Remove view:', _id)
        if(!this.mainService.win) {
            return
        }
        const view = this.views[_id]
        if(!view) {
            // Không có view này
            return
        }
        this.mainService.win.removeBrowserView(view)
        delete this.views[_id]
    }
}
