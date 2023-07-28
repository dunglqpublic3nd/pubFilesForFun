import { generateId } from "../../reusable/Infrastructure/UUIDGenerator.js";

import { DashboardView } from "../views/DashboardView.js";
import { EVN_Construct_View, EVN_View_OnDelivery } from "./MainController.js";
import { Builder_Dashboard_Menu } from "../components/BuildersDashBoard.js";

export const VN_DASHBOARD1 = "DASHBOARD1";

export class DashboardController{
    constructor(msgBus){
        this.messageBus = msgBus;
        this._setUpMessageBus();
    }

    _setUpMessageBus(){
        this.messageBus.subscribe(EVN_Construct_View,this)
    }

    onMessageArrive(topic, msg){
        switch (topic) {
            case EVN_Construct_View:
                this._raise_View_Generated();
                break;
        
            default:
                break;
        }
    }

    _raise_View_Generated(){
        this.messageBus.deliver(EVN_View_OnDelivery, {
            id: generateId(),
            view: this._generate_DashboardView(),
            menu: new Builder_Dashboard_Menu().build(this.messageBus),
            name: "Dashboard",
            menuName: "Menu",
        })
    }
    _generate_DashboardView(){
        return new DashboardView();
    }
}
