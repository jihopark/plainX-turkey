'use strict';

var React = require('react-native');
var NumberUtils = require('../utils/NumberUtils.js');

var {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} = React;

var Offer = React.createClass({
  displayName: "OfferCard",
  onPressCard: function() {
    this.props.handleClick(this.props.name, this.props.data);
  },
  render: function() {
    var id = this.props.data["OfferId"];
    var offer = this.props.getOffer(id);

    return offer ? (
      <TouchableOpacity style={{flex:1}}
        onPress={this.onPressCard}>
        <View style={styles.container}>
          <View style={styles.sideContainer}>
            <Text style={[this.props.cardCommonStyles.currency, styles.leftCurrency]}>
              {offer["Sell"]+"\n"+NumberUtils.formatNumber(offer["AmountSell"])}</Text>
          </View>
          <View style={styles.centerContainer}>
            <Image style={styles.center} source={require('../../assets/plane.png')}/>
          </View>
          <View style={styles.sideContainer}>
            <Text style={[this.props.cardCommonStyles.currency, styles.rightCurrency]}>
              {offer["Buy"]+"\n"+NumberUtils.formatNumber(offer["AmountBuy"])}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ) : null;
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
});


module.exports = Offer;
