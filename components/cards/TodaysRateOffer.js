'use strict';

var React = require('react-native');

var {
  Text,
  View,
  Image,
  StyleSheet,
} = React;

var TodaysRateOffer = React.createClass({
  displayName: "TodaysRateOfferCard",
  render: function() {
    return (
      <View style={styles.container}>
        <Image style={styles.icon} source={require('../../assets/dollaricon.png')} />
        {this.props.data["TodaysRate"] ? (
          <View style={styles.textContainer}>
            <Text style={[this.props.cardCommonStyles.offerTitle, styles.center]}>{this.props.data["TodaysRateDescription"]}</Text>
            <Text style={this.props.cardCommonStyles.offerOptions}>{this.props.data["TodaysRate"]}</Text>
          </View>
        ) : null}
        {this.props.data["OffersRate"] ? (
          <View style={styles.textContainer}>
            <Text style={this.props.cardCommonStyles.offerTitle}>{this.props.data["OffersRateDescription"]}</Text>
            <Text style={this.props.cardCommonStyles.offerOptions}>{this.props.data["OffersRate"]}</Text>
          </View>
        ) : null}
        {this.props.data["OfferVsRate"] ? (
          <View style={styles.textContainer}>
            <Text style={this.props.cardCommonStyles.offerTitle}>{this.props.data["OfferVsRateDescription"]}</Text>
            <Text style={[this.props.cardCommonStyles.offerOptions, (this.props.data["OfferVsRate"]>0 ? {color: '#33cc66'} : null)]}>
              {this.props.data["OfferVsRate"]}</Text>
          </View>
        ) : null}
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
  textContainer:{
    alignItems: 'center',
    marginTop:10,
  },
});

module.exports = TodaysRateOffer;
