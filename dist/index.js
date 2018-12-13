"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
//import * as cryptoJs from "crypto-js"
function getSignatureKey(key, dateStamp, regionName, serviceName) {
    const kDate = hmac(dateStamp, "AWS4" + key);
    const kRegion = hmac(regionName, kDate);
    const kService = hmac(serviceName, kRegion);
    const kSigning = hmac("aws4_request", kService);
    return kSigning;
}
function hmac(key, stringTostring) {
    return crypto.createHmac('sha256', key).update(stringTostring, 'utf8').digest();
}
function hashSha256(body) {
    return crypto.createHash('sha256').update(body).digest();
}
/* function getSignatureKey(key: string, date_stamp: string, regionName: string, serviceName: string): string {
  const kDate = signKey('AWS4' + key, date_stamp);//signKey(('AWS4' + key).encode('utf-8'), date_stamp)
  const kRegion = signKey(kDate, regionName)
  const kService = signKey(kRegion, serviceName)
  const kSigning = signKey(kService, 'aws4_request')
  return kSigning
} */
/* crypto.createHash("sha256").update(canonString).digest();
console.log("Canonical hash is   :", canonHash.toString('hex')); */
function getDateTime() {
    const dt = new Date();
    const dateISO = dt.toISOString().replace(/[:\-]|\.\d{3}/g, '');
    const date = dateISO.substr(0, 8);
    return {
        dateISO,
        date
    };
}
function sing(config) {
    const xAmzDate = getDateTime();
    let canonicalUri = '/';
    let canonicalQuerystring = '';
    let canonicalHeaders = 'content-type:' + config.contentType + '\n' + 'host:' + config.host + '\n' + 'x-amz-date:' + xAmzDate.date + '\n';
    const signedHeaders = 'content-type;host;x-amz-date;';
    const payloadHash = hashSha256(config.body).toString('hex');
    const canonicalRequest = config.method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\n' + signedHeaders + '\n' + payloadHash.toString('hex');
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = xAmzDate.date + '/' + config.region + '/' + config.service + '/' + 'aws4_request';
    //old
    /*
      const canonicalRequestHash = hashSha256(canonicalRequest)
  
      const stringToSign = algorithm + '\n' + xAmzDate.dateISO + '\n' + credentialScope + '\n' + canonicalRequestHash
    */
    //--
    //New
    const stringToSign = [
        algorithm,
        xAmzDate.dateISO,
        credentialScope,
        hashSha256(canonicalRequest).toString('hex')
    ].join('\n');
    const signingKey = getSignatureKey(config.secretKey, xAmzDate.date, config.region, config.service);
    const signature = hmac(signingKey, stringToSign);
    const authorizationHeader = algorithm + ' ' + 'Credential=' + config.accessKey + '/' + credentialScope + ', ' + 'SignedHeaders=' + signedHeaders + ', ' + 'Signature=' + signature.toString('hex');
    const requestHeaders = {
        'Host': 'pinpoint.us-east-1.amazonaws.com',
        'X-Amz-Date': xAmzDate.dateISO,
        'Authorization': authorizationHeader,
        'Content-Type': 'application/json'
    };
    return requestHeaders;
}
exports.sing = sing;
async function run() {
}
exports.run = run;
