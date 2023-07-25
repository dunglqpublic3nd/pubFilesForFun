class MainView extends View{
    constructor(){
        super();
        this.viewCollections = new Map();
        this.activeViewName;
        this.comChannel;
    }

    setViewContent(viewElement){
        if (viewElement) {
            super.setViewContent(viewElement)
        } else {
            console.error("please check viewElement is null", `active view name is ${this.activeViewName}`);
        }
    }

    setCommunicationChannel(channel){
        this.comChannel = channel;
    }

    showView(viewName, viewElement){
        let view;
        if (!viewElement){
            if (this.viewCollections.has(viewName)){
                this.setActiveViewName(viewName);
                view = this.getView(viewName);
            } else {
                console.error(`View with name: ${viewName} doesn't exist`);
                return;
            }
        } else{
            this.addViewToCollection(viewName, viewElement);
            this.setActiveViewName(viewName);
            view = viewElement;
        }
        this.setViewContent(view);
    }

    addViewToCollection (viewName, view){
        this.viewCollections.set(viewName, view)
        if(this.comChannel){
            this.comChannel.deliver("UpdateActiveViews", {views: this.getViewNames()});

        }
    }

    getView (viewName){
        if (this.viewCollections.has(viewName)){
            this.viewCollections.get(viewName)
        }
        return null;
    }

    getViewNames(){
        return toArray(this.viewCollections.keys());
    }

    setActiveViewName(name){
        this.activeViewName = name;
    }

    closeView(viewName){
        if (this.viewCollections.has(viewName)){
            this.viewCollections.delete(viewName)
        }
        if (this.activeViewName===viewName){
            this.setActiveViewName(undefined);
            removeAllChild(this)
        }
    }

    render(){
        setElementAttribute(this, {
            is: "main-view"
        })
    }
}

customElements.define("main-view", MainView, {extends: "div"})