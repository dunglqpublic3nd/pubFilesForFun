

btnView.addEventListener("click",function(){
    // alert("do something")
    // btnView.dispatchEvent(new CustomEvent("eventX",{msg:"hello"}));
    // btnView.dispatchEvent(eventX);
    btnView.dispatchEvent(new CustomEvent("eventX",{msg:"hello"}));
},false)

const controller = new Controller();
const eventX = new Event("eventX")
controller.addEventListener("eventX",controller.inform);
// btnView.addEventListener("eventX",console.log);