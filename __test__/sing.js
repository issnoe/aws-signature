'use strict';
var awsSign = require('../dist/index.js');
const fetch = require("node-fetch");
try {

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
  const config = {
    credentials: {
      secret_key: '2D4F8fmBmyisDjSeeRm/6Of8FAd63d5gWBz4RW+q',
      access_key: 'AKIAIJIC4AGM75HKF6DA'
    },
    method: 'POST',
    url: 'https://pinpoint.us-east-1.amazonaws.com/v1/apps/2cdd69d44b9840a397344f601ae90e8b/messages',
    body: params,
    service_info: {
      region: 'us-east-1',
      service: 'mobiletargeting',
    }
  }
  const options = awsSign.signature(config);


  for (let index = 0; index < listTokens.length; index++) {
    fetch(config.url, options)
      .then(res => {
        res.json()
      })
      .then(json => {
        console.log(json)
      })
  }


} catch (error) {
  console.log(error);

}