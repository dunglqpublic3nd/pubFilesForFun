import { appendChild, removeAllChild, setElementAttribute } 
    from "../DOM_Manipulators.js";

export class View extends HTMLDivElement{
    constructor(){
        super();
        this.context = null;
    }

    setViewContent(htmlElement){
        removeAllChild(this);
        appendChild(this,htmlElement)
    }

    render(){
        return this;
    }

    connectedCallback(){
        this.render();
    }

    defineView(alias){
        setElementAttribute(this, {is:alias})
    }
}