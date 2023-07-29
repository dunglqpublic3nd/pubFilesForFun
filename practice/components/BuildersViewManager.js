import { ToDashBoard_ButtonOption } from "./BuildersToDashboard.js";


export class Builder_ViewManager_Menu{
    build(EventBus){
        let options = [
            new ToDashBoard_ButtonOption(undefined, EventBus).build(),
        ];
        return options;
    }
}