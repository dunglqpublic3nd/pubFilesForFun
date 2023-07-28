import { hardReload_WebPage } from "../../reusable/DOM_Manipulators.js";

// export const UPDATE_CONTROLLER_HARDUPDATE = window.generateUUID();
export const EVN_UPDATE_CONTROLLER_HARDUPDATE = "EVN_UPDATE_CONTROLLER_HARDUPDATE";


export class UpdateController {
    constructor(msgBus) {
        this.messageBus = msgBus;
        this._initChannel();
    }
    onMessageArrive(topic, message) {
        if(topic === EVN_UPDATE_CONTROLLER_HARDUPDATE){
            hardReload_WebPage()
        }
    }
    _initChannel(){
        this.messageBus.subscribe(EVN_UPDATE_CONTROLLER_HARDUPDATE,this)
    }
}