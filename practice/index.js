import { appendChild, bindClick, createButton }
    from "../reusable/DOM_Manipulators.js";
import { CommunicationChannel }
    from "../reusable/Infrastructure/CommnunicationChannel.js";
import { EVN_UPDATE_CONTROLLER_HARDUPDATE, UpdateController }
    from "./controllers/UpdateController.js"
import { DashboardController, VN_DASHBOARD1 }
    from "./controllers/DashboardController.js";
import { EVN_Display_View, MainController }
    from "./controllers/MainController.js";
import { ViewManagerController } from "./controllers/ViewManagerController.js";

// btnView.addEventListener("click", function () {
//     // alert("do something")
//     // btnView.dispatchEvent(new CustomEvent("eventX",{msg:"hello"}));
//     // btnView.dispatchEvent(eventX);
//     btnView.dispatchEvent(new CustomEvent("eventX", { msg: "hello" }));
// }, false);


const MainMessageBus = new CommunicationChannel("MainFunctionChannel");
const $WelcomeController = new DashboardController(MainMessageBus);
const $UpdateController = new UpdateController(MainMessageBus);
const $MainController = new MainController(MainMessageBus);
const $ViewManagerControler = new ViewManagerController(MainMessageBus);

function raiseUpdateSoftwareEvent() {
    MainMessageBus.deliver(EVN_UPDATE_CONTROLLER_HARDUPDATE)
}

function test() {
    $MainController.render();
    MainMessageBus.deliver(EVN_Display_View, { viewName: VN_DASHBOARD1 })
}



test();
// (function appMain() {
//     // init Infrastructure

//     // Arrangement

//     // start

//     const MainView_MenuChannel = new CommunicationChannel("MainView_MenuChannel");
//     const $Context = new ApplicationContext(MainView_MenuChannel);
//     const viewFactory = new ViewFactory($Context);
//     const mainMenu = document.getElementById("mainMenu");
//     mainMenu.setCustomElementFactory(new CustomElementFactory());
//     mainMenu.setMainViewMainMenuChannel(MainView_MenuChannel);
//     mainMenu.startMainViewMainMenuChannel();

//     $Context.mainView = viewFactory.createMainView();
//     $Context.mainView.setCommunicationChannel(MainView_MenuChannel);
//     appendChild(document.body, $Context.mainView);

//     class ViewController {
//         constructor(comChan) {
//             this.channel = comChan;
//             this.channel.subscribe("OpenView", this)
//         }
//         showWelcomeView() {
//             let WelcomeView = $Context.mainView.getView("Welcome view")
//             if (WelcomeView) {
//                 $Context.mainView.showView("Welcome view");
//             } else {
//                 WelcomeView = viewFactory.createWelcomeView();
//                 $Context.mainView.showView("Welcome view", WelcomeView);
//             }
//             MainView_MenuChannel.deliver("RebuildMenu", {
//                 items: [
//                     {
//                         text: "All views",
//                         callback: () => { this.showActiveViewList(); this.closeMenu(); }
//                     },
//                     {
//                         text: "Update Application",
//                         callback: hardReload
//                     },
//                     {
//                         text: "Close",
//                         callback: ()=>this.closeMenu()
//                     }
//                 ]
//             })
//         }

//         closeMenu() {
//             MainView_MenuChannel.deliver("CloseMenu")
//         }

//         showActiveViewList() {
//             let AllViewList = $Context.mainView.getView("Active View List")
//             if (AllViewList) {
//                 $Context.mainView.showView("Active View List");
//             } else {
//                 AllViewList = viewFactory.createAllView($Context);
//                 $Context.mainView.showView("Active View List", AllViewList);
//             }
//             MainView_MenuChannel.deliver("RebuildMenu", {
//                 items: [
//                     {
//                         text: "Dashboard",
//                         callback: () => {
//                             this.closeMenu();
//                             this.showWelcomeView()
//                         }
//                     }
//                 ]
//             })
//         }
//         onMessageArrive(topic, message) {
//             if (topic === "OpenView") switch (message.view) {
//                 case "Welcome view":
//                     this.showWelcomeView();
//                     break;
//                 case "Active View List":
//                     this.showActiveViewList();
//                     break;
//                 case "CloseMenu":
//                     this.closeMenu();
//                     break;
//                 default:
//                     break;
//             }
//         }
//     }

//     let viewController = new ViewController(MainView_MenuChannel);
//     viewController.showWelcomeView();

// })

// btnView.addEventListener("eventX",console.log);

// customElements.define("sliding-menu", SlidingMenu, { extends: "div" });
