'use strict';

var React = require('react-native');
var {
  View,
  TextInput,
  StyleSheet,
} = React;

var CurrencyAmountTextInput = React.createClass({
  displayName: 'CurrencyAmountTextInput',
  formatNumber: function(n) {
    var f = parseFloat(n);
    return f ? (Math.round(f * 100) / 100)+"" : f;
  },
  render: function() {
    var value = this.props.value ?
       this.formatNumber(this.props.value) + (this.props.isCalculated ? "*" : "")
       : "";
    return (
      <View style={[styles.container, this.props.isCalculated ? null : styles.addUnderline]}>
        <TextInput
          style={[styles.currencyAmountTextInput, this.props.textStyle,
                (this.props.value.length > 5 ? {fontSize: 20} : {})]}
          onChangeText={this.props.onChangeText}
          onFocus={this.props.onFocus}
          value={value}
          keyboardType={"numeric"}
          clearTextOnFocus={true}
          returnKeyType={'done'}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    width: 140,
    height: 40,
    flexDirection: 'column',
    padding: 3,
    marginRight: 15,
  },
  addUnderline: {
    borderWidth: 1,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: '#33cc66',
  },
  currencyAmountTextInput: {
    width: 140,
    height: 30,
    alignSelf: 'center',
  },
});

module.exports = CurrencyAmountTextInput;
