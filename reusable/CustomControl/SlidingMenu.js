import { MenuItem_CloseAfterClick } from "../../practice/components/MenuItem_CloseAfterClick.js";
import { appendChild, bindClick, prependChild, setElementAttribute, toggleClassName }
    from "../DOM_Manipulators.js";
import { SimpleList } from "./List.js";

const Menu_Collapse_Title = "|||";
const Menu_Expand_Title = "menu";
export class SlidingMenu extends HTMLDivElement {
    constructor() {
        super();
        this.btnMenuName = undefined;
        this.menuBody = undefined;
        this.isInitiated = false;
    }

    static get observedAttributes() {
        return ['isexpanded', 'name'];
    }

    connectedCallback() {
        console.log("reach connectedCallback");
        this.createMenu();
        setTimeout(() => {
            setElementAttribute(this, {
                is: "sliding-menu",
                isexpanded: this.getAttribute("isexpanded") ?? "false",
                name: this.getAttribute("name") ?? Menu_Expand_Title
            })
        }, 5);
    }

    createMenu() {
        this._createMenuNameButton();
        appendChild(this, this.menuBody = new SimpleList());
        this.isInitiated = true;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("reach attributeChangedCallback", name, oldValue, newValue);
        if (this.isInitiated)
        switch (name) {
            case "isexpanded":
                this._toggleExpandingState(newValue);
                break;
            case "name":
                this._set_menuName();
                break;
            default:
                break;
        }
    }

    _toggleExpandingState(val) {
        // console.dir({ val })
        if (val === "true") {
            toggleClassName(this, ["expand"], true);
            toggleClassName(this, ["collapse"], false);
            this._set_menuName();
        } else {
            toggleClassName(this, ["expand"], false);
            toggleClassName(this, ["collapse"], true);
            this._set_menuName();

        }
    }

    change_MenuName(val) {
        this.setAttribute("name",val??Menu_Expand_Title)
    }

    _set_menuName(){
        if (this.getAttribute("isexpanded") === "true") {
            this.btnMenuName.innerText = this.getAttribute("name");
        } else  {
            this.btnMenuName.innerText = Menu_Collapse_Title;
        }
    }

    _closeMenu(){
        setElementAttribute(this,
            {isexpanded: false}
        )
    }

    _createMenuNameButton() {
        this.btnMenuName  = new MenuName();
        // this.btnMenuName.innerText = this.getAttribute("name") ?? "|||";
        prependChild(this, this.btnMenuName)
        bindClick(this.btnMenuName, (function () {
            setElementAttribute(this,
                { isexpanded: !(this.getAttribute("isexpanded") === "true") })
        }).bind(this));
    }

    syncItems(menuElements){
        menuElements.forEach(element => {
            if(element instanceof MenuItem_CloseAfterClick){
                bindClick(element, this._closeMenu.bind(this))
            }
        });
        this.menuBody.syncItems(menuElements);
    }
}
customElements.define("sliding-menu", SlidingMenu, { extends: "div" });

class MenuName extends HTMLDivElement {
    constructor() {
        super();
    }
    connectedCallback(){
        setElementAttribute(this, {is:"menu-name"})
    }
}

customElements.define("menu-name", MenuName, { extends: "div" });
