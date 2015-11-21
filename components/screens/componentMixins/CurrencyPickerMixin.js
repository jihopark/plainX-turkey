'use strict';

var React = require('react-native');

//Mixin for Screens that needs CurrencyPicker Component

/* To use Currency Picker, Screen must have the following initial states
*
* showCurrencyPicker: false,
* currencyList: [],
* targetInput: null,
* currencySelectId: null,
* currentCurrency: null
*
*/

var CurrencyPickerMixin =  {
  onPickerValueChange: function(value) {
    this.setState({data: this.mutateCardStateData(this.state.data, this.state.currencySelectId, this.state.targetInput, value),
                  currentCurrency: value});
  },
  dismissPicker: function() {
    this.setState({showCurrencyPicker: false});
  },
}

module.exports = CurrencyPickerMixin;
