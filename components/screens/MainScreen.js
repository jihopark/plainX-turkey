'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} = React;

var OffersList = require('../OffersList.js');
var Routes = require('../screens/Routes.js');
var ScreenMixin = require('./ScreenMixin.js');
var PlainListView = require('../PlainListView.js');
var update = require('react-addons-update');

var MainScreen = React.createClass({
  mixins: [ScreenMixin],
  getInitialState: function() {
    return {
      data: {
        cards: [
          {
            name: "Explanation",
            data:{
              id: 1
            }
          },
          {
            name: "CurrencySelect",
            data: {
              id: 2,
              currencyA: "HKD",
              currencyB: "USD"
            }
          }
        ]
      }
    };
  },
  subscribeToNavBarSubjects: (left, right) => {
    left.subscribe((x) => console.log(x));
    right.subscribe((x) => console.log(x));
  },
  currencySelectCardOnNext: function(event) {
    if (event.currencyA) {
      this.setCardDataState(event.id, "currencyA", event.currencyA);
    }
    else if (event.currencyB) {
      this.setCardDataState(event.id, "currencyB", event.currencyB);
    }


  },
  render: function() {
    this.subscribeToNavBarSubjects(this.props.leftNavBarButtonSubject, this.props.rightNavBarButtonSubject);
    var cardObservers = { }
    cardObservers["CurrencySelect"] = this.currencySelectCardOnNext;

    return (
      <View style={styles.container}>
        <PlainListView
          cardObservers={cardObservers}
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


module.exports = MainScreen;
