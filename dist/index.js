"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mypluralize_1 = require("@matersoft/mypluralize");
function sendRequest() {
    return "hola mundo" + mypluralize_1.getPlural('luis');
}
exports.sendRequest = sendRequest;
function sing(config) {
    let algorithm = 'AWS4-HMAC-SHA256';
    let dt = new Date();
    let dt_str = dt.toISOString().replace(/[:\-]|\.\d{3}/g, '');
    let d_str = dt_str.substr(0, 8);
    console.log(d_str);
    return {
        'Host': 'string',
        'X-Amz-Date': 'string',
        'Authorization': 'string',
        'Content-Type': 'string'
    };
}
exports.sing = sing;
const config = {
    accessKey: 'AKIAIJIC4AGM75HKF6DA',
    secretKey: '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',
    region: 'us-east-1',
    service: 'mobiletargeting'
};
const s = sing(config);
console.log(s);
