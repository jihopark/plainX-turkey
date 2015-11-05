'use strict';

var React = require('react-native');
var {
  AppRegistry,
  PushNotificationIOS,
  AlertIOS,
  Navigator,
} = React;

var API_DOMAIN = 'https://plainexchange.herokuapp.com/api/v1/';

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
      <PlainNavigator
        api_domain={API_DOMAIN}/>
    );
  }
});
AppRegistry.registerComponent('plainX', () => body);
