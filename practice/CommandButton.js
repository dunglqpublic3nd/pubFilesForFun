class CommandButton extends HTMLButtonElement {
    constructor() {
        super();
    }
}

customElements.define("command-button", CommandButton, { extends: "button" });