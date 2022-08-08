import {ipcRenderer} from "electron"

let timerSpotlight = 0

window.addEventListener('keyup', async (e) => {
    if (e.key !== 'Shift') {
        return
    }
    if (Date.now() - timerSpotlight < 500) {
        await ipcRenderer.invoke('open-spotlight')
        return
    }

    timerSpotlight = Date.now()
})
