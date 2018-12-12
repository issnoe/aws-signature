'use strict';
var index = require('../dist/index.js');

const fetch = require('fetch').fetchUrl
const requestPromise = require('request-promise-native')

test('Get AWS Sign Configuration', () => {
  const config = {
    accessKey: 'AKIAIJIC4AGM75HKF6DA',
    secretKey: '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',
    region: 'us-east-1',
    service: 'mobiletargeting'
  }
  const awsSing = index.sing(config)
  console.log(awsSing);
  var options = {
    method: 'GET',
    uri: `https://pinpoint.us-east-1.amazonaws.com/v1/apps/2cdd69d44b9840a397344f601ae90e8b`,
    headers: awsSing
  }

  requestPromise(options, (err, res) => {
    console.log(err, res.body);
  })
  var params = {
    "Context": {

    },
    "MessageConfiguration": {

      "GCMMessage": {
        "Body": "string",
        "Substitutions": {

        },
        "Title": "string",
        "Action": "OPEN_APP",
        "Url": "string",
        "SilentPush": true,
        "Data": {

        },
        "IconReference": "string",
        "Sound": "string",
        "ImageUrl": "string",
        "ImageIconUrl": "string",
        "SmallImageIconUrl": "string",
        "RawContent": "string",
        "CollapseKey": "string",
        "RestrictedPackageName": "string",
        "TimeToLive": 0,
        "Priority": "string"
      }

    },
    "Addresses": {
      "d-AukM3RHFM:APA91bGKctcqD_k82sA7xwUSVaA7cVgVHNZQLdz5IESuwbqcnwhCMYQ-r1NEuP0r5S3hEZ8Tqr_BZwONAW4rOUPzFqNFBgycmMpN47kUsZc74LqPXwNMTGBZg6Wjbc5xh9i5EiT7sMHA": {
        "BodyOverride": "",
        "ChannelType": "GCM",
        "Context": {},
        "RawContent": "hi",
        "Substitutions": {},
        "TitleOverride": ""
      }
    },

  }
  fetch('https://pinpoint.us-east-1.amazonaws.com/v1/apps/2cdd69d44b9840a397344f601ae90e8b/messages', {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(params),
    headers: awsSing,
  }, (error, meta, body) => {
    if (error) {
      return console.log('ERROR', error.message || error);
    }

    console.log('META INFO');
    console.log(meta);

    console.log('BODY');
    console.log(body.toString('utf-8'));
  })


});