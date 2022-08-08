import {notifyEventsRegister} from "./notify.event";
import {appEventsRegister} from "./app.event";
import {spotlightEventsRegister} from "./spotlight.event";
import {universalEventsRegister} from "./universal.event";

export const eventsRegister = () => {

    notifyEventsRegister()
    appEventsRegister()
    spotlightEventsRegister()
    universalEventsRegister()

}
