import { CommandButton } from "../../reusable/CustomControl/CommandButton.js";

export class MenuItem extends CommandButton{
    constructor(menuItemMeta){ // menuItemMeta must conform constraints of MenuItemMeta class
        super();
        this._meta = menuItemMeta;
    }

    connectedCallback(){
        super.connectedCallback();
        let title = this._meta.title;
        this.innerText = title;
        this.addEventListener("click",()=>{
            const {msgBus, eventName, data}  = {... this._meta};
             
            if (msgBus  && "deliver" in msgBus){
                msgBus.deliver(eventName, data, this);
            } else {
                console.error("Main Controller message bus is required")
            }
        })
    }

    onMessageReturned(topic, data){
        console.log("There is no receipent for: ","topic: ", topic, "data: ", data )
    }
}

customElements.define("menu-item", MenuItem, { extends: "button" });

