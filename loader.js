uploader.addEventListener("change", function(ev){
    let reader = new FileReader();
    reader.onload = (ev)=>{
        let data = JSON.parse(ev.target.result);
        console.log(data)
    }

    reader.readAsText(ev.target.files[0]);
})