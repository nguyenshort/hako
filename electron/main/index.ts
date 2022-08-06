import "reflect-metadata"
import { app, BrowserWindow, ipcMain, session, protocol } from 'electron'
import { release, homedir } from 'os'
import { join } from 'path'
import {eventsRegister} from "./events";
import * as path from "path"
import {useDatabase, useMainService} from "./composables";

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '../..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}


const databaseService = useDatabase()
const mainService = useMainService()


// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
// const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
// const indexHtml = join(ROOT_PATH.dist, 'index.html')

async function createWindow() {

  try {
    await databaseService.init()
  } catch (e) {
    app.exit(0)
  }

  eventsRegister()

  await mainService.createMainWindow(preload)
}

/**
 * @link https://www.electronjs.org/docs/latest/tutorial/devtools-extension
 */
const vueDevToolsPath = path.join(
    homedir(),
    '/Library/Application Support/Google/Chrome/Default/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/6.2.1_0'
)

const PROTOCOL_PREFIX = 'hakox'
app.whenReady().then(async () => {
  protocol.registerHttpProtocol(PROTOCOL_PREFIX, (req, cb) => {
    console.log('HTTP request', req.url)
  })
  await createWindow()
  await session.defaultSession.loadExtension(vueDevToolsPath)
})

app.on('window-all-closed', () => {
  mainService.win = undefined
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (mainService.win) {
    // Focus on the main window if the user tried to open another
    if (mainService.win.isMinimized()) mainService.win.restore()
    mainService.win.focus()
  }
})

app.on('activate', async () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    await createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  })

/*  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }*/
})
