class ViewFactory {
    constructor(ctx){
        this.context = ctx
    }

    createAllView(alternateContext){
        return this.createTemplateView(alternateContext,
            document.createElement("div",{is:"all-view"}));
    }

    createMainView(alternateContext){
        return this.createTemplateView(alternateContext,
            document.createElement("div",{is:"main-view"}));
    }

    createWelcomeView(alternateContext){
        return this.createTemplateView(alternateContext,
             document.createElement("div",{is:"welcome-view"}));
    }

    createTemplateView(alternateContext, view){
        let context= this.context;
        if (alternateContext){
            context = alternateContext;
        }
        if (view.setContext) view.setContext(context);
        return view;
    }
}