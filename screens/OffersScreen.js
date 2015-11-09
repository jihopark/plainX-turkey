'use strict';

var React = require('react-native');

var PlainListView = require('../components/PlainListView.js');

var OffersScreen = React.createClass({
  displayName: "OffersScreen",
  getInitialState: function() {
    return {
      data: {
        cards: [
          {
            name: "Offer"
          },
          {
            name: "CurrencySelect"
          },
          {
            name: "Explanation"
          }
        ]
      }
    };
  },
  render: function() {
    return (
      <PlainListView
        cards={this.state.data.cards}/>
    );
  }
});


module.exports = OffersScreen;
