

btnView.addEventListener("click",function(){
    // alert("do something")
    // btnView.dispatchEvent(new CustomEvent("eventX",{msg:"hello"}));
    // btnView.dispatchEvent(eventX);
    btnView.dispatchEvent(new CustomEvent("eventX",{msg:"hello"}));
},false)


// btnView.addEventListener("eventX",console.log);

// customElements.define("sliding-menu", SlidingMenu, { extends: "div" });

