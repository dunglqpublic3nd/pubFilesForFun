class MainMenu extends SlidingMenu {
    constructor() {
        super();
        this.MainViewMainMenuChannel = undefined;
        this.customElementFactory = undefined;
    }

    connectedCallback() {
        setElementAttribute(this, { is: "sliding-menu" })
    }

    setCustomElementFactory(customEleFactory) {
        this.customElementFactory = customEleFactory;
    }

    setMainViewMainMenuChannel(channel) {
        this.MainViewMainMenuChannel = channel;
    }
    startMainViewMainMenuChannel() {
        if (this.MainViewMainMenuChannel) {
            this.MainViewMainMenuChannel.subscribe("RebuildMenu", this)
            this.MainViewMainMenuChannel.subscribe("UpdateMenu", this)
            this.MainViewMainMenuChannel.subscribe("OpenMenu", this)
            this.MainViewMainMenuChannel.subscribe("CloseMenu", this)
        }
    }
    stopMainViewMainMenuChannel() {
        if (this.MainViewMainMenuChannel) {
            this.MainViewMainMenuChannel.unsubscribe("RebuildMenu", this)
            this.MainViewMainMenuChannel.unsubscribe("UpdateMenu", this)
            this.MainViewMainMenuChannel.unsubscribe("OpenMenu", this)
            this.MainViewMainMenuChannel.unsubscribe("CloseMenu", this)
        }
    }

    openMenu() {
        setElementAttribute(this,{isexpanded:true})
    }

    closeMenu() {
        setElementAttribute(this,{isexpanded:false})
    }

    buildItem(item){
        let menuItem =  this.customElementFactory.createCommandButton();
        if ( item.callback) menuItem.onclick = item.callback;
        menuItem.innerText = item.text;
        appendChild(this, menuItem);
    }

    buildMenu(items){
        items.forEach(
            item=>this.buildItem(item)
        );
    }

    rebuildMenu(itemsMeta) {
        let btnMenuName = this.children[0];
        removeAllChild(this);
        appendChild(this, btnMenuName);
        this.buildMenu(itemsMeta)
    }

    updateMenu(itemsMeta) {
        this.buildMenu(itemsMeta)
    }

    onMessageArrive(topic, message) {
        switch (topic) {
            case "RebuildMenu":
                this.rebuildMenu(message.items);
                break;
            case "UpdateMenu":
                this.updateMenu(message.items);
                break;
            case "OpenMenu":
                this.openMenu();
                break;
            case "CloseMenu":
                this.closeMenu();
                break;
            default:
                break;
        }
    }
}

customElements.define("main-menu", MainMenu, { extends: "div" })