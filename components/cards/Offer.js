'use strict';

var React = require('react-native');
var Rx = require('rx')

var {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} = React;

var Offer = React.createClass({
  displayName: "OfferCard",
  render: function() {
    var subject = new Rx.Subject();
    if (this.props.observer) {
      subject.subscribe(this.props.observer);
    }
    return (
      <TouchableOpacity style={{flex:1}} onPress={() => subject.onNext({"Id": this.props.data["Id"]})}>
        <View style={styles.container}>
          <View style={{flex: 4, justifyContent: 'center', flexDirection:'column'}}>
            <Text style={[styles.leftCurrency, this.props.cardCommonStyles.currency]}>
              {this.props.data["Sell"]} {this.props.data["AmountSell"]}</Text>
          </View>
          <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
            <Image style={styles.center} source={require('../../assets/plane.png')}/>
          </View>
          <View style={{flex: 4, justifyContent: 'center', flexDirection:'column'}}>
            <Text style={[styles.rightCurrency, this.props.cardCommonStyles.currency]}>
              {this.props.data["Buy"]} {this.props.data["AmountBuy"]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
  },
  center: {
    marginTop: 3,
    width: 30,
    height: 18,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
  leftCurrency: {
    textAlign: 'right',
  },
  rightCurrency: {
    textAlign: 'left',
  },
});


module.exports = Offer;
