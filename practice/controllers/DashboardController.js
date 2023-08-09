import { generateId } from "../../reusable/Infrastructure/UUIDGenerator.js";
import { EVN_Construct_View } from "../components/const.js";

import { DashboardView } from "../views/DashboardView.js";
import {  EVN_View_OnDelivery, createViewEntry, declareViewInstruction } from "./MainController.js";
// import { Builder_Dashboard_Menu } from "../components/BuildersDashBoard.js";

export const VIEW_TYPE = "DASHBOARD";

export const EVN_Construct_View_DASHBOARD = EVN_Construct_View + "_" + VIEW_TYPE;
export const MenuTitle = "Dashboard"
export const DASHBOARD_MENU_META = declareViewInstruction(
    VIEW_TYPE,
    true,
    true,
    true,
    true,
    MenuTitle
)


export class DashboardController{
    constructor(msgBus){
        this.messageBus = msgBus;
        this._setUpMessageBus();
    }

    _setUpMessageBus(){
        this.messageBus.subscribe(EVN_Construct_View_DASHBOARD,this)
    }

    onMessageArrive(topic, msg){
        switch (topic) {
            case EVN_Construct_View_DASHBOARD:
                this._raise_View_Generated();
                break;
        
            default:
                break;
        }
    }

    _raise_View_Generated(){
        let message = createViewEntry(
            VIEW_TYPE,
            generateId(),
            this._generate_DashboardView(),
            MenuTitle,
            MenuTitle,
        );
        this.messageBus.deliver(EVN_View_OnDelivery, message)
    }
    _generate_DashboardView(){
        return new DashboardView();
    }
}

