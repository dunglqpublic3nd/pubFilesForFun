import { CommandButton } from "../../reusable/CustomControl/CommandButton.js";
import { bindClick } from "../../reusable/DOM_Manipulators.js";
import { VN_DASHBOARD1 } from "../controllers/DashboardController.js";
import { EVN_Display_View } from "../controllers/MainController.js";

const BTNTEXT = "Dashboard"
export class ToDashBoard_ButtonOption {
    constructor(alternateTitle, ViewEventBus) {
        this.title = BTNTEXT
        this.btn = new CommandButton()
        this.btn.innerText = alternateTitle ?? this.title;
        if (ViewEventBus) {
            this.withViewEventBus_doClick(ViewEventBus);
        }
    }
    withViewEventBus_doClick(ViewEventBus) {
        bindClick(this.btn, () => {
            ViewEventBus.deliver(EVN_Display_View, { viewnName: VN_DASHBOARD1 })
        })
        return this;
    }
    withTitle(alternateTitle) {
        this.btn.innerText = alternateTitle ?? this.title;
        return this;
    }
    withAlternateClickBehavior(behavior) {
        bindClick(this.btn, behavior)
        return this;
    }
    build() {
        return this.btn;
    }
}