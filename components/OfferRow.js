'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;

var OfferRow = React.createClass({
  displayName: 'OfferRow',
  render: function(){
    return (
      <View>
        <Text style={styles.seller}>Seller {this.props.offer["Seller"]}</Text>
        <View style={styles.rightContainer}>
          <Text style={styles.number}>Have: {this.props.offer["AmountHave"]}</Text>
          <Text style={styles.currency}>{this.props.offer["Have"]}</Text>
          <Text style={styles.number}>Need: {this.props.offer["AmountNeed"]}</Text>
          <Text style={styles.currency}>{this.props.offer["Need"]}</Text>
        </View>
    </View>
    );
  }
});

var styles = StyleSheet.create({
  seller: {
    fontSize: 20,
  },
  rightContainer: {
    flex: 1,
  },
  currency: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  number: {
    fontSize: 25,
    color: 'red',
  },
  year: {
    textAlign: 'center',
  },
});

module.exports = OfferRow;
