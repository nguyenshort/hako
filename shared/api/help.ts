import {ipcRenderer} from "electron";
import {ICallback} from "../models/app";

export const helpAPIS = {

    useEventListener: (event: string, callback: ICallback) => ipcRenderer.on(event, (event, data) => callback(data)),

    showNotification: (title: string, message: string) => ipcRenderer.invoke('show-notification', title, message),

}
