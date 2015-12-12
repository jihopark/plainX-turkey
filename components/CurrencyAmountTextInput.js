'use strict';

var React = require('react-native');
var {
  View,
  TextInput,
  StyleSheet,
} = React;

var CurrencyAmountTextInput = React.createClass({
  displayName: 'CurrencyAmountTextInput',
  render: function() {
    return (
      <View style={styles.container}>
        <TextInput
          style={[styles.currencyAmountTextInput, this.props.textStyle,
                (this.props.value.length > 5 ? {fontSize: 20} : {})]}
          onChangeText={this.props.onChangeText}
          onFocus={this.props.onFocus}
          value={this.props.value}
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
    borderWidth: 1,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: '#33cc66',
    marginRight: 15,
  },
  currencyAmountTextInput: {
    width: 140,
    height: 30,
  },
});

module.exports = CurrencyAmountTextInput;
