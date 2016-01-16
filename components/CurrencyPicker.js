'use strict';

var React = require('react-native');
var {
  PickerIOS,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Platform,
} = React;


var PlainLog = require('../PlainLog.js');
var P = new PlainLog("CurrencyPicker");

import PickerAndroid from 'react-native-picker-android';

let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
let PickerItem = Picker.Item;

var CurrencyPicker = React.createClass({
  render: function() {

    P.log("render",Picker == null);

    return (
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <Picker
            style={{width: 320}}
            onValueChange={(value) => this.props.onPickerValueChange(value)}
            selectedValue={this.props.currentCurrency}>
              {
                this.props.currencyList.map(function(currency){
                  return (
                    <PickerItem
                      key={currency["Code"]}
                      value={currency["Code"]}
                      label={currency["Code"] + " - " + currency["Country"]} />)
              }
            )}
            </Picker>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.props.dismissPicker}>
            <Image source={require('../assets/cross.png')}
                    style={styles.icon}/>
            <Text style={styles.text} >Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.props.onPick}>
            <Image source={require('../assets/checkmark.png')}
                    style={styles.icon}/>
            <Text style={styles.text} >Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'column',
  },
  pickerContainer: {
    flex: 9,
    backgroundColor: 'transparent',
    alignSelf:'center',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button:{
    flexDirection:'row',
    alignItems: 'center',
  },
  icons: {
    width:14,
    height: 14,
  },
  text: {
    fontSize: 15,
    color: '#33cc66',
    fontWeight: 'bold',
  },
});

module.exports = CurrencyPicker;
