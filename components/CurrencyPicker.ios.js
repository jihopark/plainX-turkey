'use strict';

var React = require('react-native');
var {
  PickerIOS,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} = React;

var PickerItemIOS = PickerIOS.Item;

var CurrencyPicker = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.close}
          onPress={this.props.dismissPicker}>
          <Text>Close</Text>
        </TouchableOpacity>
        <View style={styles.pickerContainer}>
          <PickerIOS
            style={{width: 320}}
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
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    backgroundColor: 'white',
    flex: 0.4,
    flexDirection: 'column',
    alignItems:'center',
  },
  pickerContainer: {
    flex: 9,
  },
  close: {
    flex: 1,
    alignSelf: 'flex-end'
  }
});

module.exports = CurrencyPicker;
