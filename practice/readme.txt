Meaningful days make a happy life

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
        Local storage as a persistent mechanism is not good enough as maximum storage size is 5MB
            Solution
                indexedDb as alternative

        Messed up design!
            Views are not categoried
                view functions are mixed up. responsibilities between infrastructured views and functional views are coupled
                    Point1
                        Dashboard options appeared in ViewManager Function's menu
                    Point2
                        Views generated id its self
                        to revisit a view MainView needs a view's infor (name, id, type) to create a link navigation
                            => lack of mechanism
                        Dashboard should not know others function links directly
                    
                Solutions
                    soultion1
                        Set of view levels
                            Application Level
                                MainView
                            Infrastructure Level
                                ViewManager
                                Dashboard
                                Grammar Structure Finder
                                KanjiCollector
                                Settings
                                CreatePractice
                                Composer
                            Function Level
                                PracticeTypes (1-2-3-4-5)
                                Report

                        Rules of view levels
                            Application Level (may be not needed)
                                could be reduced to Infrastructure level
                            ViewManager
                                should not know view role

                            MainView
                                Synthesize menu each time a view is requested
                                    -> View Manager no longer store view's menu
                                    -> Procedures Refactoring
                                        Showing Dashboard (mainView onStart
                                            User declare default view to be created and render by application
                                            Call Showing View (default view type, id: null)            
                                        Showing View (View selection from menu, pass view type, view id)
                                            view id is null
                                                create view (view type)
                                            view id is not null
                                                retrieve view from view manager
                                            
                                            on view created
                                                set viewBuilderContext(view's menu items, view's content)

                                                display view(viewBuilderContext)
                                            on view trieved
                                                set viewBuilderContext(view's content)
                                                retrieve view type's menu items( view id)
                                                
                                            on retrieve view menu item
                                                set viewBuilderContext(view's menu items)
                                                display view(viewBuilderContext)

                                            on view not found or not created
                                                set viewBuilderContext(null, error view, error: true)
                                                display view(viewBuilderContext)

                                            display view
                                                Request all idle views from View Manager 
                                                Show view
                                            recive views infor
                                                Synthesize menu (viewBuilderContext)
                                                Show menu

                                            error view
                                                message: "view not found or nolonger exist" 
                                            
                                            freeze menu
                                                disable all menu items after selection made
                                            freeze view 
                                                cover view with a processing div
                                                consider a cancel loading button

                                declares each View Types should be related to AllViewsContext or not
                                    if one view is context related its function should be grouped and include in global menu

                                    AllowLinkToOtherFunctions
                                        indicate a view's menu contains link to other function view

                                    IsInfrastructure
                                        indicate a view's menu item is Global menu item or not
                                            if the view is activated is a global menu item, then its link would not be displayed in global menu
                                    RequireInfrastructure
                                        indicate if view type need global menu items or not
                                            if not only view's menu is used

                                        pseudo implementation
                                            MainView's All View Type Configuration
                                                {
                                                    ViewManager:{
                                                        AllowLinkToOtherFunctions: false,
                                                        IsInfrastructure: true,
                                                        RequireInfrastructure: true, 
                                                    }
                                                    Dashboard{
                                                        defaultView: true,
                                                        AllowLinkToOtherFunctions: true,
                                                        IsInfrastructure: true,
                                                        RequireInfrastructure: true, 
                                                    }
                                                    Settings{
                                                        AllowLinkToOtherFunctions: false,
                                                        IsInfrastructure: true,
                                                        RequireInfrastructure: true,
                                                    }
                                                    CreatePractice{
                                                        AllowLinkToOtherFunctions: true,
                                                        IsInfrastructure: true,
                                                        RequireInfrastructure:true,                   
                                                    }
                                                    PracticeTypes{
                                                        AllowLinkToOtherFunctions: false,
                                                        IsInfrastructure: false,
                                                        RequireInfrastructure:false,                   
                                                    }
                                                    Composer{
                                                        AllowLinkToOtherFunctions: true,
                                                        IsInfrastructure: true,
                                                        RequireInfrastructure:true,                   
                                                    }
                                                    KanjiCollector{
                                                        AllowLinkToOtherFunctions: true,
                                                        IsInfrastructure: true,
                                                        RequireInfrastructure:true,                   
                                                    }
                                                }
                                            
                                Global Menu is specified in MainView's All View Type Configuration
                                    each items whose attribute RequireInfrastructure is true, is a global menu item.
                                    

















