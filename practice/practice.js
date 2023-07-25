function hardReload() {
    if (confirm("Confirm?"))
        document.location.reload(true)
}

btnView.addEventListener("click", function () {
    // alert("do something")
    // btnView.dispatchEvent(new CustomEvent("eventX",{msg:"hello"}));
    // btnView.dispatchEvent(eventX);
    btnView.dispatchEvent(new CustomEvent("eventX", { msg: "hello" }));
}, false);

(function initAppContext() {
    const MainView_MenuChannel = new CommunicationChannel("MainView_MenuChannel");
    const $Context = new ApplicationContext(MainView_MenuChannel);
    const viewFactory = new ViewFactory($Context);
    const mainMenu = document.getElementById("mainMenu");
    mainMenu.setCustomElementFactory(new CustomElementFactory());
    mainMenu.setMainViewMainMenuChannel(MainView_MenuChannel);
    mainMenu.startMainViewMainMenuChannel();

    $Context.mainView = viewFactory.createMainView();
    $Context.mainView.setCommunicationChannel(MainView_MenuChannel);
    appendChild(document.body, $Context.mainView);

    class ViewController {
        constructor(comChan) {
            this.channel = comChan;
            this.channel.subscribe("OpenView", this)
        }
        showWelcomeView() {
            let WelcomeView = $Context.mainView.getView("Welcome view")
            if (WelcomeView) {
                $Context.mainView.showView("Welcome view");
            } else {
                WelcomeView = viewFactory.createWelcomeView();
                $Context.mainView.showView("Welcome view", WelcomeView);
            }
            MainView_MenuChannel.deliver("RebuildMenu", {
                items: [
                    {
                        text: "All views",
                        callback: () => { this.showActiveViewList(); this.closeMenu(); }
                    },
                    {
                        text: "Update Application",
                        callback: hardReload
                    },
                    {
                        text: "Close",
                        callback: ()=>this.closeMenu()
                    }
                ]
            })
        }

        closeMenu() {
            MainView_MenuChannel.deliver("CloseMenu")
        }

        showActiveViewList() {
            let AllViewList = $Context.mainView.getView("Active View List")
            if (AllViewList) {
                $Context.mainView.showView("Active View List");
            } else {
                AllViewList = viewFactory.createAllView($Context);
                $Context.mainView.showView("Active View List", AllViewList);
            }
            MainView_MenuChannel.deliver("RebuildMenu", {
                items: [
                    {
                        text: "Dashboard",
                        callback: () => {
                            this.closeMenu();
                            this.showWelcomeView()
                        }
                    }
                ]
            })
        }
        onMessageArrive(topic, message) {
            if (topic === "OpenView") switch (message.view) {
                case "Welcome view":
                    this.showWelcomeView();
                    break;
                case "Active View List":
                    this.showActiveViewList();
                    break;
                case "CloseMenu":
                    this.closeMenu();
                    break;
                default:
                    break;
            }
        }
    }

    let viewController = new ViewController(MainView_MenuChannel);
    viewController.showWelcomeView();

})();

// btnView.addEventListener("eventX",console.log);

// customElements.define("sliding-menu", SlidingMenu, { extends: "div" });

