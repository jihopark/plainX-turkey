'use strict';

var React = require('react-native');

var {
  Text,
  View,
  Image,
  StyleSheet,
} = React;

var DateMixin = require('../screens/componentMixins/DateMixin.js');

var Expiry = React.createClass({
  displayName: "ExpiryCard",
  mixins: [DateMixin],
  render: function() {
    var offer = this.props.getOffer(this.props.data["OfferId"]);
    return (
      <View style={styles.container}>
        <Image style={styles.icon} source={require('image!calendaricon_gray')} />
        <Text style={this.props.cardCommonStyles.offerTitle}>{this.props.data["TitleText"]}</Text>
        <Text style={this.props.cardCommonStyles.offerOptions}>
          {offer["Expires"] == -1 ? "None" : this.getDateFormat(new Date(offer["Expires"])) }
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
