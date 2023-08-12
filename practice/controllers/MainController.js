import { appendChild } from "../../reusable/DOM_Manipulators.js";
import { MenuBuilder } from "../components/MenuBuilder.js";
import { EVN_Construct_View } from "../components/const.js";
import { MainView } from "../views/MainView.js";
import { EVN_CaptureView, EVN_RetrievView, EVN_RetrievView_Success, EVN_VIEWCONTEXT_CHANGE, EVN_VIEWCONTEXT_RETRIEVE, EVN_VIEWCONTEXT_SUCCESS } from "./ViewManagerController.js";

export const EVN_Display_View = "EVN_Display_View";

// export const EVN_Request_View_Model = "EVN_Request_View_Model"; // out
export const EVN_View_OnDelivery = "EVN_View_OnDelivery";
export const EVN_RETRIEVING_SPECIAL_MENU_ITEMS = "EVN_RETRIEVING_SPECIAL_MENU_ITEMS";
export const EVN_RETRIEVING_SPECIAL_MENU_ITEMS_SUCCESS = "EVN_RETRIEVING_SPECIAL_MENU_ITEMS_SUCCESS";

export class MainController {
    constructor(msgBus) {
        this._viewRenderContext = undefined;
        this._viewsContext = [];

        this.messageBus = msgBus;
        this.mainView = new MainView();
        this._functionsMeta = undefined;

        this._setUpMessageBus();
    }

    declareEntryFunctions(entryFunctions) {
        this._functionsMeta = entryFunctions;
    }

    _setUpMessageBus() {
        this.messageBus.subscribe(EVN_Display_View, this)
        this.messageBus.subscribe(EVN_View_OnDelivery, this)
        this.messageBus.subscribe(EVN_VIEWCONTEXT_SUCCESS, this)
        this.messageBus.subscribe(EVN_VIEWCONTEXT_CHANGE, this)
        this.messageBus.subscribe(EVN_RetrievView_Success, this)
    }

    onMessageArrive(topic, message) {
        switch (topic) {
            case EVN_Display_View:
                this._onEVN_Display_view(message);
                break;
            case EVN_View_OnDelivery:
                this._onEVN_View_OnDelivery(message);
                break;
            case EVN_VIEWCONTEXT_CHANGE:
                this._onEVN_VIEWCONTEXT_CHANGE(message);
                break;
            case EVN_VIEWCONTEXT_SUCCESS:
                this._onEVN_VIEWCONTEXT_CHANGE(message);
                this._onEVN_VIEWCONTEXT_SUCCESS(message);
                break;
            case EVN_RetrievView_Success:
                this._onEVN_RetrievView_Success(message);


            default:
                break;
        }
    }

    _onEVN_Display_view(msg) {
        this._setViewRenderContext(msg.ViewId, msg.ViewType);
        this._raise_VIEWCONTEXT_RETRIEVE();
    }

    _onEVN_View_OnDelivery(msg) {
        this._raise_EVN_CaptureView(msg);
        this._updateViewRenderContextMeta(msg)
        this._handle_views_special_menu_items();
    }

    _onEVN_RetrievView_Success(msg) {
        this._updateViewRenderContextMeta(msg.viewMeta)
        this._handle_views_special_menu_items();
    }

    _onEVN_VIEWCONTEXT_CHANGE(msg) {
        this._setViewsContext(msg.views)
    }

    _onEVN_VIEWCONTEXT_SUCCESS(msg) {
        if (this._viewRenderContext._id) {
            this._raise_EVN_RetrievView(this._viewRenderContext._id)
        } else {
            this._raise_constructView(this._viewRenderContext._type)
        }
    }

    _onEVN_RETRIEVING_SPECIAL_MENU_ITEMS_SUCCESS(msg) {
        this._viewRenderContext.specialItems = msg.menuItems;
        this._displayView();
    }

    _handle_views_special_menu_items() {
        let renderingViewMetaData = getViewMeta(this._functionsMeta, this._viewRenderContext.ViewType);
        if (!renderingViewMetaData || !renderingViewMetaData.HasSpecialMenuItems) {
            this._displayView();
        } else {
            this._raise_EVN_RETRIEVING_SPECIAL_MENU_ITEMS()
        }
    }

    _raise_EVN_RETRIEVING_SPECIAL_MENU_ITEMS() {
        this.messageBus.deliver(EVN_RETRIEVING_SPECIAL_MENU_ITEMS + "_" + this._viewRenderContext.ViewType, {
            id: this._viewRenderContext.id
        })
    }

    _raise_EVN_CaptureView(msg) {
        this.messageBus.deliver(EVN_CaptureView, { viewId: msg.id, viewMeta: msg }, this);
    }

    _raise_EVN_RetrievView(viewId) {
        this.messageBus.deliver(EVN_RetrievView, { viewId }, this)
    }

    _raise_VIEWCONTEXT_RETRIEVE() {
        this.messageBus.deliver(EVN_VIEWCONTEXT_RETRIEVE, undefined, this);
    }

    _raise_constructView(viewName) {
        this.messageBus.deliver(EVN_Construct_View + "_" + viewName, {}, this);
    }

    // _displayView(metaData) {
    //     this.mainView.updateViewContent(metaData.view);
    //     this.mainView.updateMenu(metaData.menuName, metaData.menu);
    // }
    _displayView() {
        /// TODO:
        this.mainView.updateViewContent(this._viewRenderContext.viewMeta.view);
        let menuBuilder = new MenuBuilder(this._viewsContext,this._viewRenderContext, this._functionsMeta, this.messageBus);
        let menuName = menuBuilder.getMenuName();
        let items = menuBuilder.buildMenu();
        this.mainView.updateMenu(menuName, items);
    }

    _render() {
        appendChild(document.body, this.mainView)
    }

    start() {
        this._render();
        let defaultView = getDefaultView(this._functionsMeta);
        if (defaultView) {
            this._setViewRenderContext(undefined, defaultView.ViewType);
            this._raise_VIEWCONTEXT_RETRIEVE();
        } else {
            console.error("Default view is not set");
        }
    }

    _setViewRenderContext(id, type) {
        this._viewRenderContext = new ViewRenderContext(id, type);
    }

    _updateViewRenderContextMeta(viewMeta) {
        this._viewRenderContext.viewMeta = viewMeta
    }

    _setViewsContext(ctx) {
        this._viewsContext = ctx;
    }
}

function getDefaultView(metas) {
    let index = metas.findIndex((v) => v.DefaultView);
    return metas[index];
}

function getInfrastructureViews(metas) {
    return metas.filter(v => v.IsInfrastructure)
}

function getFunctionViews(metas) {
    return metas.filter(v => !v.IsInfrastructure)
}

function getViewMeta(metas, TypeName) {
    let index = metas.findIndex((v) => v.ViewType === TypeName);
    return metas[index]  // could be a meta or undefined please check before advancing
}

export function declareViewInstruction(
    ViewType,
    DefaultView,
    AllowLinkToOtherFunctions,
    IsSingletonFunction,
    isEntryFunction,
    RequireEntryFunctions,
    DefaultLinkText,
    AlternateEventName,
    AlternateData,
    HasSpecializedMenuItems,
    CloseAfterClick,
) {
    return {
        ViewType,
        DefaultView,
        AllowLinkToOtherFunctions,
        IsSingletonFunction,
        isEntryFunction,
        RequireEntryFunctions,
        DefaultLinkText,
        AlternateEventName,
        AlternateData,
        HasSpecializedMenuItems,
        CloseAfterClick,
    }
}

export function createViewEntry(ViewType, id, view, name, menuName) {
    return {
        ViewType,
        id,
        view,
        name,
        menuName
    }
}

class ViewRenderContext {
    constructor(_id, _type) {
        this._id = _id;
        this._type = _type;
        this._viewMeta = undefined;
        this.specialItems = [];
    }
    set id(_id) {
        this._id = _id;
    }
    get id() {
        return this._id;
    }

    set ViewType(_type) {
        this._type = _type;
    }

    get ViewType() {
        return this._type;
    }

    set viewMeta(_viewMeta) {
        this._viewMeta = _viewMeta;
    }

    get viewMeta() {
        return this._viewMeta;
    }
}

