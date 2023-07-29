API
    window.generateUUID() // not used
    CommnunicationChannel
        .deliver(topic, message)
        .subscribe(topic, entity)
        .unsubscribe(topic, entity)
    
    UpdateController
        UPDATE_CONTROLLER_HARDUPDATE
    
    MainController
        Event:
            EVN_Display_View
            EVN_Construct_View // out
            EVN_View_OnDelivery

        EVN_Construct_View
            message
                .viewName
        EVN_View_OnDelivery
            message
                .id - text
                .view - element
                .menu - [element]
                .name -text
                .menuName - text
            handlers
                _displayView
                    metaData
                        .view
                        .menuName
                        .menu

    DashboardController
        Event
            listen
                EVN_Construct_View
        handlers:
            _raise_View_Generated
                send:
                    EVN_View_OnDelivery
                        message
                            .id - text
                            .view - element
                            .menu - [element]
                            .name -text
                            .menuName - text

    ViewManagerController
        Event 
            listening
                EVN_Construct_View  // in
                EVN_RetrievView     // in
                EVN_CaptureView     // in
                EVN_RemoveView      // in
        EVN_Construct_View 
            expect .viewName
                VN_ViewManager1       
                    

    Problems
        