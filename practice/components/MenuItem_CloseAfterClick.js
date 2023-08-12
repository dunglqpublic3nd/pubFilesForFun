import { MenuItem } from "./MenuItem.js";

export class MenuItem_CloseAfterClick extends MenuItem{
    constructor(menuItemMeta){
        super(menuItemMeta);
    }
}


customElements.define("menu-item-close-after", MenuItem_CloseAfterClick, { extends: "button" });