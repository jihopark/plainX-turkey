'use strict'

var DeviceInfo = require('react-native-device-info');


var MixpanelTracker = (function () {
    var deviceInfo;

    return {
        getDeviceInfo: function () {
            if (!deviceInfo) {
              deviceInfo = {
                "uuid": DeviceInfo.getUniqueID(),
                "model": DeviceInfo.getModel(),
                "system_version": DeviceInfo.getSystemVersion(),
                "client_version": DeviceInfo.getVersion(),
                "default_locale": DeviceInfo.getDeviceLocale(),
              };
            }
            return deviceInfo;
        },
    };
})();


module.exports = MixpanelTracker;
