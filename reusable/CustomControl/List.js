import { appendChild, removeAllChild, setElementAttribute } from "../DOM_Manipulators.js";

export class SimpleList extends HTMLDivElement{
    constructor(){
        super();
    }

    connectedCallback(){
        setElementAttribute(this, {
            is : "simple-list"
        })
    }

    syncItems_UseItemFactory(itemsMetaData, itemFactory_cbk){
        removeAllChild(this);
        itemsMetaData.forEach(itemMetaData=>{
            let itemElement = itemFactory_cbk(itemMetaData);
            this.addItem(itemElement);
        })
    }

    syncItems(itemElements){
        removeAllChild(this);
        itemElements.forEach(this.addItem.bind(this))
    }

    addItem(itemElement){
        appendChild(this,itemElement);
    }
}

customElements.define("simple-list", SimpleList, {extends:"div"})