import {inject} from "vue";
import {APP_BRIDGE_CONSTANT} from "@plugins/bridge";

export const useAppBridge = () => {
    return inject<typeof window.appBridge>(APP_BRIDGE_CONSTANT)!
}
