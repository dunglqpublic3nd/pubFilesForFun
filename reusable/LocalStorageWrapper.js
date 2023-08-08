import { toArray } from "./DOM_Manipulators.js";

const ALL_ENTRIES = "Entries"
export class LocalStorageWrapper {
    #_keys = undefined
    constructor(){
        this.#_keys =  this._retrieveEntries();
        // this.keys = new Set();
    }

    _retrieveEntries(){
        let value = this.get(ALL_ENTRIES);
        if(value instanceof Array){
            return new Set(value);
        } else{
            return new Set();
        }
    }

    _updateKeys(){
        localStorage.setItem(ALL_ENTRIES, JSON.stringify(this.#_keys));
    }

    getKeys(){
        return toArray(this.#_keys)
    }

    removeAll(){
        toArray(this.#_keys).forEach(
            key=>localStorage.removeItem(key)
        );
        this.#_keys.clear();
        localStorage.removeItem(ALL_ENTRIES);
    }

    put(key, value){
        this.#_keys.add(key);
        this._updateKeys();
        localStorage.setItem(key, JSON.stringify(value));
    }

    remove(key){
        localStorage.removeItem(key);
        this.#_keys.delete(key);
        this._updateKeys();
    }

    get(key){
        return JSON.parse(localStorage.getItem(key));
    }

    take(key){
        let value = this.get(key);
        this.remove(key);
        this._updateKeys();
        return value;
    }

}