function textToJSON() {
    let kanjis =
        composer.value.split("\n").filter(line => {
            return (checkKanjiDefinition(line))
        }).map(line => {
            let segments = wordsKanjiSplitor(line);
            let kanji = new KanjiDefinition();
            kanji.setKanji(segments.kanji);

            let pronounciations = interpretKanjiPronunciation(segments.pronunciation);
            kanji.setPronounciations(pronounciations);

            let words = interpretWord(segments.words);
            kanji.setWords(words);
            return kanji
        })
    encodingJson(kanjis);
}

function encodingJson(obj) {
    let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, "  "));
    contentDownloader.setAttribute("href", data);
}

btnTextToJSON.addEventListener("click", textToJSON)
btnSaveJSON.addEventListener("click", downloadKanjiJSONFile)

function simpleValidDataCheckup(rawText) {
    let colonIndex = rawText.indexOf(":");
    if (colonIndex > -1 && colonIndex < 10) {
        let closingCurlyBracketIndex = rawText.indexOf("}");
        return closingCurlyBracketIndex === rawText.length - 1;
    }
    return false;
}

const rgx_validDefinition = /^(?<kanji>.+):(?<pronunciation>.+,*)\_\{(?<words>.+\_.+\_.+;*)\}$/;
const rgx_validPronunciations = /.+,*/;
const rgx_validWordDefinitions = /.+\_.+\_.+;*/;

function checkKanjiDefinition(rawText) {
    return rgx_validDefinition.test(rawText);
}

class KanjiDefinition {
    constructor() {
        this.kanji = ""
        this.pronounciations = [];
        this.words = [];
    }

    setKanji(kanji) {
        this.kanji = kanji;
    }

    setPronounciations(pronounciations) {
        this.pronounciations = pronounciations
    }

    setWords(words) {
        this.words = words;
    }
}

class WordDefinition {
    constructor() {
        this.symbol = "";
        this.pronounciations = [];
        this.defintions = [];
    }

    setSymbol(symbol) {
        this.symbol = symbol;
    }

    setPronounciations(pronounciations) {
        this.pronounciations = pronounciations
    }

    setDefinitions(defintions) {
        this.defintions = defintions;
    }
}

function wordsKanjiSplitor(rawText) {
    return rgx_validDefinition.exec(rawText).groups;
}

function interpretWord(rawText) {
    if (rgx_validWordDefinitions.test(rawText)) {
        return rawText.split(";").map(rawWord => {
            let segments = rawWord.split("_");
            let word = new WordDefinition();
            word.setSymbol(segments[0]);
            word.setPronounciations(segments[1].split(","));
            word.setDefinitions(segments[2].split(","));
            return word;
        })
    } else {
        return null;
    }
}

function interpretKanjiPronunciation(rawText) {
    if (rgx_validPronunciations.test(rawText)) {
        return rawText.split(",").map(s => s.trim());
    }
    return [];
}

function downloadKanjiJSONFile() {
    contentDownloader.click();
}

window.addEventListener("keydown", function (ev) {
    let { key, altKey: alt } = ev;
    console.log(key, alt, ev.key);
    if (key === "j" && alt) {
        textToJSON();
        return;
    }

    if (key === "s" && alt) {
        downloadKanjiJSONFile();
        return;
    }
})

txtFileName.addEventListener("change", function(ev){
    contentDownloader.setAttribute("download", `${ev.target.value}.json`);
})