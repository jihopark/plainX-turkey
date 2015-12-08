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
        <Text style={this.props.cardCommonStyles.offerTitle}>{this.props.data["TodaysRateDescription"]}</Text>
        <Text style={this.props.cardCommonStyles.offerOptions}>{this.props.data["TodaysRate"]}</Text>
        {this.props.data["TodaysRate"] ?
        (<Text style={[this.props.cardCommonStyles.offerTitle, {marginTop: 10}]}>
            {this.props.data["OffersRateDescription"]}</Text>)
        : null}
        {this.props.data["OffersRate"] ?
        (<Text style={this.props.cardCommonStyles.offerOptions}>
            {this.props.data["OffersRate"]}</Text>)
        : null}
        {this.props.data["OfferVsRateDescription"] ?
        (<Text style={[this.props.cardCommonStyles.offerTitle, {marginTop: 10}]}>
            {this.props.data["OfferVsRateDescription"]}</Text>)
        : null}
        {this.props.data["OfferVsRate"] ?
        (<Text style={[this.props.cardCommonStyles.offerOptions, {color: '#33cc66'}]}>
            {this.props.data["OfferVsRate"]}</Text>)
        : null}
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

module.exports = TodaysRateOffer;
