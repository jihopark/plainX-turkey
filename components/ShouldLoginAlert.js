'use strict';

var React = require('react-native');
var {
  AlertIOS,
} = React;

var ShouldLoginAlert = {
  showAlert: function(message, onPressOK){
    console.log("SHOW ALERT");
    AlertIOS.alert(
      'Login Needed',
      message,
      [
        {text: 'OK', onPress: onPressOK},
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
      ]
    );
  }
};
module.exports = ShouldLoginAlert;
