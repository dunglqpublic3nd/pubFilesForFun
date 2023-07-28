import { bindClick } from "../../reusable/DOM_Manipulators.js";
import { EVN_Display_View } from "../controllers/MainController.js";
import { VN_ViewManager1 } from "../controllers/ViewManagerController.js";
import { ToDashBoard_ButtonOption } from "./Builders_ToDashboard.js";

const BTNTEXT = "View Manager"
export class ToViewManager_ButtonOption extends ToDashBoard_ButtonOption {
    constructor(title, ViewEventBus) {
        super(title ?? BTNTEXT, ViewEventBus)
    }
    withViewEventBus_doClick(ViewEventBus) {
        bindClick(this.btn, () => {
            ViewEventBus.deliver(EVN_Display_View, { viewName: VN_ViewManager1 })
        })
        return this;
    }
}