// alert("ready for action");
class ComposerHistory {
    constructor() {
        this._history = [];
        this._isUndo = false;
        this._index = -1;
    }

    setUndoTrue() {
        this._isUndo = true;
    }

    setUndoFalse() {
        this._isUndo = false;
    }

    reset() {
        this._history = [];
        this._isUndo = false;
        this._index = -1;
    }

    registerChange(value, caretPosition) {
        if (this._isUndo) {
            this.setUndoFalse();
            this._history.splice(this._index + 1);
            this._history.push({ value, pos: caretPosition });
            this._index += 1;
        } else {
            this._history.push({ value, pos: caretPosition });
            this._index = this._history.length - 1;
        }
    }

    undo() {
        if (!this._isUndo) this.setUndoTrue();
        if (this._index > 0) {
            this._index -= 1;
            return this._history[this._index];
        } else {
            return this._history[0];
        }
    }

    redo() {
        if (!this._isUndo) return this._history[this._index];
        if (this._index < this._history.length - 1) {
            if (this._index === this._history.length - 2) this.setUndoFalse();
            this._index += 1;
            return this._history[this._index];
        }
    }

    log() {
        // console.log(this._isUndo, this._index, this._history);
    }
}

const composerHistory = new ComposerHistory();
composerHistory.registerChange(composer.value, composer.selectionEnd);

composer.addEventListener("input", function valueChanged(ev) {
    composerMakeChange(ev.target.value)
})

function insertValue(value) {
    let index;
    if (composer === document.activeElement) {
        index = composer?.selectionStart
        // console.log()
        let textData = composer.value;
        composer.value = textData.slice(0, index)
            + value
            + textData.slice(index);
        // composer.selectionStart = index+value.length;
        // composer.selectionEnd = index;
        composer.selectionEnd = index+value.length;
        composerMakeChange(composer.value);

    }
}

function insertComma() {
    insertValue(",");
}

function insertNewDefintion() {
    insertValue("<kanji>:<pronunciations>_{<words>;}");
}

function insertOpeningCurlyBracket() {
    insertValue("{");
}

function insertUnderScore() {
    insertValue("_");
}

function insertClosingCurlyBracket() {
    insertValue("}");
}

function insertSemicolon() {
    insertValue(";");
}

function insertColon() {
    insertValue(":");
}

function composerMakeRedo() {
    let detail = composerHistory.redo();
    // console.log(detail)
    composer.value = detail.value;
    composer.selectionEnd = detail.pos;
    composerHistory.log();
}

function composerMakeChange(value) {
    composerHistory.registerChange(value, composer.selectionEnd)
    composerHistory.log();

}

function composerMakeUndo() {
    let detail = composerHistory.undo();
    // console.log(detail)
    composer.value = detail.value;
    composer.selectionEnd = detail.pos;
    composerHistory.log();

}

window.addEventListener("keydown", function (ev) {
    // let key = ev.key, alt = ev.altKey;
    let { key, altKey: alt, ctrlKey: ctrl } = ev;
    if (key === "2" && alt) {
        insertNewDefintion();
        return;
    }

    if (key === "7" && alt) {
        insertComma();
        return
    }

    if (key === "8" && alt) {
        insertSemicolon();
        return;
    }

    if (key === "9" && alt) {
        insertUnderScore();
        return
    }

    // if (key === "3" && alt){
    //     insertOpeningCurlyBracket();
    //     return;
    // }

    // if (key === "4" && alt){
    //     insertClosingCurlyBracket();
    //     return;
    // }

    if (key === "1" && alt) {
        composer.focus();
        return;
    }

    if (key === "m" && alt) {
        menu?.togglePopover();
        return;
    }

    if (key === "h" && alt) {
        help?.togglePopover();
        return;
    }
});
composer.addEventListener("keydown", function (ev) {
    let { key, ctrlKey: ctrl } = ev;
    if (key === "z" && ctrl) {
        // undo block  
        // console.log("composer", key, ctrl)
        ev.preventDefault();
        composerMakeUndo();
        return;
    }
    if (key === "y" && ctrl) {
        // redo block
        // console.log("composer", key, ctrl)

        ev.preventDefault();
        composerMakeRedo();
        return;

    }
})