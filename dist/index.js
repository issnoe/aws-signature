"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
/**
def sign(key, msg):
    return hmac.new(key, msg.encode("utf-8"), hashlib.sha256).digest()

def getSignatureKey(key, date_stamp, regionName, serviceName):
    kDate = sign(('AWS4' + key).encode('utf-8'), date_stamp)
    kRegion = sign(kDate, regionName)
    kService = sign(kRegion, serviceName)
    kSigning = sign(kService, 'aws4_request')
    return kSigning
 */
function encrypt(key, src, encoding) {
    return crypto.createHmac('sha256', key).update(src, 'utf8').digest();
}
;
function hmac(key, stringTostring) {
    return encrypt(key, stringTostring, 'hex');
}
function signKey(key, msg) {
    return "";
}
function getSignatureKey(key, date_stamp, regionName, serviceName) {
    const kDate = signKey('AWS4' + key); //signKey(('AWS4' + key).encode('utf-8'), date_stamp)
    const kRegion = signKey(kDate, regionName);
    const kService = signKey(kRegion, serviceName);
    const kSigning = signKey(kService, 'aws4_request');
    return kSigning;
}
function hashSha256(body) {
    return crypto.createHash('sha256').update(body).digest('hex');
}
/* function encrypt(key: string, src?: string, encoding?: string) {
  return crypto.createHmac('sha256', key).update("src", 'utf8').digest();
}; */
function hash(src) {
    src = src || '';
    return crypto.createHash('sha256').update(src, 'utf8').digest('hex');
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
    //Signing key
    const k = ('AWS4' + config.secretKey);
    /*  const k_date = encrypt(k, xAmzDate.date)
     const k_region = encrypt(k_date, config.region)
     const k_service = encrypt(k_region, config.service);
     const k_signing = encrypt('k_service', 'aws4_request'); */
    /* return encrypt('signing_key', 'str_to_sign', 'hex'); */
    return '';
}
function getAuthorization(config, xAmzDate) {
    const algorithm = 'AWS4-HMAC-SHA256';
    const signed_headers = "cache-control;content-length;content-type;host;postman-token;x-amz-date, ";
    const credential_scope = xAmzDate.date + '/' + config.region + '/' + config.service + '/' + 'aws4_request';
    const auth = algorithm + ' ' + 'Credential=' + config.accessKey + '/' + credential_scope + ', ' + 'SignedHeaders=' + signed_headers + ', ' + 'Signature=' + signature(config, xAmzDate);
    return 'AWS4-HMAC-SHA256 Credential=AKIAIJIC4AGM75HKF6DA/20181212/us-east-1/mobiletargeting/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=5b9ee0e2d61ddcf8d2a21a1d958f68a9c251a8d23d0e32efe9287ab7f6149e44';
}
function canonicalRequest() {
}
function sing(config) {
    const xAmzDate = getDateTime();
    //const authorization = getAuthorization(config, xAmzDate);
    let canonicalUri = '/';
    let canonicalQuerystring = '';
    let canonicalHeaders = 'content-type:' + config.contentType + '\n' + 'host:' + config.host + '\n' + 'x-amz-date:' + xAmzDate.date + '\n';
    const signedHeaders = 'content-type;host;x-amz-date;';
    const payloadHash = hashSha256("{s:''}");
    const canonicalRequest = config.method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\n' + signedHeaders + '\n' + payloadHash;
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = xAmzDate.date + '/' + config.region + '/' + config.service + '/' + 'aws4_request';
    const canonicalRequestHash = hashSha256(canonicalRequest);
    //hashlib.sha256(canonicalRequest.encode('utf-8')).hexdigest()
    const stringTosign = algorithm + '\n' + xAmzDate.dateISO + '\n' + credentialScope + '\n' + canonicalRequestHash;
    const signingKey = getSignatureKey(config.secretKey, xAmzDate.date, config.region, config.service);
    const signature = hmac(signingKey, stringTosign);
    /**
     signature = hmac.new(signing_key, (string_to_sign).encode('utf-8'), hashlib.sha256).hexdigest()
     */
    const authorizationHeader = algorithm + ' ' + 'Credential=' + config.accessKey + '/' + credentialScope + ', ' + 'SignedHeaders=' + signedHeaders + ', ' + 'Signature=' + signature;
    /*  authorization_header = algorithm + ' ' + 'Credential=' + access_key + '/' + credential_scope + ', ' +  'SignedHeaders=' + signed_headers + ', ' + 'Signature=' + signature */
    const requestHeaders = {
        'Host': 'pinpoint.us-east-1.amazonaws.com',
        'X-Amz-Date': xAmzDate.dateISO,
        'Authorization': authorizationHeader,
        'Content-Type': 'application/json'
    };
    //const requestStr = canonicalRequest(request);
    return requestHeaders;
}
exports.sing = sing;
