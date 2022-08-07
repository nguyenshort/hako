import {ipcRenderer} from "electron"

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
    return new Promise(resolve => {
        if (condition.includes(document.readyState)) {
            resolve(true)
        } else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true)
                }
            })
        }
    })
}

let timerSpotlight = 0

domReady().then(() => {
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
})
