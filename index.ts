import * as crypto from 'crypto'
import * as url from 'url'
import { AWSAuthorization, AWSConfiguration, DateISO } from './interfaces'



function encrypt(key: any, src: any, encoding?: any) {
  return crypto.createHmac('sha256', key).update(src, 'utf8').digest(encoding);
}
function hash(src: any) {
  src = src || '';
  return crypto.createHash('sha256').update(src, 'utf8').digest('hex');
}
function canonical_headers(headers: any) {
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

function signed_headers(headers: any) {
  return Object.keys(headers)
    .map(function (key) { return key.toLowerCase(); })
    .sort()
    .join(';');
};

function canonical_request(request: any) {
  var url_info = url.parse(request.url);
  return [
    request.method || '/',
    url_info.pathname,
    url_info.query,
    canonical_headers(request.headers),
    signed_headers(request.headers),
    hash(request.data)
  ].join('\n');
};

function parse_service_info(request: any) {
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
function credential_scope(d_str: any, region: any, service: any) {
  return [
    d_str,
    region,
    service,
    'aws4_request',
  ].join('/');
}

function string_to_sign(algorithm: any, canonical_request: any, dt_str: any, scope: any) {
  return [
    algorithm,
    dt_str,
    scope,
    hash(canonical_request)
  ].join('\n');
}

function get_signing_key(secret_key: any, d_str: any, service_info: any) {
  var k = ('AWS4' + secret_key), k_date = encrypt(k, d_str);
  let k_region = encrypt(k_date, service_info.region)
  let k_service = encrypt(k_region, service_info.service)
  let k_signing = encrypt(k_service, 'aws4_request');
  return k_signing;
}
function get_signature(signing_key: any, str_to_sign: any) {
  return encrypt(signing_key, str_to_sign, 'hex');
}

function get_authorization_header(algorithm: any, access_key: any, scope: any, signed_headers: any, signature: any) {
  return [
    algorithm + ' ' + 'Credential=' + access_key + '/' + scope,
    'SignedHeaders=' + signed_headers,
    'Signature=' + signature
  ].join(', ');
}


function handleSignatute(request: any, access_info: any, service_info: any) {
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
  var request_str = canonical_request(request);
  // Task 2: Create a String to Sign
  var service_info = service_info || parse_service_info(request), scope = credential_scope(d_str, service_info.region, service_info.service), str_to_sign = string_to_sign(algorithm, request_str, dt_str, scope);
  // Task 3: Calculate the Signature
  var signing_key = get_signing_key(access_info.secret_key, d_str, service_info), signature = get_signature(signing_key, str_to_sign);
  // Task 4: Adding the Signing information to the Request
  var authorization_header = get_authorization_header(algorithm, access_info.access_key, scope, signed_headers(request.headers), signature);
  request.headers['Authorization'] = authorization_header;
  return request;
}


export function signature(config: any) {
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
  return handleSignatute(request, credentials, service_info);
}


