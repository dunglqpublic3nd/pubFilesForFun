class ApplicationContext {
    constructor(comChannel){
        this.views = [];
        if (comChannel){
            comChannel.subscribe( "UpdateActiveViews",this)
        }  
        
    }
    setActiveViews(activeViews){
        this.views = activeViews;
    }

    onMessageArrive(topic, message){
        switch (topic) {
            case "UpdateActiveViews":
                this.setActiveViews(message.views);
                break;
        
            default:
                break;
        }
    }
}