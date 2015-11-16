'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} = React;

var Routes = require('../screens/Routes.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var CurrencyPickerMixin = require('./componentMixins/CurrencyPickerMixin.js');
var CurrencySelectCardMixin = require('./cardMixins/CurrencySelectMixin.js');

var PlainListView = require('../PlainListView.js');
var CurrencyPicker = (Platform.OS === 'ios') ? require('../CurrencyPicker.ios.js') : require('../CurrencyPicker.android.js');


var MainScreen = React.createClass({
  mixins: [ScreenMixin, CurrencyPickerMixin, CurrencySelectCardMixin],
  displayName: "MainScreen",
  endPoint: "main",
  getInitialState: function() {
    return {
      data: null,
      showCurrencyPicker: false,
      currencyList: [],
      targetInput: null,
      currencySelectId: null,
      currentCurrency: null
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
  render: function() {
    this.subscribeToNavBarSubjects(this.props.leftNavBarButtonSubject, this.props.rightNavBarButtonSubject);

    if (this.state.data) {
      var cardObservers = { }
      cardObservers["CurrencySelect"] = this.currencySelectCardOnNext;

      var listView = (
        <PlainListView
          cardObservers={cardObservers}
          cards={this.state.data["Cards"]}/>);

      if (this.state.showCurrencyPicker) {
        var currencyPicker = (
          <CurrencyPicker
            currentCurrency={this.state.currentCurrency}
            currencyList={this.state.currencyList}
            onPickerValueChange={this.onPickerValueChange}
            dismissPicker={this.dismissPicker} />);

        return (
          <View style={styles.container}>
            {listView}
            {currencyPicker}
          </View>
        );
      }
      return (
        <View style={styles.container}>
          {listView}
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
  }
});


module.exports = MainScreen;
