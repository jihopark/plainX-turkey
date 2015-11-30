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
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={this.props.dismissPicker}>
            <Text>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.props.onPick}>
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
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
    alignItems:'center',
  },
  pickerContainer: {
    flex: 9,
    backgroundColor: 'transparent',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end'
  }
});

module.exports = CurrencyPicker;
