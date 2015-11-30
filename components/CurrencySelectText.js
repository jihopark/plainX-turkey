'use strict';

var React = require('react-native');

var {
  View,
  Image,
  Text,
  StyleSheet,
} = React;

var CurrencySelectText = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.currencySelectText}>
          {this.props.text}
        </Text>
        <Image style={this.props.iconStyle} source={require('../assets/triangle.png')} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 40,
    padding: 3,
    borderWidth: 1,
    borderColor: '#33cc66',
    borderRadius: 4,
  },
  currencySelectText: {
    fontSize: 60/3,
    textAlign: 'center',
    color: '#33cc66',
    marginRight: 7,
    //font: 'SF UI Text Light'
  },
});

module.exports = CurrencySelectText;
