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
    var cards = this.state.data["Cards"];
    for (var i=0, numCards = cards.length ; i<numCards; i++) {
      if (cards[i]["UUID"] == id) {
        this.setState({data: update(this.state.data, {"Cards": {[i]: {"Data": {[key]: {$set: value}}}}})});
      }
    }
  },
  componentDidMount: function() {
    this.fetchData();
  },
};

module.exports = ScreenMixin;
