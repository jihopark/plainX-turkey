'use strict';

var React = require('react-native');
var {
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicatorIOS,
} = React;

var ActionButton = React.createClass({
  displayName: 'ActionButton',
  render: function() {
    var bgColor = this.props.backgroundColor || '#33cc66';
    return (
      <TouchableOpacity style={[styles.container, {backgroundColor: bgColor}]} onPress={this.props.enabled ? this.props.onPress : null}>
        {this.props.text == "Loading" && Platform.OS == 'ios' ?
          (<ActivityIndicatorIOS size='small' color='white' />)
          :
          (<Text style={styles.actionButton}>{this.props.text}</Text>)
        }

      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    overflow:'hidden',
    paddingTop:20,
    paddingBottom:20,
    alignItems: 'center',
  },
  actionButton: {
    fontSize: 20,
    color: 'white',
  },
});


module.exports = ActionButton;
