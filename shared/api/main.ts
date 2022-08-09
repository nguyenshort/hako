import {ipcRenderer} from "electron";
import {MainChanel} from "../chanel";

export const mainAPIS = {
    show: () => ipcRenderer.invoke(MainChanel.SHOW)
}
