export function createDiv() {
    return document.createElement("div");
}

function createCheckBox(){
    let checkbox = document.createElement("input");
    setElementAttribute(checkbox, {type: "checkbox"});
    return checkbox;
}

function createTextBox(){
    let textBox = document.createElement("input");
    setElementAttribute(textBox, {type: "text"});
    return textBox;
}

export function createButton(btnText){
    let btn = document.createElement("button");
    btn.innerText = btnText;
    return btn;
}

export function toggleClassName(element, nameArr, onOff) {
    if (!isObject(element)) return printInvalidHTMLElement(element);
    if (onOff === undefined) element.classList.toggle(...nameArr);
    else if (onOff) element.classList.add(...nameArr);
    else element.classList.remove(...nameArr);
}

export function setElementAttribute(element, attr) {
    if (!isHTMlElement(element)) return printInvalidHTMLElement(element)
    if (!isObject(attr)) return printError("Invalid argument, attr is not an object", attr);
    Object.entries(attr).forEach(entry => {
        element.setAttribute(entry[0], entry[1])
    });
}

function hasProp(obj, propName) {
    return propName in obj;
}

function isObject(obj) {
    return obj instanceof Object;
}

function isHTMlElement(obj) {
    return obj instanceof Node &&
        obj instanceof HTMLElement;
}

function isHTMLInputElement(obj) {
    return obj instanceof HTMLInputElement;
}

function istext_HTMLInputElement(obj) {
    if (!isHTMLInputElement(obj)) return false;
    return obj.getAttribute("type") === "text";
}

function isCheckBox_HTMLInputElement(obj) {
    if (!isHTMLInputElement(obj)) return false;
    return obj.getAttribute("type") === "checkbox";
}

function printError(message, param) {
    console.log(message, ...param);
}

function printInvalidHTMLElement(param) {
    printError("Invalid argument, element is not an HTMLElement", arguments);
}

function printInvalidTextInput(param) {
    printError("Invalid argument, obj is not a text HTMLInputElement", arguments);
}

function printInvalidCheckBox(param) {
    printError("Invalid argument, obj is not a checkbox HTMLInputElement", arguments);
}

export function removeAllChild(element) {
    if (!isHTMlElement(element)) return printInvalidHTMLElement(element);
    toArray(element.childNodes).forEach(
        node => {
            element.removeChild(node);
        }
    );
}

export function prependChild(parentHTML, childHTML){
    if (!isHTMlElement(parentHTML)) return printInvalidHTMLElement(parentHTML);
    if (!isHTMlElement(childHTML)) return printInvalidHTMLElement(childHTML);
    parentHTML.prepend(childHTML);
}

export function toArray(collection) {
    return Array.from(collection)
}

export function appendChild(parentHTML, childHTML) {
    if (!isHTMlElement(parentHTML)) return printInvalidHTMLElement(parentHTML);
    if (!isHTMlElement(childHTML)) return printInvalidHTMLElement(childHTML);
    parentHTML.appendChild(childHTML);
}

function getParent(htmlElement) {
    if (!isHTMlElement(htmlElement)) return printInvalidHTMLElement(htmlElement);
    return htmlElement.parentElement;
}

function removeChild(parent, child) {
    if (!isHTMlElement(parent)) return printInvalidHTMLElement(parent);
    if (!isHTMlElement(child)) return printInvalidHTMLElement(child);
    parent.removeChild(child);
}

function getCollection(element, queryString) {
    if (!isHTMlElement(element)) return printInvalidHTMLElement(element);
    return toArray(element.querySelectorAll(queryString));
}

function getOne(element, queryString) {
    if (!isHTMlElement(element)) return printInvalidHTMLElement(element);
    return element.querySelector(queryString);
}

function getTextInputValue(element) {
    if (!istext_HTMLInputElement(element)) return printInvalidTextInput(element);
    return element.value
}

function getCheckBoxValue(ele) {
    if (!isCheckBox_HTMLInputElement(ele)) return printInvalidCheckBox(ele);
    return ele.checked
}

function setTextInputvalue(ele,value, triggerChange) {
    if (!istext_HTMLInputElement(ele)) return printInvalidTextInput(ele);
    ele.value = value;
    if (triggerChange) ele.dispatch(new Event("change"));
}

function check_ChecBox(cbx, triggerChange){
    if (!isCheckBox_HTMLInputElement(cbx)) return printInvalidCheckBox(cbx);
    if (triggerChange) ele.dispatch(new Event("change"));
}

function click_ChecBox(cbx){
    if (!isCheckBox_HTMLInputElement(cbx)) return printInvalidCheckBox(cbx);
    cbx.click();
}

function focus_Element(ele){
    if (!isHTMlElement(ele)) return printInvalidHTMLElement(ele);
    ele.focus();
}

function isFocused(ele){
    if (!isHTMlElement(ele)) return printInvalidHTMLElement(ele);
    return document.activeElement === ele;
}

export function bindClick(ele, callback){
    if (!isHTMlElement(ele)) return printInvalidHTMLElement(ele);
    ele.addEventListener("click",callback);
}

export function hardReload_WebPage(){
    document.location.reload(true);
}