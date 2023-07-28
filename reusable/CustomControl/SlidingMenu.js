import { appendChild, bindClick, prependChild, setElementAttribute, toggleClassName }
    from "../DOM_Manipulators.js";
import { SimpleList } from "./List.js";

export class SlidingMenu extends HTMLDivElement {
    constructor() {
        super();
        this.btnMenuName = undefined;
        this.menuBody = undefined;
    }

    static get observedAttributes() {
        return ['isexpanded', 'name'];
    }

    connectedCallback() {
        setElementAttribute(this, {
            is: "sliding-menu",
            isexpanded: false,
            name: "|||"
        })
        console.log("reach connectedCallback");
        this.btnMenuName = this.createMenu();
        appendChild(this, this.menuBody = new SimpleList());
    }

    createMenu() {
        let btnMenuName = this._createMenuNameButton();
        bindClick(btnMenuName, (function () {
            setElementAttribute(this,
                { isexpanded: !(this.getAttribute("isexpanded") === "true") })
        }).bind(this));
        return btnMenuName
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("reach attributeChangedCallback", name, oldValue, newValue);
        switch (name) {
            case "isexpanded":
                this.toggleExpandingState(newValue);
                break;
            case "name":
                this.change_MenuName(newValue);
                break;
            default:
                break;
        }
    }

    toggleExpandingState(val) {
        console.dir({ val })
        if (val === "true") {
            toggleClassName(this, ["expand"], true);
            toggleClassName(this, ["collapse"], false);
            this.change_MenuName(this.getAttribute("name"));
        } else {
            toggleClassName(this, ["expand"], false);
            toggleClassName(this, ["collapse"], true);
            this.change_MenuName("|||");

        }
    }

    change_MenuName(val) {
        this.name = val;
        if (this.btnMenuName && (this.getAttribute("isexpanded") === "true")) {
            this.btnMenuName.innerText = this.name;
        } else if (this.btnMenuName) {
            this.btnMenuName.innerText = "|||";

        }
    }

    _createMenuNameButton() {
        let menuNameButton = document.createElement("div", { is: "menu-name" });
        setElementAttribute(menuNameButton, { is: "menu-name" })
        menuNameButton.innerText = this.getAttribute("name") ?? "|||";

        prependChild(this, menuNameButton)
        return menuNameButton
    }
}
customElements.define("sliding-menu", SlidingMenu, { extends: "div" });

class MenuName extends HTMLDivElement {
    constructor() {
        super();
    }
}

customElements.define("menu-name", MenuName, { extends: "div" });
