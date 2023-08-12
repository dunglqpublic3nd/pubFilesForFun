import { EVN_Display_View } from "../controllers/MainController.js";
import { MenuItem } from "./MenuItem.js";
import { MenuItemMeta } from "./MenuItemMeta.js";
import { MenuItem_CloseAfterClick } from "./MenuItem_CloseAfterClick.js";

export class MenuBuilder {
    constructor(viewsContext, viewRenderContext, functionsMeta, globalMessageBus) {
        this.viewsCtx = viewsContext;
        this.vRenderCtx = viewRenderContext;
        this.fxsMeta = functionsMeta;
        this.msgBus = globalMessageBus;
    }

    getViewTypeMeta_From_fxsMeta(vTypeName) {
        let idx = this.fxsMeta.findIndex((instr) => {
            return instr.ViewType === vTypeName;
        });
        return this.fxsMeta[idx];
    }

    getViewTypeName_From_vRenderCtx() {
        return this.vRenderCtx.ViewType;
    }

    getView_From_vRenderCtx() {
        return this.vRenderCtx.viewMeta.view;
    }

    getViewName_From_vRenderCtx() {
        return this.vRenderCtx.viewMeta.name;
    }

    getDefaultTitle_From_ViewTypeMeta(vTypeMeta) {
        return vTypeMeta.DefaultLinkText;
    }

    transform_functionsMeta_to_Dictionary(fxMetaCollection) {
        let dict = {};
        fxMetaCollection.forEach(viewInstruction => {
            dict[viewInstruction.ViewType] = viewInstruction;
        });
        return dict;
    }

    filter_EntryFunctions(fxMetaCollection) {
        return fxMetaCollection.filter(viewInstruction => {
            return viewInstruction.isEntryFunction
        })
    }

    separate_FunctionToGroups(fxMetaCollection){
        let entries = [], nonEntries =[];
        fxMetaCollection.forEach(viewInstruction=>{
            if (viewInstruction.isEntryFunction){
                entries.push(viewInstruction);
            } else {
                nonEntries.push(viewInstruction);
            }
        });
       
        return {
            entries,
            nonEntries
        }
    }

    getDefaultViewMeta() {
        let idx = this.fxsMeta.findIndex((instr) => {
            return instr.DefaultView;
        });
        return this.fxsMeta[idx];
    }

    groupView_byType_ThenID_to_dict(viewCollection) {
        let dict = {};
        viewCollection.forEach(view => {
            if (!(view.ViewType in dict)) {
                dict[view.ViewType] = {}
            }
            dict[view.ViewType][view.id] = view;
        })

        return dict;
    }

    getMenuName_From_vRenderCtx() {
        return this.vRenderCtx.viewMeta.menuName;
    }

    getSpecialItems_from_vRenderCtx() {
        return this.vRenderCtx.specialItems;
    }

    pickLinkText(vTypeMeta, viewId, viewDict) {
        let defTitle = this.getDefaultTitle_From_ViewTypeMeta(vTypeMeta);
        let title = undefined;
        if (viewDict[vTypeMeta.ViewType] && viewDict[vTypeMeta.ViewType][viewId]) {
            title = viewDict[vTypeMeta.ViewType][viewId].name;
        }
        return defTitle === title && title ? title : defTitle;
    }

    doDefaultMenuItemCheckup(menuItemsCollection, viewDict) {
        if (menuItemsCollection.length > 0) {
            return menuItemsCollection;
        } else {
            let defaultMeta = this.getDefaultViewMeta();
            let view_Dict = viewDict;
            if (!view_Dict) {
                view_Dict = this.groupView_byType_ThenID_to_dict(this.viewsCtx);
            }
            let viewId = view_Dict[defaultMeta.ViewType][0];
            return [this.createMenuItem(defaultMeta, viewId, viewDict)];
        }
    }

    createMenuItem(vInstruction, viewId, viewDict) {
        let title = this.pickLinkText(vInstruction, viewId, viewDict);
        let eventName = vInstruction.AlternateEventName ?? EVN_Display_View;
        let data = vInstruction.AlternateData ?? {
            ViewId: viewId ?? undefined,
            ViewType: vInstruction.ViewType
        }
        let menuItemMeta = new MenuItemMeta(title, this.msgBus, eventName, data);
        if (vInstruction.CloseAfterClick){
            return new MenuItem_CloseAfterClick(menuItemMeta);
        }
        return new MenuItem(menuItemMeta);
    }

    generateMenuItems_Not_ALTOF_Not_REF(vTypeMeta) {
        let specialItems = this.getSpecialItems(vTypeMeta);
        return this.doDefaultMenuItemCheckup(specialItems, undefined);
    }

    getSpecialItems(vTypeMeta) {
        if (vTypeMeta.HasSpecialMenuItems) {
            return this.getSpecialItems_from_vRenderCtx();
        } return [];
    }

    generateViewItems(vTypeMeta) {
        let { AllowLinkToOtherFunctions, RequireEntryFunctions } = { ...vTypeMeta };
        if (!AllowLinkToOtherFunctions) {
            if (!RequireEntryFunctions) {
                return this.generateMenuItems_Not_ALTOF_Not_REF(vTypeMeta);
            } else {
                return this.generateMenuItems_Not_ALTOF_REF(vTypeMeta);
            }
        } else {
            if (RequireEntryFunctions) {
                return this.generateMenuItems_ALTOF_REF(vTypeMeta);
            } 
            else {
                return this.generateMenuItems_ALTOF_Not_REF(vTypeMeta);
            }
        }
    }

    filterView_BytTypes(viewEntriess, typeSet) {
        return viewEntriess.filter(viewEntry => {
            return typeSet.has(viewEntry.TypeName);
        })
    }

    filterView_ByTypes_NotIn(viewEntriess, typeSet){
        return viewEntriess.filter(viewEntry =>{
            return !typeSet.has(viewEntry.TypeName);
        })
    }

    generateMenuItems_Not_ALTOF_REF(vTypeMeTa) {
        let menuItems = [];
        const entryFunc_Col = this.filter_EntryFunctions(this.fxsMeta);
        let entryFunct_TypeNames = entryFunc_Col.map(entryFunc => entryFunc.TypeName);
        entryFunct_TypeNames = new Set(entryFunct_TypeNames);
        let viewsCtx = buildRenderViewsContext()
        let idleEntryViews = this.filterView_BytTypes(viewsCtx, entryFunct_TypeNames)
        let idleView_dict = this.groupView_byType_ThenID_to_dict(idleEntryViews);

        entryFunc_Col.forEach(entryFunct => {
            // let viewId = entryFunct.IsSingletonFunction ? 
            //     Object.values(idleView_dict[entryFunct.ViewType])[0].id:
            //     undefined ;
            let viewId = undefined; 
            if(entryFunct.IsSingletonFunction && entryFunct.ViewType == this.getViewTypeName_From_vRenderCtx()) return;
            if (entryFunct.IsSingletonFunction) {
                let idleView = idleView_dict[entryFunct.ViewType];
                if(idleView){
                    let values = Object.values(idleView)
                    viewId = values[0].id
                }
            } 
            let item = this.createMenuItem(entryFunct,viewId, idleView_dict);
            menuItems.push(item);
        });
       
        let obj = {};
        Object.values(obj)

        let specialItems = this.getSpecialItems(vTypeMeTa);
        menuItems.concat(specialItems);
        return this.doDefaultMenuItemCheckup(menuItems, undefined);
    }

    isTargetView_a_Unique_REF(vTypeMeta, entryFunct_TypeName_Set){
        let targetViewType = this.vRenderCtx.ViewType;
        return entryFunct_TypeName_Set.has(targetViewType)
             && vTypeMeta.IsSingletonFunction;
    }

    buildRenderViewsContext(){
        let availableViews = [...this.viewsCtx];
        let idx = availableViews.findIndex(view=>{
            return view.id == this.vRenderCtx.id
                && view.ViewType ==  this.vRenderCtx.ViewType;
        })
        availableViews.splice(1,idx);
        return availableViews;
    }

    generateMenuItems_ALTOF_REF(vTypeMeta){
        let menuItems = [];
        const {entries:entryFunc_Col, nonEntries: nonEntryFunc_Col } =
             {... (this.separate_FunctionToGroups(this.fxsMeta))};

        let entryFunct_TypeNames = entryFunc_Col.map(entryFunc => entryFunc.TypeName);
        entryFunct_TypeNames = new Set(entryFunct_TypeNames);

        let viewsCtx = this.buildRenderViewsContext()
        // if(this.isTargetView_a_Unique_REF(entryFunct_TypeNames)){
        //     let idx = entryFunc_Col.findIndex(
        //         meta=>meta.ViewType == this.vRenderCtx.ViewType);
        //     entryFunc_Col.splice(1,idx);
        // } else {

        // }

        let idleEntryViews = this.filterView_ByTypes_NotIn(viewsCtx, entryFunct_TypeNames)
        let idleView_dict = this.groupView_byType_ThenID_to_dict(viewsCtx);
        entryFunc_Col.forEach(entryFunct => {
            let viewId = undefined;
            if(entryFunct.IsSingletonFunction && entryFunct.ViewType == this.getViewTypeName_From_vRenderCtx()) return;
            if (entryFunct.IsSingletonFunction) {
                let idleView = idleView_dict[entryFunct.ViewType];
                if(idleView){
                    let values = Object.values(idleView)
                    viewId = values[0].id
                }
            } 
                
            let item = this.createMenuItem(entryFunct,viewId, idleView_dict);
            menuItems.push(item);
        })

        const nonEntryFunc_Dict = this.transform_functionsMeta_to_Dictionary(nonEntryFunc_Col);
        idleEntryViews.forEach(entryView=>{
            let entryFunc = nonEntryFunc_Dict[entryView.ViewType];
            let viewId = entryView.id;
            let item = this.createMenuItem(entryFunc,viewId, idleView_dict);
            menuItems.push(item);
        })

        let specialItems = this.getSpecialItems(vTypeMeta);
        menuItems.concat(specialItems);
        return this.doDefaultMenuItemCheckup(menuItems, undefined);
    }

    generateMenuItems_ALTOF_Not_REF(vTypeMeta){
        let menuItems = [];
        const {entries:entryFunc_Col, nonEntries: nonEntryFunc_Col } = {... (this.separate_FunctionToGroups(this.fxsMeta))};

        let entryFunct_TypeNames = entryFunc_Col.map(entryFunc => entryFunc.TypeName);
        entryFunct_TypeNames = new Set(entryFunct_TypeNames);
        let viewsCtx = this.buildRenderViewsContext();
        let idleEntryViews = this.filterView_ByTypes_NotIn(viewsCtx, entryFunct_TypeNames)
        let idleView_dict = this.groupView_byType_ThenID_to_dict(viewsCtx);
        // entryFunc_Col.forEach(entryFunct => {
        //     let viewId = entryFunct.IsSingletonFunction ? 
        //         idleView_dict[entryFunct.ViewType][0].id:
        //         undefined ;
        //     let item = this.createMenuItem(entryFunct,viewId, idleView_dict);
        //     menuItems.push(item);
        // })

        const nonEntryFunc_Dict = this.transform_functionsMeta_to_Dictionary(nonEntryFunc_Col);
        idleEntryViews.forEach(entryView=>{
            let entryFunc = nonEntryFunc_Dict[entryView.ViewType];
            let viewId = entryView.id;

            let item = this.createMenuItem(entryFunc,viewId, idleView_dict);
            menuItems.push(item);
        })

        let specialItems = this.getSpecialItems(vTypeMeta);
        menuItems.concat(specialItems);
        return this.doDefaultMenuItemCheckup(menuItems, undefined);
    }
    
    isActivatingView(viewType,viewId){
        return this.vRenderCtx.ViewType == viewType && 
            this.vRenderCtx.id == viewId;
    }

    generateMenuItem(eventName, data, linkText) {
        let menuItemMeta = new MenuItemMeta(linkText, this.msgBus, eventName, data);
        return new MenuItem(menuItemMeta);
    }

    buildMenu() {
        let vTypeName = this.getViewTypeName_From_vRenderCtx();
        let viewTypeMeta = this.getViewTypeMeta_From_fxsMeta(vTypeName);
        return this.generateViewItems(viewTypeMeta);
    }

    getMenuName() {
        return this.getMenuName_From_vRenderCtx();
    }

    getViewname() {
        return this.getViewName_From_vRenderCtx();
    }


}
