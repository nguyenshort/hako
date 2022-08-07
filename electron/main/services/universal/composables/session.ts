import {session} from "electron";
import type { Session } from 'electron'

export const useSession = (id: string): Session => {

    const sessionID = `session:${id}`

    const ses = session.fromPartition(sessionID)

    // proxy
    /*let {
        proxyMode,
        proxyRules,
        proxyBypassRules,
        proxyPacScript,
    } = global*/
    ses.setProxy({
        mode: 'system',
    })


    // UA adjustment
    // modifed from https://github.com/minbrowser/min/blob/58927524e3cc16cc4f59bca09a6c352cec1a16ac/main/UASwitcher.js (Apache License)
    ses.webRequest.onBeforeSendHeaders((details, callback) => {
        /*let compatibleUaString;
        if (details.url) {
            compatibleUaString = getCompatibleUserAgentString(details.url);
        }
        if (!compatibleUaString && details.referrer) {
            compatibleUaString = getCompatibleUserAgentString(details.referrer);
        }*/

        /*referrerif (compatibleUaString) {
            details.requestHeaders['User-Agent'] = compatibleUaString;
        } else {*/
            const chromiumVersion = process.versions.chrome.split('.')[0];
            details.requestHeaders['SEC-CH-UA'] = `"Chromium";v="${chromiumVersion}", " Not A;Brand";v="99"`;
            details.requestHeaders['SEC-CH-UA-MOBILE'] = '?0';
        //}

        callback({ cancel: false, requestHeaders: details.requestHeaders });
    })

    // set preload script at session level
    // to ensure that even popup windows have access to the script
    // if (ses.getPreloads().length < 1) {
    //     const preloadPath = path.join(__dirname, 'webview-preload.js');
    //     ses.setPreloads([preloadPath]);
    // }
    //
    // if (global.shareWorkspaceBrowsingData) {
    //     sharedSession = ses;
    // }
    return ses;
}
