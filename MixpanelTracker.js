'use strict'

var DeviceInfo = require('react-native-device-info');

const TRACK_URL = "http://api.mixpanel.com/track/?data=";
const PROFILE_URL = "http://api.mixpanel.com/engage/?data=";

var PlainLog = require('./PlainLog.js');
var P = new PlainLog("MixpanelTracker");

var Buffer = require('buffer').Buffer
var TOKEN = require('./constants/BuildConstants').MIXPANEL_TOKEN;

var RestKit = require('react-native-rest-kit');

var MixpanelTracker = (function () {
    var baseData;

    function getBaseData() {
        if (!baseData) {
          baseData = {
            "token": TOKEN,
            "distinct_id": DeviceInfo.getUniqueID(),
            "model": DeviceInfo.getModel(),
            "system_version": DeviceInfo.getSystemVersion(),
            "client_version": DeviceInfo.getVersion(),
            "default_locale": DeviceInfo.getDeviceLocale(),
          };
        }
        return baseData;
    }

    return {
        trackScreenEvent(name, params) {
          var data = JSON.parse(JSON.stringify(getBaseData()));
          data["event_type"] = "screen";
          for (var key in params)
            data[key] = params[key];

          data = {"event": name, "properties": data};

          var b = new Buffer(JSON.stringify(data)).toString('base64');

          var request = {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: ''
          };

          P.log("trackEvent", request);

          RestKit.send(TRACK_URL+b, request, (error,json) => console.log("RESULT " + error + " " + json) );
          P.log("trackEvent", data);
        },
        setProfile(email) {
          var data = JSON.parse(JSON.stringify(getBaseData()));
          var token = data["token"];
          var distinct_id = data["distinct_id"];
          delete data["token"];
          delete data["distinct_id"];
          if (email)
            data["$email"] = email;
          data = {
            "$distinct_id": distinct_id,
            "$token": token,
            "$set": data,
          }
          var b = new Buffer(JSON.stringify(data)).toString('base64');
          var request = {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: ''
          };

          RestKit.send(PROFILE_URL+b, request, (error,json) => console.log("RESULT " + error + " " + json) );
          P.log("setProfile", data);
        },
    };
})();


module.exports = MixpanelTracker;
