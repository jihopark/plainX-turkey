'use strict';

var React = require('react-native');

//This mixin is to define common functions for Screen Components.

var ScreenMixin =  {
  propTypes: {
    leftNavBarButton: React.PropTypes.object.isRequired,
    rightNavBarButton: React.PropTypes.object.isRequired,
    routes: React.PropTypes.object.isRequired,
    pushScreen: React.PropTypes.func.isRequired,
  }

};

module.exports = ScreenMixin;
