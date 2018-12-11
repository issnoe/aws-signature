"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mypluralize_1 = require("@matersoft/mypluralize");
function sendRequest() {
    return "hola mundo" + mypluralize_1.getPlural('luis');
}
exports.sendRequest = sendRequest;
const s = sendRequest();
console.log(s);
