'use strict'

var DeviceInfo = require('react-native-device-info');

const TRACK_URL = "http://api.mixpanel.com/track/?data=";
const PROFILE_URL = "http://api.mixpanel.com/engage/?data=";
const TOKEN_DEV = "b96294c2f2d4ba22307fc1396251b62a";
const TOKEN_PRO = "c350b022d1918a7139a9b08a682aecc3";

var PlainLog = require('./PlainLog.js');
var P = new PlainLog("MixpanelTracker");

var Buffer = require('buffer').Buffer

var RestKit = require('react-native-rest-kit');

var MixpanelTracker = (function () {
    var baseData;

    function getBaseData() {
        if (!baseData) {
          baseData = {
            "token": TOKEN_DEV,
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
