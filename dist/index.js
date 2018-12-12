"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mypluralize_1 = require("@matersoft/mypluralize");
const crypto_1 = require("crypto");
function sendRequest() {
    return "hola mundo" + mypluralize_1.getPlural('luis');
}
exports.sendRequest = sendRequest;
function encrypt(key, src, encoding) {
    return crypto_1.default.createHmac('sha256', key).update(src, 'utf8').digest(encoding);
}
;
function hash(src) {
    src = src || '';
    return crypto_1.default.createHash('sha256').update(src, 'utf8').digest('hex');
}
;
function getDateTime() {
    const dt = new Date();
    const dateISO = dt.toISOString().replace(/[:\-]|\.\d{3}/g, '');
    const date = dateISO.substr(0, 8);
    return {
        dateISO,
        date
    };
}
function signature(config, xAmzDate) {
    const k = ('AWS4' + config.secretKey);
    const k_date = encrypt(k, xAmzDate.date);
    const k_region = encrypt(k_date, config.region);
    const k_service = encrypt(k_region, config.service);
    const k_signing = encrypt(k_service, 'aws4_request');
    return encrypt(signing_key, str_to_sign, 'hex');
}
function getAuthorization(config, xAmzDate) {
    const algorithm = 'AWS4-HMAC-SHA256';
    const signed_headers = "cache-control;content-length;content-type;host;postman-token;x-amz-date, ";
    const credential_scope = xAmzDate.date + '/' + config.region + '/' + config.service + '/' + 'aws4_request';
    const auth = algorithm + ' ' + 'Credential=' + config.accessKey + '/' + credential_scope + ', ' + 'SignedHeaders=' + signed_headers + ', ' + 'Signature=' + signature(config, xAmzDate);
    return 'AWS4-HMAC-SHA256 Credential=AKIAIJIC4AGM75HKF6DA/20181212/us-east-1/mobiletargeting/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=5b9ee0e2d61ddcf8d2a21a1d958f68a9c251a8d23d0e32efe9287ab7f6149e44';
}
function sing(config) {
    const xAmzDate = getDateTime();
    const authorization = getAuthorization(config, xAmzDate);
    return {
        'Host': 'pinpoint.us-east-1.amazonaws.com',
        'X-Amz-Date': xAmzDate.dateISO,
        'Authorization': authorization,
        'Content-Type': 'application/json'
    };
}
exports.sing = sing;
