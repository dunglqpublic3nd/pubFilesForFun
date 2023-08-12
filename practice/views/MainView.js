import { SlidingMenu } from "../../reusable/CustomControl/SlidingMenu.js";
import { appendChild, createDiv, removeAllChild, setElementAttribute } from "../../reusable/DOM_Manipulators.js";
import { View } from "../../reusable/Infrastructure/View.js";

export class MainView extends View{
    constructor(){
        super();
        this._menu = undefined;
        this._view = createDiv();
        this._view.innerHTML = "<h1> MAIN VIEW </h1>";
    }

    render(){
        setElementAttribute(this, {is: "main-view"});
        appendChild(this, this._menu = new SlidingMenu())
        appendChild(this,this._view)
    }

    updateMenu(menuName, menuElements){
        this._menu.change_MenuName(menuName);
        this._menu.syncItems(menuElements);
    }

    updateViewContent(viewContent){
        removeAllChild(this._view);
        appendChild(this._view,viewContent);
    }
}

customElements.define("main-view", MainView, {extends: "div"})