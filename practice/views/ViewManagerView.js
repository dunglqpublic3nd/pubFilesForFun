import { SimpleList } from "../../reusable/CustomControl/List.js";
import { appendChild, bindClick, createButton, createDiv, setElementAttribute } from "../../reusable/DOM_Manipulators.js";
import { View } from "../../reusable/Infrastructure/View.js";
import { EVN_View_Finalize } from "../components/const.js";
 
export const EVN_VIEWCONTEXT_CHANGE = "EVN_VIEWCONTEXT_CHANGE";
export const EVN_GET_VIEWS_CONTEXT = "EVN_GET_VIEWS_CONTEXT"; //out

const LISTENING_EVENTS = [
    EVN_VIEWCONTEXT_CHANGE,
    EVN_View_Finalize
]

export class ViewManagerView extends View {
    constructor(ViewManagerController_MsgBus) {
        super();
        this.msgBus = ViewManagerController_MsgBus;
        this._setupMsgBus();
        this.viewList = undefined;
    }

    _setupMsgBus() {
        this.msgBus.subscribe_multi(LISTENING_EVENTS, this)
    }

    onMessageArrive(topic, msg) {
        switch (topic) {
            case EVN_VIEWCONTEXT_CHANGE:
                this._onViewsContextChange(msg);
                break;
            case EVN_View_Finalize:
                this._onViewFinalize();
                break;
            default:
                break;
        }
    }

    onMessageReturned(topic, msg){
        switch (topic) {
            case EVN_GET_VIEWS_CONTEXT:
            default:
                alert("Errr....") // debug
                console.error("NO handler" , topic, msg, msgBus.getName());
                break;
        }
    }

    _onViewsContextChange(msg) {
        let viewElements = msg.views.map(this._createListItem);
        this._displayViewList(viewElements)
    }

    _onViewFinalize() {
        this.msgBus.unsubscribe_multi(LISTENING_EVENTS, this)
    }

    _getViewsContext(){
        this.msgBus.deliver(EVN_GET_VIEWS_CONTEXT,null, this);
    }

    re_loadListView() {
        this._getViewsContext();
    }
 
    _displayViewList(viewItems) {
        this.viewList.syncItems(viewItems);
    }

    render() {
        setElementAttribute(this, { is: "view-manager" })

        let content = createDiv();
        appendChild(this, content);
        
        let btnRefresh = this._createButtonRefresh();
        appendChild(content, btnRefresh);

        this.viewList = new SimpleList();
        appendChild(content, this.viewList);
        this._getViewsContext();
       
    }

    _createButtonRefresh(){
        return bindClick(createButton("Refresh"), function () {
            this.re_loadListView();
        }.bind(this));
    }

    _createListItem(view) {
        let content = createDiv();
        let name = createDiv();
        name.innerText = `Name: ${view.name}`;
        appendChild(content, name);
        
        let type = createDiv();
        type.innerText = `Type: ${view.type}`;
        appendChild(content, type);

        let id = createDiv();
        id.innerText =`Id: ${view.id}`;
        appendChild(content, id);

        appendChild(content, createButton("close"));
        return  content;
    }
}

customElements.define("view-manager", ViewManagerView, { extends: "div" });