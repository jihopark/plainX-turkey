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
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.enabled ? this.props.onPress : null}>
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
    backgroundColor: '#33cc66',
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
