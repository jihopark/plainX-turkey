'use strict';

var LocationSelectCardMixin =  {
  locationSelectonNext: function(event) {
    var update = require('react-addons-update');

    var cards = this.state.data["Cards"];
    for (var i=0, numCards = cards.length ; i<numCards; i++) {
      if (cards[i]["UUID"] == event["id"]) {
        this.setState({data: update(this.state.data, {"Cards": {[i]: {"Data": { "Locations": { [event["Location"]]: {"IsSelected": {$set: event["IsSelected"]}}}}}}})});
      }
    }
  }
}

module.exports = LocationSelectCardMixin;
