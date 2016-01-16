'use strict';

var React = require('react-native');

var {
  Text,
  StyleSheet,
} = React;

var CardButton = React.createClass({
  render: function() {
      return (
	  <React.View style={styles.parent}>
            <Text style={styles.cardButton}>
              {this.props.text}
	    </Text>
	  </React.View>
      );
  }
});

var styles = StyleSheet.create({
    parent: {
	backgroundColor: '#33cc66',
	borderRadius: 2,
	overflow:'hidden',
	marginTop: 10,
	paddingTop:20,
	paddingBottom:20,
    },
    cardButton: {
	flex: 1,
	textAlign: 'center',
	color: 'white',
	fontSize: 60/3,
    },
});

module.exports = CardButton;
