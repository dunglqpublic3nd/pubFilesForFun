import { View } from "../../reusable/Infrastructure/View.js";

export class DashboardView extends View{
    constructor (){
        super();
    }
    render(){
        this.defineView("dashboard-view");
        let bg = document.createElement("div");
        let message = document.createElement("h3");
        message.innerText ="Welcome";
        bg.appendChild(message);
        this.appendChild(bg);
    }
}

customElements.define("dashboard-view", DashboardView, {extends: "div"})