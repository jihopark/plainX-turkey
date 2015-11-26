'use strict';

var React = require('react-native');
var {
  Text,
  TouchableOpacity,
  StyleSheet,
} = React;

var ActionButton = React.createClass({
  displayName: 'ActionButton',
  render: function() {
    return (
      <TouchableOpacity onPress={this.props.enabled ? this.props.onPress : null}>
        <Text style={styles.actionButton}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    fontSize: 60/3,
    textAlign: 'center',
    color: 'black',
    backgroundColor: '#33cc66',
    overflow:'hidden',
    paddingTop:10,
    paddingBottom:10,
  },
});


module.exports = ActionButton;
