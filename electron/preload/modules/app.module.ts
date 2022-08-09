import {contextBridge} from "electron";
import {appAPIS} from "../../../shared/api";

contextBridge.exposeInMainWorld('appFn', appAPIS)
