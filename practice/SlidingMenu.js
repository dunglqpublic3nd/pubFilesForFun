class SlidingMenu extends HTMLElement {
    constructor() {
        super();
        this.btnMenuName = null;
    }

    static get observedAttributes() {
        return ['isexpanded', 'name'];
    }

    connectedCallback() {
        this.btnMenuName = this.createMenuNameButton();
        bindClick(this.btnMenuName, (function(){
            console.log("before",this.getAttribute("isexpanded"), !(this.getAttribute("isexpanded")==="true"))
            this.setAttribute("isexpanded",!(this.getAttribute("isexpanded")==="true"));
            console.log("after",this.getAttribute("isexpanded"))
        }).bind(this));
        console.log("reach connectedCallback");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("reach attributeChangedCallback", name, oldValue, newValue);
        switch (name) {
            case "isexpanded":
                this.toggleExpandingState(newValue);
                break;
            case "name":
                this.change_BtnMenuName(newValue);
                break;
            default:
                break;
        }
    }

    toggleExpandingState(val) {
        console.dir({val})
        if(val==="true"){
            toggleClassName(this, ["expand"], true);
            toggleClassName(this, ["collapse"], false);
            this.change_BtnMenuName(this.getAttribute("name"));
        } else {
            toggleClassName(this, ["expand"], false);
            toggleClassName(this, ["collapse"], true);
            this.change_BtnMenuName("|||");

        }
    }

    change_BtnMenuName(val){
        if (this.btnMenuName){
            this.btnMenuName.innerText = val;
        }
    }

    createMenuNameButton() {
        let menuNameButton = document.createElement("menu-name");
        menuNameButton.innerText = this.getAttribute("name") ?? "Menu";

        this.prepend(menuNameButton)
        return menuNameButton
    }
}
// customElements.define("sliding-menu", SlidingMenu, { extends: "div" });
customElements.define("sliding-menu", SlidingMenu);

class MenuName extends HTMLDivElement {
    constructor() {
        super();
    }
}

customElements.define("menu-name", MenuName, { extends: "div" });
