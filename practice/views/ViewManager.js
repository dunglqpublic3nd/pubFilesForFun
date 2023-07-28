export class ViewManager extends View {
    constructor(){
        super();
        this.content = undefined;
        this.viewList = undefined;
        this.name= "Active View List";
        this.context = undefined;
    }

    re_loadListView(){
        removeAllChild(this.viewList);
        this.displayListView();
    }

    displayListView(){
        if (this.context){
            toArray(this.context.views).forEach(viewName=>{
                this.createListItem(viewName)
            })
        } else{
            let empty = createDiv();
            empty.innerText = "Empty";
            appendChild(this.viewList, empty)
        }
    }

    setContext(ctx) {
        this.context = ctx;
    }

    render(){
        setElementAttribute(this,{is:"view-manager"})

        this.content = createDiv();
        this.content.innerText = this.name;
    
        let btn = createButton("Refresh");
        bindClick(btn, function(){
            this.re_loadListView();
        }.bind(this));
        appendChild(this.content, btn);

        this.viewList = createDiv();
        appendChild(this.content, this.viewList);
        this.re_loadListView();
        appendChild(this,this.content);

    }

    createListItem(viewName){
        let item = createDiv();
        item.innerText = viewName;
        appendChild(this.viewList, item)
    }
}

customElements.define("view-manager", ViewManager, {extends: "div"});