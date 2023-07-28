import { appendChild } from "../../reusable/DOM_Manipulators.js";
import { MainView } from "../views/MainView.js";

export const EVN_Display_View = "EVN_Display_View";
export const EVN_Construct_View = "EVN_Construct_View"; // out
// export const EVN_Request_View_Model = "EVN_Request_View_Model"; // out
export const EVN_View_OnDelivery = "EVN_View_OnDelivery"; 

export class MainController {
    constructor(msgBus) {
        this.messageBus = msgBus;
        this.mainView = new MainView();
        this._setUpMessageBus();
    }

    _setUpMessageBus() {
        this.messageBus.subscribe(EVN_Display_View, this)
        this.messageBus.subscribe(EVN_View_OnDelivery, this)
    }

    onMessageArrive(topic, message) {
        switch (topic) {
            case EVN_Display_View:
                this._constructView(message.viewName)
                break;
            case EVN_View_OnDelivery:
                this._displayView(message);
                break;
            default:
                break;
        }
    }

    _constructView(viewName){
        this.messageBus.deliver(EVN_Construct_View, {viewName})
    }

    _displayView(metaData){
        this.mainView.updateViewContent(metaData.view);
        this.mainView.updateMenu(metaData.menuName, metaData.menu);
    }

    render() {
        appendChild(document.body, this.mainView)
    }
}