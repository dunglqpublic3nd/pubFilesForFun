class View extends HTMLDivElement{
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
}