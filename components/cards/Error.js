'use strict';

var React = require('react-native');
var {
  Text,
  StyleSheet,
} = React;

var Error = React.createClass({
  displayName: "ErrorCard",
  render: function() {
    return (
      <Text style={styles.description}>
        {this.props.data ?
          this.props.data["Text"] :
            "Opps, this is embrassing."+
            "\nSomething went wrong :(\nWe will fix it soon.\n\n"
        }
        <Text style={{fontWeight:'bold'}}>-Team Plain Exchange</Text>
      </Text>
    );
  }
});

var styles = StyleSheet.create({
  description: {
    color: '#333333',
    fontSize: 36/2,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    lineHeight:25,
  },
});


module.exports = Error;
