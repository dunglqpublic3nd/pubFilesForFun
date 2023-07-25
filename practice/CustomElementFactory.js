class CustomElementFactory {
    constructor(){

    }

    createSlidingMenu(){
        return document.createElement("div", {is: "sliding-menu"})
    }

    createCommandButton(){
        return document.createElement("button", {is: "command-button"})
    }

    createMainMenu(){
        return document.createElement("div", {is:"main-menu"});
    }
}