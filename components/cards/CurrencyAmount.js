'use strict';

var React = require('react-native');
var NumberUtils = require('../utils/NumberUtils.js');

var {
  Text,
  View,
  Image,
  StyleSheet,
} = React;

var CurrencyAmount = React.createClass({
  displayName: "CurrencyAmountCard",
  render: function() {
    var offer = this.props.getOffer(this.props.data["OfferId"]);
    var isOwner = this.props.user ? this.props.user["Id"] == offer["SellerId"] : false;

    var youGive = "You Give", youReceive = "You Receive";
    return offer ?
      (
      <View style={styles.container}>
        <View style={styles.sideContainer}>
          <Text style={[styles.explanation, {textAlign:'right'}]}>
            {isOwner ? youReceive : youGive}
          </Text>
          <Text style={[this.props.cardCommonStyles.currency, styles.leftCurrency]}>
            {offer["Buy"]+"\n"+NumberUtils.formatNumber(offer["AmountBuy"])}</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={[styles.explanation, {color:'transparent'}]}>P</Text>
          <Image style={styles.center} source={require('../../assets/plane.png')}/>
        </View>
        <View style={styles.sideContainer}>
          <Text style={[styles.explanation]}>
            {isOwner ? youGive : youReceive}
          </Text>
          <Text style={[this.props.cardCommonStyles.currency, styles.rightCurrency]}>
            {offer["Sell"]+"\n"+NumberUtils.formatNumber(offer["AmountSell"])}</Text>
        </View>
      </View>
    )
    : null;
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerContainer: {
    flex: 2,
    flexDirection:'column',
    justifyContent:'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,

  },
  center: {
    marginTop: 3,
    width: 40,
    height: 24,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  sideContainer: {
    flex: 4,
    justifyContent: 'center',
    flexDirection:'column',
  },
  leftCurrency: {
    textAlign: 'right',
    marginLeft: 0, marginRight: 0,
  },
  rightCurrency: {
    textAlign: 'left',
    marginLeft: 0, marginRight: 0,
  },
  explanation:{
    marginBottom: 5,
  }
});


module.exports = CurrencyAmount;
