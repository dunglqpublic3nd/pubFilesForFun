import { createDiv } from "../../reusable/DOM_Manipulators.js";
import { EVN_View_OnDelivery, declareViewInstruction } from "./MainController.js";

export const SHOW_ERROR_VIEW = "SHOW_ERROR_VIEW";
export const VIEW_TYPE ="ERROR_VIEW";
export const ERROR_MENU_META = declareViewInstruction(
    VIEW_TYPE,
    false,
    true,
    true,
    false,
    true,
    null,
    null,
    null,
    false
);
export class ErrorController{
    constructor(msgBus){
        this._msgBus = msgBus;
        this._initChannel();
    }

    _initChannel(){
        this._msgBus.subscribe(SHOW_ERROR_VIEW,this)
    }

    _generateErrorView(customMessage){
        let div = createDiv();
        div.innerText = (customMessage?? "Error occured!");
        return div;
    }

    onMessageArrive(topic, msg){
        switch (topic) {
            case value:
                setTimeout(() => {
                    let view = this._generateErrorView(msg.errorMessage)
                    this._msgBus.deliver(EVN_View_OnDelivery, {view}, this);
                }, 1);
                return true;
            default:
                return false
        }
    }
}