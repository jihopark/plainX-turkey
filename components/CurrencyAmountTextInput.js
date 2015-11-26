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
          style={styles.currencyAmountInput}
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
  currencyAmountInput: {
    width: 140,
    height: 30,
    fontSize: 60/3,
    textAlign: 'center',
    color: '#33cc66',
  },
});

module.exports = CurrencyAmountTextInput;
