import {Notification} from "electron";

export const fireNotify = (title: string, body: string) => new Notification({ title, body }).show()
