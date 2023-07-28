import { ToDashBoard_ButtonOption } from "./Builders_ToDashboard.js";


export class Builder_ViewManager_Menu{
    build(EventBus){
        let options = [
            new ToDashBoard_ButtonOption().build(),
        ];
        return options;
    }
}