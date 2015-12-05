'use strict';

var React = require('react-native');

var {
  Text,
  View,
  Image,
  StyleSheet,
} = React;

var ExpiryDate = React.createClass({
  displayName: "ExpiryDateCard",
  render: function() {
    return (
      <View style={styles.container}>
        <Image style={styles.icon} source={require('../../assets/calendaricon_gray.png')} />
        <Text style={this.props.cardCommonStyles.offerTitle}>{this.props.data["TitleText"]}</Text>
        <Text style={this.props.cardCommonStyles.offerOptions}>
          {this.props.data["Date"] == -1 ? "None" : new Date(this.props.data["Date"]) }
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container:{
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon:{
    width: 25, height: 25,
    resizeMode:'contain',
  },
});

module.exports = ExpiryDate;
