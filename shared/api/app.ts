import {ipcRenderer} from "electron";
import {AppChanel} from "../chanel";
import {IApp, IAppInput} from "../models/app";

export const appAPIS = {

    // CURD
    create: (shortcut: IAppInput) => ipcRenderer.invoke(AppChanel.CREATE, shortcut),
    get: () => ipcRenderer.invoke(AppChanel.APPS),
    remove: (id: string) => ipcRenderer.invoke(AppChanel.REMOVE, id),

    // Mở context menu
    openContext: (id: string) => ipcRenderer.invoke(AppChanel.CONTEXT, id),

    // Thêm app nếu chưa có + autp focus
    upsert: (_id: string, auto?: boolean) => ipcRenderer.invoke(AppChanel.UPSERT, _id, auto),

    // Hiển thị app
    show: (_id: string) => ipcRenderer.invoke(AppChanel.SHOW, _id)
}
