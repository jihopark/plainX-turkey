'use strict';

var React = require('react-native');
var {
  PickerIOS,
  View,
  TouchableOpacity,
  Text,
} = React;

var PickerItemIOS = PickerIOS.Item;

var CurrencyPicker = React.createClass({
  render: function() {
    return (
      <View>
        <PickerIOS
          onValueChange={(value) => this.props.onPickerValueChange(value)}
          selectedValue={this.props.currentCurrency}>
            {
              this.props.currencyList.map(function(currency){
                return (
                  <PickerItemIOS
                    key={currency["Code"]}
                    value={currency["Code"]}
                    label={currency["Code"] + " - " + currency["Country"]} />)
            }
          )}
        </PickerIOS>
        <TouchableOpacity onPress={this.props.dismissPicker}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    );
  },
});

module.exports = CurrencyPicker;
