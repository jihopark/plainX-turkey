'use strict';

var React = require('react-native');
var {
  AlertIOS,
} = React;

var strings = {
  "login_connect_offer": ["Login to connect to this offer", "We want to know you more!"],
  "connected_offer": ["You are already connected to this offer", "", "", "Go to conversation"],
  "remove_offer": ["Are you sure?", "All offer details and conversations will be deleted. This action cannot be undone.", "Yes", "No"]

};

var AlertUtil = {
  LOGIN_CONNECT_OFFER: "login_connect_offer",
  CONNECTED_OFFER: "connected_offer",
  REMOVE_OFFER: "remove_offer",
  showAlert: function(type, onPressNegative, onPressPositive){
    AlertIOS.alert(
      strings[type][0],
      strings[type][1],
      [
      //  {text: (strings[type][2] || 'Cancel'), onPress: (onPressNegative || () => null)},
      //  {text: (strings[type][3] || 'OK'), onPress: (onPressPositive || () => null)},
      ]
    );
  }
};
module.exports = AlertUtil;
