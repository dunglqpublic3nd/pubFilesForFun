class CommandButton extends HTMLButtonElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return  []
        // ['click'];
    }

    connectedCallback(){
        setElementAttribute(this, {is: "command-button"});
        // if (this.hasAttribute("click")){
        //     try {
        //         this.addEventListener("click", (function(){
        //             eval(this.getAttribute("click")+"()");
        //         }).bind(this))
        //     } catch (error) {
        //         console.error(error);             
        //     }
        // }
        // console.log("reach CommandButton-connectedCallback");
       
    }
}

customElements.define("command-button", CommandButton, { extends: "button" });