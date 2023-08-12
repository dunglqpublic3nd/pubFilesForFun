import { hardReload_WebPage } from "../../reusable/DOM_Manipulators.js";
import { declareViewInstruction } from "./MainController.js";

const UPDATE_TITLE = "Update software"
export const UPDATE_VIEW = "UPDATE_VIEW"
// export const UPDATE_CONTROLLER_HARDUPDATE = window.generateUUID();
export const EVN_UPDATE_CONTROLLER_HARDUPDATE = "EVN_UPDATE_CONTROLLER_HARDUPDATE";
export const UPDATE_MENU_META = declareViewInstruction(
    UPDATE_VIEW,
    false,
    true,
    true,
    true,
    false,
    UPDATE_TITLE,
    EVN_UPDATE_CONTROLLER_HARDUPDATE,
    null,
    false,
    true,
)

export class UpdateController {
    constructor(msgBus) {
        this.messageBus = msgBus;
        this._initChannel();
    }
    onMessageArrive(topic, message) {
        if(topic === EVN_UPDATE_CONTROLLER_HARDUPDATE){
            hardReload_WebPage()
        }
        return true;
    }
    _initChannel(){
        this.messageBus.subscribe(EVN_UPDATE_CONTROLLER_HARDUPDATE,this)
    }
}