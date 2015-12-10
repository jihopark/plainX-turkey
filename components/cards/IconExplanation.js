'use strict';

var React = require('react-native');
var {
  View,
  Text,
  Image,
  StyleSheet,
} = React;

var Explanation = React.createClass({
  displayName: "IconExplanationCard",
  render: function() {
    return (
      <View style={styles.container}>
        {this.props.data["Icon"] ?
          (<Image style={styles.icon} source={{uri: this.props.data["Icon"]}} />)
          : null}
        <Text style={[this.props.cardCommonStyles.headings, styles.text]}>
          {this.props.data["Text"]}
        </Text>
      </View>
    );
  }
});
var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  icon: {
    width: 50, height: 50,
    marginBottom: 15,
  },
  text: {
    textAlign: 'center',
  }
});
module.exports = Explanation;
