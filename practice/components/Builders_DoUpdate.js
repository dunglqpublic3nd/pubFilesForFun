import { bindClick } from "../../reusable/DOM_Manipulators.js";
import { EVN_UPDATE_CONTROLLER_HARDUPDATE } from "../controllers/UpdateController.js";
import { ToDashBoard_ButtonOption } from "./Builders_ToDashboard.js";

const BTNTEXT = "Force Update"
export class DoUpdate_ButtonOption extends ToDashBoard_ButtonOption {
    constructor(title, ViewEventBus) {
        super(title ?? BTNTEXT, ViewEventBus)
    }
    withViewEventBus_doClick(ViewEventBus) {
        bindClick(this.btn, () => {
            if(confirm("Are you sure?")) ViewEventBus.deliver(EVN_UPDATE_CONTROLLER_HARDUPDATE)
        })
        return this;
    }
}