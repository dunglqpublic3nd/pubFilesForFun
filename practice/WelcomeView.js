class WelcomeView extends View{
    constructor (){
        super();

    }
    render(){
        let bg = document.createElement("div");
        let message = document.createElement("h3");
        message.innerText ="Welcome";
        bg.appendChild(message);
        this.appendChild(bg);
    }
}

customElements.define("welcome-view", WelcomeView, {extends: "div"})