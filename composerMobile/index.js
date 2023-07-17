const divList = document.getElementById("list");
const btnAddKanji = document.getElementById("btnAddKanji");

function createDiv() {
    return document.createElement("div")
}

function createTextInput() {
    let textInput = document.createElement("input");
    textInput.setAttribute("type", "text");
    textInput.setAttribute("autocomplete", "disabled");
    return textInput;
}

function createKanjiLeftBlock() {
    let div = createDiv();
    div.classList.add("leftBlock");

    let kanjiBox = createTextInput();
    kanjiBox.classList.add("kanjiBox");
    kanjiBox.placeholder = "kanji"
    kanjiBox.addEventListener("focus", function (ev) {
        LastKnowInput = ev.target;
    });
    div.appendChild(kanjiBox);

    let pronounBox = createTextInput();
    pronounBox.classList = "pronounBox";
    pronounBox.placeholder = "pronounciations"
    addKeyDownInsertCommaCallback(pronounBox);
    div.appendChild(pronounBox);


    let buttonRemoveKanji = document.createElement("button");
    buttonRemoveKanji.innerHTML = "Remove Kanji"
    buttonRemoveKanji.classList.add("bgr_red-text_white")
    buttonRemoveKanji.onclick = () => {
        div.parentElement.classList.toggle("border_red")

        setTimeout(() => {
            if (confirm("Are you sure, you want to remove the kanji? ")) {
                div.parentElement.remove();
            } else {
                div.parentElement.classList.toggle("border_red")
            }
        }, 20);
    }

    div.appendChild(buttonRemoveKanji);

    return div;
}

function createKanjiRightBlock() {
    let rightBlock = createDiv();
    rightBlock.classList.add("rightBlock");

    let buttonAdd = document.createElement("button");
    buttonAdd.innerText = ("Add");
    buttonAdd.classList.add("bgr_green-text_white");
    buttonAdd.classList.add("btnAddWord");
    buttonAdd.onclick = function (ev) {
        let wordBlock = createWordBlock();
        rightBlock.insertBefore(wordBlock, buttonAdd);
    }
    rightBlock.appendChild(buttonAdd)
    rightBlock.insertBefore(createWordBlock(), buttonAdd);

    return rightBlock;
}

function createWordBlock() {
    let wordBlock = createDiv();
    wordBlock.classList.add("wordBlock")

    let buttonRemove = document.createElement("button");
    buttonRemove.innerText = "Remove";
    buttonRemove.classList.add("bgr_red-text_white1");
    buttonRemove.onclick = function (ev) {
        wordBlock.classList.toggle("border_red")
        setTimeout(() => {
            if (confirm("Are you sure? you want to remove this word defintion ")) {
                wordBlock.remove();
            } else {
                wordBlock.classList.toggle("border_red")
            }
        }, 20)
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

function addKeyDownInsertCommaCallback(input) {
    input.addEventListener("keydown", function (ev) {
        if (ev.altKey && ev.key == "7") {
            ev.target.value += ",";
            ev.target.selectionStart += 1;
        }
    })
    input.addEventListener("focus", function (ev) {
        LastKnowInput = ev.target;
        let help = document.getElementById('help')
        help.style.setProperty("left", ev.target.offsetLeft + "px");
        help.style.setProperty("top", (ev.target.offsetTop - 50) + "px");
        help.style.setProperty("position", "fixed");
        help.style.setProperty("margin", "5px");
        setTimeout(() => help.togglePopover(), 200);
    })
}

function creatKanji() {
    let div = createDiv();
    div.classList.add("kanjiBlock");
    div.appendChild(createKanjiLeftBlock());
    div.appendChild(createKanjiRightBlock());
    return div;
}

btnAddKanji.onclick = function () {
    let kanji = creatKanji();
    divList.appendChild(kanji);
    kanji.querySelector("input").focus();
}

document.getElementById("btnCommandList").onclick = () => menu.togglePopover();
document.getElementById("btnHelp").onclick = () => help.togglePopover();

btnTextToJSON.addEventListener("click", textToJSON)
btnSaveJSON.addEventListener("click", downloadKanjiJSONFile)

function textToJSON() {
    let kanjis = [];
    let divList = document.querySelector("#list");
    let kanjiBlock = divList.querySelectorAll(".kanjiBlock")
    Array.from(kanjiBlock).forEach(block => {
        let kanjiText = block.querySelector(".kanjiBox").value;
        let pronxText = block.querySelector(".pronounBox").value;

        let kanji = buildKanjiObject(kanjiText, pronxText);
        Array.from(block.querySelectorAll(".wordBlock")).forEach(wordBlock => {
            let symbolText = wordBlock.querySelector(".symbolBox").value;
            let pronunText = wordBlock.querySelector(".pronunBox").value;
            let meaningText = wordBlock.querySelector(".meaningBox").value;

            let word = buildWordObject(symbolText, pronunText, meaningText);
            kanji.words.push(word);
        })

        kanjis.push(kanji);
    })
    encodingJson(kanjis);
    if (confirm("Converting to JSON is completed")) {
        downloadKanjiJSONFile();
    }
}

function buildKanjiObject(kanji, prons) {
    return {
        kanji: kanji,
        pronounciations: prons.split(",").map(s => s.trim()),
        words: []
    }
}

function buildWordObject(symbol, prons, meanings) {
    return {
        symbol,
        pronounciations: prons.split(",").map(s => s.trim()),
        definitions: meanings.split(",").map(s => s.trim())
    }
}

function downloadKanjiJSONFile() {
    contentDownloader.click();
}

function encodingJson(obj) {
    let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, "  "));
    contentDownloader.setAttribute("href", data);
}

txtFileName.addEventListener("change", function (ev) {
    console.log(ev.target.value)
    contentDownloader.setAttribute("download", `${ev.target.value}.json`);
})

const btnOpen = document.getElementById("btnOpen");
let form = document.getElementById("wev");
btnOpen.addEventListener("click", function () {
    form.reset();
    uploader.click();

})

const fileDetail = {
    content: null,
    name: ""
}

function clearListSection() {
    const listDiv = document.getElementById("list");
    Array.from(listDiv.children).forEach(child => child.remove())
}

function openKanjiFile(fileContent) {
    clearListSection()
    renderKanjiList(fileContent)
}

function renderKanjiList(fileContent) {
    const listDiv = document.getElementById("list");
    fileContent.forEach(kanji => {
        const kanjiBlock = creatKanji();
        kanjiBlock.querySelector(".kanjiBox").value = kanji.kanji;
        kanjiBlock.querySelector(".pronounBox").value = kanji.pronounciations.join(", ")
        listDiv.appendChild(kanjiBlock);

        let rightBlock = kanjiBlock.querySelector(".rightBlock");
        let btnAddWord = kanjiBlock.querySelector(".btnAddWord");
        let clone = [...kanji.words];

        let firstWord = clone.splice(0, 1)[0];

        rightBlock.querySelector(".symbolBox").value = firstWord.symbol;
        rightBlock.querySelector(".pronunBox").value = firstWord.pronounciations.join(", ");
        rightBlock.querySelector(".meaningBox").value = firstWord.definitions.join(", ");

        clone.forEach(word => {
            let wordBlock = createWordBlock();
            wordBlock.querySelector(".symbolBox").value = word.symbol;
            wordBlock.querySelector(".pronunBox").value = word.pronounciations.join(", ");
            wordBlock.querySelector(".meaningBox").value = word.definitions.join(", ");

            rightBlock.insertBefore(wordBlock, btnAddWord);
        })

    })
}

const uploader = document.getElementById("uploader");
uploader.addEventListener("change", function (ev) {
    Array.from(ev.target.files).forEach((file) => {
        let reader = new FileReader();
        reader.onload = (ev) => {
            let data = JSON.parse(ev.target.result);
            fileDetail.content = data;
            fileDetail.name = file.name
            txtFileName.value = file.name.slice(0, file.name.lastIndexOf("."));
            txtFileName.dispatchEvent(new Event("change"));
            openKanjiFile(fileDetail.content)
        }
        reader.readAsText(file)
    })
})

function findSelectedInput() {
    const list = document.getElementById("list");
    const inputs = Array.from(list.querySelectorAll("input"));
    return {
        inputs,
        index: inputs.indexOf(LastKnowInput)
    }
}

let LastKnowInput = null;

function focusInput(context) {
    if (context.inputs[context.index]) {
        setTimeout(() => context.inputs[context.index].focus(), 20);
    } else {
        setTimeout(() => {
            if (LastKnowInput) {
                LastKnowInput.focus()
            }
        }, 20);
    }
}

btnPrevious.onclick = () => {
    let context = findSelectedInput();
    context.index -= 1;
    focusInput(context)
}

btnNext.onclick = () => {
    let context = findSelectedInput();
    context.index += 1;
    focusInput(context)
}

btnForceReload.onclick = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .getRegistrations()
            .then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister()
                }
            }).then(()=>{
                document.location.reload(true)
            })
    }
   
}

// alert(navigator.userAgent); console.log(navigator.userAgentData)
