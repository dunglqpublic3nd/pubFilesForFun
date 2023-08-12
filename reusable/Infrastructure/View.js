import { appendChild, removeAllChild, setElementAttribute } 
    from "../DOM_Manipulators.js";

export class View extends HTMLDivElement{
    constructor(){
        super();
        this.context = null;
        this.init = false;
    }

    setViewContent(htmlElement){
        removeAllChild(this);
        appendChild(this,htmlElement)
    }

    render(){
        return this;
    }

    connectedCallback(){
        if (!this.init){
            this.render();
            this.init = true;
        }

    }

    defineView(alias){
        setElementAttribute(this, {is:alias})
    }
}