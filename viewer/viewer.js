
class Controller {
    constructor(){
        this.files = new Map();
    }

    release(){
        Array.from(content.children).forEach
            (element=>element.remove())
        this.files.clear();
    }

    display(name, jsonData){
        this.files.set(name,jsonData);
        content.appendChild(createListElement(name,jsonData));
    }
}

function createWordListReader(fileName){
    const reader = new FileReader();
    const _fileName = fileName;
    reader.onload = (ev)=>{
        let data = JSON.parse(ev.target.result);
        console.dir(_fileName);
        console.log(data);
        controller.display(_fileName, data);
    }
    return reader;
}

function createListElement(name, jsonData){
    let listBlock = document.createElement("div");
    listBlock.classList.add("kanjiList")
    let listName = document.createElement("p");
    listName.innerText = name;
    listName.classList.add("listName")
    listBlock.appendChild(listName);

    jsonData.forEach(Kanji=>{
        listBlock.appendChild(createKanjiBlock(Kanji))
    })

    return listBlock;
}

function createKanjiBlock(Kanji){
    let kanjiBlock = createBlock();
    let leftBlock = createBlock();
    let rightBlock = createBlock();

    kanjiBlock.className="kanjiBlock"
    kanjiBlock.appendChild(leftBlock);
    kanjiBlock.appendChild(rightBlock);

    leftBlock.classList.add("leftBlock");
    leftBlock.appendChild(createKanjiElement(Kanji.kanji));
    leftBlock.appendChild(createKanjiPronunciations(Kanji.pronounciations));

    rightBlock.classList.add("rightBlock");
    Kanji.words.forEach(word=>{
        let wordBlock  = createBlock();
        wordBlock.classList.add("wordBlock");
        wordBlock.appendChild(createSymbol(word.symbol));
        wordBlock.appendChild(createWordPronunciations(word.pronounciations));
        wordBlock.appendChild(createWordDefinitions(word.definitions));
        rightBlock.appendChild(wordBlock)
    })

    let clearBlock = createBlock();
    clearBlock.classList.add("clearBlock");
    kanjiBlock.appendChild(clearBlock);
    return kanjiBlock;
}

function createBlock(){
    return document.createElement("div");
}

function createKanjiElement(kanji){
    let div = document.createElement("div")
    div.innerText = kanji;
    return div;
}

function createKanjiPronunciations(pronounciations){
    let p = document.createElement("p");
    pronounciations.forEach((pronounciation,index)=>{
        let span = document.createElement("span");
        span.innerHTML = pronounciation;
        p.appendChild(span);
        if (index != pronounciations.length-1){
            p.append(", ");
        }
    })

    return p;
}

function createWord(word){
    let wordBlock = createBlock();
    wordBlock.appendChild(createSymbol(word.symbol));
    wordBlock.appendChild(createWordPronunciations(word.pronounciations));
    wordBlock.appendChild(createWordDefinitions(word.definitions));
    return wordBlock;
}

function createSymbol(symbol){
    let symbolBlock = createBlock();
    symbolBlock.innerHTML = symbol;
    return symbolBlock;
}

function createWordPronunciations(pronounciations){
    let p = document.createElement("p")
    pronounciations.forEach((pronounciation,index)=>{
        let span = document.createElement("span");
        span.innerHTML = pronounciation;
        p.appendChild(span);
        if (index!=pronounciations.length-1){
            p.append(", ");
        }
    })
    return p;
}

function createWordDefinitions(definitions){
    let p = document.createElement("p");
    definitions.forEach((definition,index)=>{
        let span = document.createElement("span");
        span.innerHTML = definition;
        p.appendChild(span);
        if(index!=definitions.length-1){
            p.append(", ");
        }
    })
    return p;
}

const controller = new Controller();

FileOpener.addEventListener("change", function(ev){
    controller.release();
    
    let collections = ev.target.files;
    if ("forEach" in collections){
        collections.forEach((file)=>{
            console.log(file.name, file.size);
            createWordListReader().readAsText(file);
        })
    } else {
        for (let index = 0; index < collections.length; index++) {
            const file = collections[index];
            createWordListReader(file.name).readAsText(file);
        }
    }  
})