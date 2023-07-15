const divList = document.getElementById("list");
const btnAddKanji = document.getElementById("btnAddKanji");

function createDiv(){
    return document.createElement("div")
}

function createTextInput(){
    let textInput = document.createElement("input");
    textInput.setAttribute("type","text");
    return textInput;
}

function createKanjiLeftBlock(){
    let div = createDiv();
    div.classList.add("leftBlock");

    let kanjiBox = createTextInput();
    kanjiBox.classList.add("kanjiBox");
    kanjiBox.placeholder = "kanji"
    div.appendChild(kanjiBox);

    let pronounBox = createTextInput();
    pronounBox.classList = "pronounBox";
    pronounBox.placeholder = "pronounciations"
    addKeyDownInsertCommaCallback(pronounBox);
    div.appendChild(pronounBox);
    

    let buttonRemoveKanji = document.createElement("button");
    buttonRemoveKanji.innerHTML = "Remove Kanji"
    buttonRemoveKanji.classList.add("bgr_red-text_white")
    buttonRemoveKanji.onclick = ()=>{
        div.parentElement.remove();
    }

    div.appendChild(buttonRemoveKanji);
    
    return div;
}

function createKanjiRightBlock(){
    let rightBlock = createDiv();
    rightBlock.classList.add("rightBlock");

    let buttonAdd = document.createElement("button");
    buttonAdd.innerText = ("Add");
    buttonAdd.classList.add("bgr_green-text_white")
    buttonAdd.onclick = function(ev){
        let wordBlock = createWordBlock();
        rightBlock.insertBefore(wordBlock,buttonAdd);
    }
    rightBlock.appendChild(buttonAdd)
    rightBlock.insertBefore(createWordBlock(),buttonAdd);

    return rightBlock;
}

function createWordBlock(){
    let wordBlock = createDiv();
    wordBlock.classList.add("wordBlock")

    let buttonRemove = document.createElement("button");
    buttonRemove.innerText = "Remove";
    buttonRemove.classList.add("bgr_red-text_white1");
    buttonRemove.onclick = function(ev){
        if (confirm("Are you sure? you want to remove this word defintion ")) wordBlock.remove();
    }

    let symbolBox = createTextInput();
    symbolBox.classList.add("symbolBox");
    symbolBox.placeholder = "Word";
    addKeyDownInsertCommaCallback(symbolBox)
    wordBlock.appendChild(symbolBox);

    let pronunBox = createTextInput();
    pronunBox.classList.add("pronunBox");
    pronunBox.placeholder = "Word pronunciations";
    addKeyDownInsertCommaCallback(pronunBox)
    wordBlock.appendChild(pronunBox);

    let meaningBox = createTextInput();
    meaningBox.classList.add("meaningBox");
    meaningBox.placeholder = "Meanings";
    addKeyDownInsertCommaCallback(meaningBox)
    wordBlock.appendChild(meaningBox);

    wordBlock.appendChild(buttonRemove)

    return wordBlock;
}

function addKeyDownInsertCommaCallback(input){
    input.addEventListener("keydown", function(ev){
        if (ev.altKey && ev.key == "7") {
            ev.target.value += ",";
            ev.target.selectionStart +=1;
        }
    })
    input.addEventListener("focus", function(ev){
        console.log(ev.target.offsetLeft, ev.target.offsetTop);
        let help = document.getElementById('help')
        help.style.setProperty("left", ev.target.offsetLeft + "px" );
        help.style.setProperty("top", (ev.target.offsetTop - 50) + "px" );
        help.style.setProperty("position", "fixed");
        help.style.setProperty("margin","5px");
        setTimeout (()=>help.togglePopover(),200);
    })
}

function creatKanji(){
    let div = createDiv();
    div.classList.add("kanjiBlock");
    div.appendChild(createKanjiLeftBlock());
    div.appendChild(createKanjiRightBlock());
    return div;
}

btnAddKanji.onclick = function(){
    divList.appendChild(creatKanji())   
}

document.getElementById("btnCommandList").onclick = ()=>menu.togglePopover();
document.getElementById("btnHelp").onclick = ()=>help.togglePopover();

btnTextToJSON.addEventListener("click", textToJSON)
btnSaveJSON.addEventListener("click", downloadKanjiJSONFile)

function textToJSON(){
    let kanjis = [];
    let divList = document.querySelector("#list");
    let kanjiBlock = divList.querySelectorAll(".kanjiBlock")
    Array.from(kanjiBlock).forEach(block=>{
        let kanjiText = block.querySelector(".kanjiBox").value;
        let pronxText = block.querySelector(".pronounBox").value;

        let kanji = buildKanjiObject(kanjiText, pronxText);
        Array.from(block.querySelectorAll(".wordBlock")).forEach(wordBlock=>{
            let symbolText = wordBlock.querySelector(".symbolBox").value;
            let pronunText = wordBlock.querySelector(".pronunBox").value;
            let meaningText = wordBlock.querySelector(".meaningBox").value;

            let word = buildWordObject(symbolText, pronunText,meaningText);
            kanji.words.push(word);
        })
        
        kanjis.push(kanji);
    })
    encodingJson(kanjis);
    if (confirm("Converting to JSON is completed")){
        downloadKanjiJSONFile();
    }
}

function buildKanjiObject(kanji, prons){
    return {
        kanji: kanji,
        pronounciations: prons.split(",").map(s=>s.trim()),
        words: []
    }
}

function buildWordObject (symbol, prons, meanings){
    return {
        symbol,
        pronounciations: prons.split(",").map(s=>s.trim()),
        definitions: meanings.split(",").map(s=>s.trim())
    }
}

function downloadKanjiJSONFile() {
    contentDownloader.click();
}

function encodingJson(obj) {
    let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, "  "));
    contentDownloader.setAttribute("href", data);
}

txtFileName.addEventListener("change", function(ev){
    contentDownloader.setAttribute("download", `${ev.target.value}.json`);
})
