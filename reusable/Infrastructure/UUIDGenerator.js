
const UUIDs = new Set();
export const generateId = function () {

    let uuid;
    do {
        uuid = crypto && crypto.randomUUID ?
            crypto.randomUUID() :
            gen_UUID();
    } while (UUIDs.has(uuid))
    UUIDs.add(uuid);
    return uuid;
}
Object.defineProperty(window, "generateUUID", {
    value: generateId
})

function gen_UUID() {
    let dict = "abcdefghjklmnopqrstuvwxyz123456789"
    let uuid = "";
    for (let index = 0; index < 8; index++) {
        uuid += dict[parseInt(dict.length * Math.random())];
    }
    return uuid;
}

export function printGeneratedUUID() {
    console.log(Array.from(UUIDs));
    return Array.from(UUIDs.entries())
}