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
      <TouchableOpacity onPress={() => subject.onNext({"Id": this.props.data["Id"]})}>
        <View style={styles.container}>
          <View style={{flex: 4}}>
            <Text style={styles.leftCurrency}>
              {this.props.data["Sell"]} {this.props.data["AmountSell"]}</Text>
          </View>
          <View style={{flex: 1}}>
            <Image style={styles.center} source={require('../../assets/plane.png')}/>
          </View>
          <View style={{flex: 4}}>
            <Text style={styles.rightCurrency}>
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
    justifyContent: 'center'
  },
  center: {
    marginTop: 3,
    width: 20,
    height: 12,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
  leftCurrency: {
    color: '#333333',
    fontSize: 60/3,
    textAlign: 'right'
  },
  rightCurrency: {
    color: '#333333',
    fontSize: 60/3,
    textAlign: 'left'
  },
});


module.exports = Offer;
