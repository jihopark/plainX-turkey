'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Platform,
  Text,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var CurrencyPickerMixin = require('./componentMixins/CurrencyPickerMixin.js');
var CurrencyAmountSelectCardMixin = require('./cardMixins/CurrencyAmountSelectCardMixin.js');
var LocationSelectCardMixin = require('./cardMixins/LocationSelectCardMixin.js');
var ExpiryDateSelectCardMixin = require('./cardMixins/ExpiryDateSelectCardMixin.js');
var CurrencyPicker = (Platform.OS === 'ios') ? require('../CurrencyPicker.ios.js') : require('../CurrencyPicker.android.js');

var MakeOfferScreen = React.createClass({
  mixins: [ScreenMixin, CurrencyPickerMixin, CurrencyAmountSelectCardMixin, ExpiryDateSelectCardMixin, LocationSelectCardMixin],
  displayName: "MakeOfferScreen",
  getInitialState: function() {
    return {
      showCurrencyPicker: false,
      currencyList: [],
      targetInput: null,
      currencySelectId: null,
      currentCurrency: null,
      data: {
        "Cards": [
          {
            "Name": "Explanation",
            "UUID": 0,
            "Data": {
              "Text": "This is OffersList"
            }
          },
          {
            "Name": "CurrencyAmountSelect",
            "UUID": 5,
            "Data": {
              "Sell":"USD",
              "Buy":"HKD",
              "CurrencyList":
                 [ { Country: 'China', Code: 'CNY', Rate: 6.3807 },
                   { Country: 'Austria', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Belgium', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Cyprus', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Estonia', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Finland', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'France', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Germany', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Greece', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Guadeloupe', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Ireland', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Italy', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Kosovo', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Latvia', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Luxembourg', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Malta', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Martinique', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Mayotte', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Monaco', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Montenegro', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Netherlands', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Portugal', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Réunion', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Saint Barthélemy', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Saint Martin', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Saint Pierre and Miquelon',
                     Code: 'EUR',
                     Rate: 0.936944 },
                   { Country: 'San Marino', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Slovakia', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Slovenia', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Spain', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Vatican City', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Andorra', Code: 'EUR', Rate: 0.936944 },
                   { Country: 'Hong Kong', Code: 'HKD', Rate: 7.7506 },
                   { Country: 'Singapore', Code: 'SGD', Rate: 1.422735 },
                   { Country: 'Thailand', Code: 'THB', Rate: 35.984501 },
                   { Country: 'United States', Code: 'USD', Rate: 1 },
                   { Country: 'Vietnam', Code: 'VND', Rate: 22465 } ]
               }
          },
          {
            "Name": "ExpiryDateSelect",
            "UUID": 1,
            "Data": {
              "Date": "2015-11-18"
            }
          },
          {
            "Name": "LocationSelect",
            "UUID": 2,
            "Data": {
              "Locations":
                {
                  "HKUST":{"Selected":true},
                  "HKU":{"Selected":false},
                  "CUHK":{"Selected":false},
                  "POLYU":{"Selected":false},
                  "CITYU":{"Selected":false},
                  "BU":{"Selected":false}
                }
            }
          }
        ]
      }
    };
  },
  renderScreen: function() {
    var cardObservers = { };
    cardObservers["Offer"] = this.offerCardonNext;
    cardObservers["CurrencyAmountSelect"] = this.currencyAmountSelectCardOnNext;
    cardObservers["ExpiryDateSelect"] = this.expiryDateSelectCardonNext;
    cardObservers["LocationSelect"] = this.locationSelectonNext;

    var listView = (<PlainListView
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
});

var styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  }
});



module.exports = MakeOfferScreen;
