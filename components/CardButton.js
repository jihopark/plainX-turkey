'use strict';

var React = require('react-native');

var {
  Text,
  StyleSheet,
} = React;

var CardButton = React.createClass({
  render: function() {
    return (
      <Text style={styles.cardButton}>
        {this.props.text}
      </Text>
    );
  }
});

var styles = StyleSheet.create({
  cardButton: {
    flex: 1,
    fontSize: 60/3,
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#33cc66',
    borderRadius: 2,
    overflow:'hidden',
    paddingTop:20,
    paddingBottom:20,
    marginTop: 10,
  },
});

module.exports = CardButton;
