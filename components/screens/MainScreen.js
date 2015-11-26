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
var CurrencySelectCardMixin = require('./cardMixins/CurrencySelectCardMixin.js');

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
  subscribeToNavBarSubjects: (left, right) => {
    left.subscribe((x) => console.log(x));
    right.subscribe((x) => console.log(x));
  },
  renderScreen: function() {
    this.subscribeToNavBarSubjects(this.props.leftNavBarButtonSubject, this.props.rightNavBarButtonSubject);

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
          <View style={{flex: 1}}>{listView}</View>
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
});

var styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
  }
});


module.exports = MainScreen;
