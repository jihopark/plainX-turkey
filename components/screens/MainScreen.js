'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} = React;

var Routes = require('../screens/Routes.js');
var ScreenMixin = require('./ScreenMixin.js');
var PlainListView = require('../PlainListView.js');
var update = require('react-addons-update');

var MainScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "MainScreen",
  endPoint: "main",
  getInitialState: function() {
    return {
      data: null
    }
  },
  fetchData: function() {
    fetch(this.props.api_domain + this.endPoint)
      .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData);
          this.setState({
            data: responseData,
          });
        })
        .done();
  },
  subscribeToNavBarSubjects: (left, right) => {
    left.subscribe((x) => console.log(x));
    right.subscribe((x) => console.log(x));
  },
  currencySelectCardOnNext: function(event) {
    if (event["CurrencyA"]) {
      this.setCardDataState(event["UUID"], "CurrencyA", event["CurrencyA"]);
    }
    else if (event["CurrencyB"]) {
      this.setCardDataState(event["UUID"], "CurrencyB", event["CurrencyB"]);
    }
  },
  render: function() {
    this.subscribeToNavBarSubjects(this.props.leftNavBarButtonSubject, this.props.rightNavBarButtonSubject);

    if (this.state.data) {
      var cardObservers = { }
      cardObservers["CurrencySelect"] = this.currencySelectCardOnNext;

      return (
        <View style={styles.container}>
          <PlainListView
            cardObservers={cardObservers}
            cards={this.state.data["Cards"]}/>
        </View>
      );
    }
    else {
      return (
        <View style={styles.container}>
          <Text>Loading..</Text>
        </View>
      );
    }
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
