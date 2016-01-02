'use strict';

var React = require('react-native');

var {
  Text,
  View,
  Image,
  StyleSheet,
} = React;

var DateUtils = require('../utils/DateUtils.js');

var Expiry = React.createClass({
  displayName: "ExpiryCard",
  render: function() {
    var offer = this.props.getOffer(this.props.data["OfferId"]);

    return (
      <View style={styles.container}>
        <Image style={styles.icon} source={require('../../assets/calendaricon_gray.png')} />
        <Text style={this.props.cardCommonStyles.offerTitle}>{this.props.data["TitleText"]}</Text>
        <Text style={this.props.cardCommonStyles.offerOptions}>
          {offer["Expires"] == -1 ? "None" : DateUtils.getDateFormat(new Date(offer["Expiry"])) }
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

module.exports = Expiry;
