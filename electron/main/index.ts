import "reflect-metadata"
import {app, BrowserWindow, ipcMain, session} from 'electron'
import { release } from 'os'
import { join } from 'path'
import {eventsRegister} from "./events";
import {useDatabase, useMainServie} from "./composables/instance";

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
const mainService = useMainServie()

// Here, you can also use other preload
// const preload = join(__dirname, '../preload/index.js')
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

  await mainService.init()
}

app.whenReady().then(async () => {
  await createWindow()
  // await mainService.universalView?.webContents.session.loadExtension(vueDevToolsPath)
  ipcMain.emit('app:mounted')
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
