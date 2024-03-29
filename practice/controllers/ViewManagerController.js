import { SimpleList } from "../../reusable/CustomControl/List.js";
import { toArray } from "../../reusable/DOM_Manipulators.js";
import { CommunicationChannel } from "../../reusable/Infrastructure/CommnunicationChannel.js";
import { generateId } from "../../reusable/Infrastructure/UUIDGenerator.js";
import { EVN_Construct_View } from "../components/const.js";
import { EVN_GET_VIEWS_CONTEXT, ViewManagerView } from "../views/ViewManagerView.js";
import { EVN_View_OnDelivery, createViewEntry, declareViewInstruction } from "./MainController.js";

export const VN_ViewManager1 = "VN_ViewManager1";
export const EVN_RetrievView = "EVN_RetrievView";   // in
export const EVN_CaptureView = "EVN_CaptureView";   // in
export const EVN_RemoveView = "EVN_RemoveView;";    // in

export const EVN_VIEWCONTEXT_RETRIEVE = "EVN_VIEWCONTEXT_RETRIEVE"; // in
export const EVN_VIEWCONTEXT_SUCCESS = "EVN_VIEWCONTEXT_SUCCESS"; // out

export const EVN_RetrievView_Success = "EVN_RetrievView_Success";   // out
export const EVN_CaptureView_Success = "EVN_CaptureView_Success";   // out
export const EVN_RemoveView_Success = "EVN_RemoveView_Success;";    // out
export const EVN_VIEWCONTEXT_CHANGE = "EVN_VIEWCONTEXT_CHANGE";     // out



export const EVN_Construct_View_VN_ViewManager1 = EVN_Construct_View + "_" + VN_ViewManager1;
const MenuTitle = "View Manager";
const MenuName = MenuTitle + " Menu";

export const VIEW_MANAGER_META = declareViewInstruction(
    VN_ViewManager1,
    false,
    true,
    true,
    true,
    true,
    MenuTitle,
    null,
    null,
    false,
    true,
)

export class ViewManagerController {
    constructor(ViewsMessageBus) {
        this.messageBus = ViewsMessageBus;
        this.privateMessageHandler = undefined;
        this.viewsControllerBus = this._setupPrivate_MsgBus();
        this._setUpMessageBus();

        this.viewVault = new ViewVault;
    }

    _setupPrivate_MsgBus() {
        let msgBus = new CommunicationChannel("Internal View Manager MsgBus");
        let pollingEvents = [EVN_GET_VIEWS_CONTEXT];

        let eventHandlerMapper = {};
        eventHandlerMapper[EVN_GET_VIEWS_CONTEXT]= 
            {handler: this._private_onEvnGetViewsContext.bind(this)};

        this.privateMessageHandler = new PrivateViewMessageHandler(eventHandlerMapper);
        msgBus.subscribe_multi(pollingEvents, this.privateMessageHandler);
        return msgBus;
    }

    _private_onEvnGetViewsContext() {
        this.viewsControllerBus.deliver(EVN_VIEWCONTEXT_CHANGE,
            {
                views: getViewList(this.viewVault)
            });
    }

    _setUpMessageBus() {
        this.messageBus.subscribe(EVN_Construct_View_VN_ViewManager1, this);
        this.messageBus.subscribe(EVN_RetrievView, this);
        this.messageBus.subscribe(EVN_CaptureView, this);
        this.messageBus.subscribe(EVN_RemoveView, this);  // may not need this function

        this.messageBus.subscribe(EVN_VIEWCONTEXT_RETRIEVE, this);
    }

    _raiseViewContextChange() {
        this.messageBus.deliver(EVN_VIEWCONTEXT_CHANGE, { views: this.viewVault.list() }, this)
    }

    _getView_VN_ViewManager1() {
        return  new ViewManagerView(this.viewsControllerBus);
    }

    _sendView_VN_ViewManager1(view) {
        let message = createViewEntry(
            VN_ViewManager1,
            generateId(),
            view,
            MenuTitle,
            MenuName
        );

        this.messageBus.deliver(EVN_View_OnDelivery, message);
    }

    _onRequestView(request) {
        let view = this._getView_VN_ViewManager1();
        this._sendView_VN_ViewManager1(view)
    }

    _onRetrieveView(viewId) {
        this.messageBus.deliver(EVN_RetrievView_Success, {
            viewId,
            viewMeta: this.viewVault.retrieve(viewId)
        })
    }
    _onCaptureView(viewId, viewMeta) {
        this.viewVault.store(viewId, viewMeta)
        // this.messageBus.deliver(EVN_CaptureView_Success)
        this._raiseViewContextChange();
    }
    _onRemoveView(viewId) {
        this.viewVault.remove(viewId)
        // this.messageBus.deliver(EVN_RemoveView_Success)
        this._raiseViewContextChange();
    }
    _onViewContextRetrieve() {
        this.messageBus.deliver(EVN_VIEWCONTEXT_SUCCESS, { views: this.viewVault.list() })
    }

    onMessageArrive(topic, message) {
        switch (topic) {
            case EVN_Construct_View_VN_ViewManager1:
                this._onRequestView(message)
                break;

            case EVN_RetrievView:
                this._onRetrieveView(message.viewId)
                break;
            case EVN_CaptureView:
                this._onCaptureView(message.viewId, message.viewMeta)
                break;
            case EVN_RemoveView: // may not need this function
                this._onRemoveView(message.viewId);
                break;

            case EVN_VIEWCONTEXT_RETRIEVE:
                this._onViewContextRetrieve();
                break;

            default:
                break;
        }
    }
}

function getViewList(viewVault) { // TODO gonna use this function  for ViewList
    return Array.from(viewVault.list()).map(entry => {
        return {
            id: entry.id,
            name: entry.name,
            type: entry.ViewType,
        }
    })
}

/*
a ViewEntry format

{
    ViewType,
    id, 
    view, 
    name,
    menuName
}

see also: MainController's createViewEntry function

*/

class ViewVault {
    constructor() {
        this.vault = new Map();
    }

    store(id, viewMeta) {
        this.vault.set(id, viewMeta)
    }

    retrieve(id) {
        return this.vault.get(id);
    }

    remove(id) {
        this.vault.delete(id);
    }

    list() {
        // return Array.from(this.vault.entries()).map(entry => {
        //     return {
        //         id: entry[0],
        //         name: entry[1].name
        //     }
        // })
        return toArray(this.vault.values());
    }

    clear() {
        this.vault.clear();
    }
}

class ViewListAdapter { // ROLE: bridges ViewManagerController functions with ViewList.
    constructor(controller, viewList) {

    }
}

class PrivateViewMessageHandler {
    constructor(topicHanlderMapper) {
        this.topicHanlderMapper = topicHanlderMapper;
    }
    onMessageArrive(topic, msg) {
        if (topic in this.topicHanlderMapper) {
            let handler = this.topicHanlderMapper[topic].handler;
            handler(msg);
            return true;
        }
        return false;
    }
    onMessageReturned(topic, msg) {
        if (topic in this.topicHanlderMapper) {
            let returnedHandler = this.topicHanlderMapper[topic].returnedHandler;
            returnedHandler(msg);
            return;
        }
        console.error("Error unhandle returned topic", topic, msg)
    }
}