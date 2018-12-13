import * as crypto from 'crypto'
import * as url from 'url'
import { AWSAuthorization, AWSConfiguration, DateISO } from './interfaces'

function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string) {
  const kDate = hmac(dateStamp, "AWS4" + key);
  const kRegion = hmac(regionName, kDate);
  const kService = hmac(serviceName, kRegion);
  const kSigning = hmac("aws4_request", kService);
  return kSigning;
}
function hmac(key: any, stringTostring: any) {
  return crypto.createHmac('sha256', key).update(stringTostring, 'utf8').digest()
}

function hashSha256(body: string): any {
  return crypto.createHash('sha256').update(body).digest()
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


function getDateTime(): DateISO {
  const dt = new Date();
  const dateISO = dt.toISOString().replace(/[:\-]|\.\d{3}/g, '')
  const date = dateISO.substr(0, 8)
  return {
    dateISO,
    date
  }
}


export function sing(config: AWSConfiguration): AWSAuthorization {
  const xAmzDate: DateISO = getDateTime();
  let canonicalUri = '/';
  let canonicalQuerystring = ''
  let canonicalHeaders = 'content-type:' + config.contentType + '\n' + 'host:' + config.host + '\n' + 'x-amz-date:' + xAmzDate.date + '\n';
  const signedHeaders = 'content-type;host;x-amz-date;'

  const payloadHash = hashSha256(config.body).toString('hex')

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


  const signingKey = getSignatureKey(config.secretKey, xAmzDate.date, config.region, config.service)

  const signature = hmac(signingKey, stringToSign)

  const authorizationHeader = algorithm + ' ' + 'Credential=' + config.accessKey + '/' + credentialScope + ', ' + 'SignedHeaders=' + signedHeaders + ', ' + 'Signature=' + signature.toString('hex')

  const requestHeaders = {
    'Host': 'pinpoint.us-east-1.amazonaws.com',
    'X-Amz-Date': xAmzDate.dateISO,
    'Authorization': authorizationHeader,
    'Content-Type': 'application/json'
  }

  return requestHeaders;
}
class AWSSignature {
  constructor() {

  }
  private encrypt(key: any, src: any, encoding?: any) {
    return crypto.createHmac('sha256', key).update(src, 'utf8').digest(encoding);
  }
  private hash(src: any) {
    src = src || '';
    return crypto.createHash('sha256').update(src, 'utf8').digest('hex');
  }
  private canonical_headers(headers: any) {
    if (!headers || Object.keys(headers).length === 0) {
      return '';
    }
    return Object.keys(headers)
      .map(function (key) {
        return {
          key: key.toLowerCase(),
          value: headers[key] ? headers[key].trim().replace(/\s+/g, ' ') : ''
        };
      })
      .sort(function (a, b) {
        return a.key < b.key ? -1 : 1;
      })
      .map(function (item) {
        return item.key + ':' + item.value;
      })
      .join('\n') + '\n';
  };

  private signed_headers(headers: any) {
    return Object.keys(headers)
      .map(function (key) { return key.toLowerCase(); })
      .sort()
      .join(';');
  };

  private canonical_request(request: any) {
    var url_info = url.parse(request.url);
    return [
      request.method || '/',
      url_info.pathname,
      url_info.query,
      this.canonical_headers(request.headers),
      this.signed_headers(request.headers),
      this.hash(request.data)
    ].join('\n');
  };

  private parse_service_info(request: any) {
    var url_info = url.parse(request.url);
    const host: string = url_info.host || '';

    var matched = host.match(/([^\.]+)\.(?:([^\.]*)\.)?amazonaws\.com$/), parsed = (matched || []).slice(1, 3);
    if (parsed[1] === 'es') {
      parsed = parsed.reverse();
    }
    return {
      service: request.service || parsed[0],
      region: request.region || parsed[1]
    };
  };
  private credential_scope(d_str: any, region: any, service: any) {
    return [
      d_str,
      region,
      service,
      'aws4_request',
    ].join('/');
  }

  private string_to_sign(algorithm: any, canonical_request: any, dt_str: any, scope: any) {
    return [
      algorithm,
      dt_str,
      scope,
      this.hash(canonical_request)
    ].join('\n');
  }

  private get_signing_key(secret_key: any, d_str: any, service_info: any) {
    var k = ('AWS4' + secret_key), k_date = this.encrypt(k, d_str);
    let k_region = this.encrypt(k_date, service_info.region)
    let k_service = this.encrypt(k_region, service_info.service)
    let k_signing = this.encrypt(k_service, 'aws4_request');
    return k_signing;
  }
  private get_signature(signing_key: any, str_to_sign: any) {
    return this.encrypt(signing_key, str_to_sign, 'hex');
  }

  private get_authorization_header(algorithm: any, access_key: any, scope: any, signed_headers: any, signature: any) {
    return [
      algorithm + ' ' + 'Credential=' + access_key + '/' + scope,
      'SignedHeaders=' + signed_headers,
      'Signature=' + signature
    ].join(', ');
  }


  private handleSignatute(request: any, access_info: any, service_info: any) {
    if (service_info === void 0) { service_info = null; }
    request.headers = request.headers || {};
    // datetime string and date string
    var dt = new Date(), dt_str = dt.toISOString().replace(/[:\-]|\.\d{3}/g, ''), d_str = dt_str.substr(0, 8), algorithm = 'AWS4-HMAC-SHA256';
    var url_info = url.parse(request.url);
    request.headers['host'] = url_info.host;
    request.headers['x-amz-date'] = dt_str;
    if (access_info.session_token) {
      request.headers['X-Amz-Security-Token'] = access_info.session_token;
    }
    // Task 1: Create a Canonical Request
    var request_str = this.canonical_request(request);
    // Task 2: Create a String to Sign
    var service_info = service_info || this.parse_service_info(request), scope = this.credential_scope(d_str, service_info.region, service_info.service), str_to_sign = this.string_to_sign(algorithm, request_str, dt_str, scope);
    // Task 3: Calculate the Signature
    var signing_key = this.get_signing_key(access_info.secret_key, d_str, service_info), signature = this.get_signature(signing_key, str_to_sign);
    // Task 4: Adding the Signing information to the Request
    var authorization_header = this.get_authorization_header(algorithm, access_info.access_key, scope, this.signed_headers(request.headers), signature);
    request.headers['Authorization'] = authorization_header;
    return request;
  }


  public signature(config: any) {
    let { credentials, method = 'GET', url, body, service_info = null, headers = { 'Content-Type': 'application/json' } } = config;
    if (typeof body === 'object') body = JSON.stringify(body);

    let request = {
      method,
      url,
      headers,
      data: body,
      body: body
    };

    if (service_info === null) {
      service_info = {
        service: 'execute-api',
        region: 'us-east-1'
      }
    }
    return this.handleSignatute(request, credentials, service_info);
  }

}

export default new AWSSignature()
