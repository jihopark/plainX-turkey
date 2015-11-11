'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
} = React;

var PlainListView = require('../components/PlainListView.js');

var OffersScreen = React.createClass({
  displayName: "OffersScreen",
  _cardObservers: {
    "Offer": (input) => console.log("Clicked Offer Card with id of "+input)
  },
  getInitialState: function() {
    return {
      data: {
        cards: [
          {
            name: "Explanation"
          },
          {
            name: "CurrencySelect"
          },
          {
            name: "Offer",
            data: {
              id: 1
            }
          },
          {
            name: "Offer",
            data: {
              id: 2
            }
          },
          {
            name: "Offer",
            data: {
              id: 3
            }
          }
        ]
      }
    };
  },
  render: function() {
    return (
      <View style={styles.container}>
        <PlainListView
          cardObservers={this._cardObservers}
          cards={this.state.data.cards}/>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});


module.exports = OffersScreen;
