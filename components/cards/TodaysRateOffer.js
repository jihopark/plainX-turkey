'use strict';

var React = require('react-native');

var {
  Text,
  View,
  Image,
  StyleSheet,
} = React;

var NumberUtils = require('../utils/NumberUtils.js');

const SIGNIFICANT_DIFFERENCE = 3;

var TodaysRateOffer = React.createClass({
  displayName: "TodaysRateOfferCard",
  render: function() {
    var offer = this.props.getOffer(this.props.data["OfferId"]);
    var offerRate = offer["AmountBuy"]/offer["AmountSell"];
    var marketRate = offer["MarketRate"];
    var difference = (offerRate - marketRate) / marketRate * 100;
    return (
      <View style={styles.container}>
        <Image style={styles.icon} source={require('../../assets/dollaricon.png')} />
        {marketRate ? (
          <View style={styles.textContainer}>
            <Text style={[this.props.cardCommonStyles.offerTitle, styles.center]}>{this.props.data["TodaysRateDescription"]}</Text>
            <Text style={this.props.cardCommonStyles.offerOptions}>{NumberUtils.formatRate(marketRate)}</Text>
          </View>
        ) : null}
        {offerRate ? (
          <View style={styles.textContainer}>
            <Text style={this.props.cardCommonStyles.offerTitle}>{this.props.data["OffersRateDescription"]}</Text>
            <Text style={this.props.cardCommonStyles.offerOptions}>{NumberUtils.formatRate(offerRate)}</Text>
          </View>
        ) : null}
        {difference > SIGNIFICANT_DIFFERENCE ? (
          <View style={styles.textContainer}>
            <Text style={this.props.cardCommonStyles.offerTitle}>{this.props.data["OfferVsRateDescription"]}</Text>
            <Text style={[this.props.cardCommonStyles.offerOptions, (difference>0 ? {color: '#33cc66'} : null)]}>
              {NumberUtils.formatRate(difference)+"%"}</Text>
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
