import {contextBridge} from "electron"
import {mainAPIS} from "../../../shared/api";

contextBridge.exposeInMainWorld('mainFn', mainAPIS)
