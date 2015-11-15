'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./ScreenMixin.js');

var OffersScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "OffersScreen",
  cardObservers: {
    "Offer": (input) => console.log("Clicked Offer Card with id of "+input)
  },
  getInitialState: function() {
    return {
      data: {
        "Cards": [
          {
            "Name": "Explanation",
            "Data": {
              "UUID": 3,
              "Text": "This is OffersList"
            }
          },
          {
            "Name": "Offer",
            "Data": {
              "UUID": 1
            }
          },
          {
            "Name": "Offer",
            "Data": {
              "UUID": 2
            }
          },
          {
            "Name": "Offer",
            "Data": {
              "UUID": 3
            }
          }
        ]
      }
    };
  },
  fetchData: function() {

  },
  render: function() {
    return (
      <View style={styles.container}>
        <PlainListView
          cardObservers={this.cardObservers}
          cards={this.state.data["Cards"]}/>
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
