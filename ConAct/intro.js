let fx = ()=>{};
let collection = {
    conditions: [
        { // condition 
            condition: fx,
            onfail: fx,
        }
    ],
    onMatchAll: ()=>{},
    onMatchSome: ()=>{},
}

let single = {
    condition: fx,
    onfail: fx,
    onMatch: fx,
}
let trailing = {
    /* ???? */
}
const fromEnum=[];
let collectionTrailing = {
    continueCondition: fromEnum,
    // consider late binding,
    // consider step binding,
    // consider description object
}

/*
    intro I'm building a library based on step of execution, functional programming alike
*/