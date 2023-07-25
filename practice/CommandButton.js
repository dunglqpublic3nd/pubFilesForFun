class CommandButton extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['click'];
    }

    connectedCallback(){
        if (this.hasAttribute("click")){
            try {
                this.addEventListener("click", (function(){
                    eval(this.getAttribute("click")+"()");
                }).bind(this))
            } catch (error) {
                console.error(error);             
            }
        }
        console.log("reach CommandButton-connectedCallback");
       
    }
}

customElements.define("command-button", CommandButton);