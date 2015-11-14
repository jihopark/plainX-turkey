'use strict';

var React = require('react-native');
var update = require('react-addons-update');

//This mixin is to define common functions for Screen Components.

var ScreenMixin =  {
  propTypes: {
    leftNavBarButton: React.PropTypes.object.isRequired,
    rightNavBarButton: React.PropTypes.object.isRequired,
    routes: React.PropTypes.object.isRequired,
    pushScreen: React.PropTypes.func.isRequired,
  },
  setCardDataState: function(id, key, value) {
    var data = this.state.data;
    for (var i=0;i<data.cards.length;i++) {
      if (data.cards[i]["data"].id == id) {
        this.setState({data: update(data, {cards: {[i]: {data: {[key]: {$set: value}}}}})});
      }
    }
  }
};

module.exports = ScreenMixin;
