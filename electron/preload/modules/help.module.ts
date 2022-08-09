import {contextBridge, ipcRenderer} from "electron"
import {helpAPIS} from "../../../shared/api";

let timerSpotlight = 0
let block = false

window.addEventListener('keyup', async (e) => {
    if(block) {
        return
    }
    if (e.key !== 'Shift') {
        return
    }
    if (Date.now() - timerSpotlight < 500) {
        block = true
        await ipcRenderer.invoke('open-spotlight')

        block = true

        setTimeout(() => {
            block = false
        }, 300)

    }

    timerSpotlight = Date.now()
})


contextBridge.exposeInMainWorld('helpFn', helpAPIS)
