class SlidingMenu extends HTMLElement {
    constructor() {
        super();
        this.btnMenuName =this.createBtnMenu();
    }

    static get observedAttributes() {
        return ['isexpanded', 'name'];
    }

    connectedCallback() {
        console.log("reach connectedCallback");
    }
    createBtnMenu(){
        let btnMenuName = this.createMenuNameButton();
        bindClick(btnMenuName, (function(){
            this.setAttribute("isexpanded",!(this.getAttribute("isexpanded")==="true"));
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
        if (this.btnMenuName && (this.getAttribute("isexpanded")==="true")){
            this.btnMenuName.innerText = val;
        } else if (this.btnMenuName) {
            this.btnMenuName.innerText = "|||";
        }
    }

    createMenuNameButton() {
        let menuNameButton = document.createElement("menu-name");
        menuNameButton.innerText = this.getAttribute("name") ?? "|||";

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
