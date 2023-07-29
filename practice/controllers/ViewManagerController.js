import { SimpleList } from "../../reusable/CustomControl/List.js";
import { generateId } from "../../reusable/Infrastructure/UUIDGenerator.js";
import { Builder_ViewManager_Menu } from "../components/BuildersViewManager.js";
import { EVN_Construct_View, EVN_View_OnDelivery } from "./MainController.js";

export const VN_ViewManager1 = "VN_ViewManager1";
export const EVN_RetrievView = "EVN_RetrievView";   // in
export const EVN_CaptureView = "EVN_CaptureView";   // in
export const EVN_RemoveView = "EVN_RemoveView;";    // in

export const EVN_RetrievView_Success = "EVN_RetrievView_Success";   // out
export const EVN_CaptureView_Success = "EVN_CaptureView_Success";   // out
export const EVN_RemoveView_Success = "EVN_RemoveView_Success;";    // out

export class ViewManagerController {
    constructor(ViewsMessageBus) {
        this.messageBus = ViewsMessageBus;
        this._setUpMessageBus();
        this.viewVault = new ViewVault;
    }

    _setUpMessageBus() {
        this.messageBus.subscribe(EVN_Construct_View, this);
        this.messageBus.subscribe(EVN_RetrievView, this);
        this.messageBus.subscribe(EVN_CaptureView, this);
        this.messageBus.subscribe(EVN_RemoveView, this);
    }

    _getView_VN_ViewManager1() {
        const list = new SimpleList();
        return list;
    }

    _sendView_VN_ViewManager1(view) {
        this.messageBus.deliver(EVN_View_OnDelivery, {
            view,
            id: generateId(),
            menu: new Builder_ViewManager_Menu().build(this.messageBus),
            name: "View Manager",
            menuName: "View Manager Menu",
        })
    }

    _onRequestView(request) {
        switch (request.viewName) {
            case VN_ViewManager1:
                let view = this._getView_VN_ViewManager1();
                this._sendView_VN_ViewManager1(view)
                break;
            default:
                break;
        }
    }

    _onRetrieveView(viewId) {
        this.messageBus.deliver(EVN_RetrievView_Success, {
            viewId,
            viewMeta: this.viewVault.retrieve(viewId)
        })
    }
    _onCaptureView(viewId, viewMeta) {
        this.viewVault.store(viewId, viewMeta)
        this.messageBus.deliver(EVN_CaptureView_Success)
    }
    _onRemoveView(viewId) {
        this.viewVault.remove(viewId)
        this.messageBus.deliver(EVN_RemoveView_Success)
    }

    onMessageArrive(topic, message) {
        switch (topic) {
            case EVN_Construct_View:
                this._onRequestView(message)
                break;
            case EVN_RetrievView:
                this._onRetrieveView(message.viewId)
                break;
            case EVN_CaptureView:
                this._onCaptureView(message.viewId, message.viewMeta)
                break;
            case EVN_RemoveView:
                this._onRemoveView(message.viewId);
                break;
            default:
                break;
        }
    }
}

class ViewVault {
    constructor() {
        this.vault = new Map();
    }

    store(id, viewMeta) {
        this.vault.set(id, viewMeta)
    }

    retrieve(id) {
        this.vault.get(id);
    }

    remove(id) {
        this.vault.delete(id);
    }

    list() {
        return Array.from(this.vault.entries()).map(entry => {
            return {
                id: entry[0],
                name: entry[1].name
            }
        })
    }

    clear() {
        this.vault.clear();
    }
}