'use strict';

var React = require('react-native');
var {
  AppRegistry,
  PushNotificationIOS,
  AlertIOS,
  Navigator,
} = React;


//var OffersList = require('./components/OffersList.js')

var body = React.createClass({
  _onCheckPermission: function(permission) {
    console.log("Permission alert:" + permission.alert + " badge:" + permission.badge + " sound:" + permission.sound)
    if (!permission.alert) {
      console.log("Request Permission");
      PushNotificationIOS.requestPermissions();
    }
    else {
      console.log("PushNotification add listener");
      PushNotificationIOS.addEventListener("notification", this._onNotification);
    }
  },
  _onNotification: function(notification) {
    AlertIOS.alert(
     'Notification Received',
     'Alert message: ' + notification.getMessage(),
     [{
       text: 'Dismiss',
       onPress: null,
     }]
   );
  },
  componentDidMount: function() {
    PushNotificationIOS.checkPermissions(this._onCheckPermission);
  },
  componentWillUnmount: function() {
    PushNotificationIOS.removeEventListener('notification', this._onNotification);
  },
  render: function() {
    var PlainNavigator = require('./components/PlainNavigator.js');
    return (
      <PlainNavigator />
    );
  }
});
AppRegistry.registerComponent('plainX', () => body);
