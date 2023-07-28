import { DoUpdate_ButtonOption } from "./Builders_DoUpdate.js";
import { ToViewManager_ButtonOption } from "./BuildersToViewManager.js";


export class Builder_Dashboard_Menu{
    build(EventBus){
        let options = [
            new ToViewManager_ButtonOption(undefined, EventBus).build(),
            new DoUpdate_ButtonOption(undefined,EventBus).build(),
        ];
        return options;
    }
}