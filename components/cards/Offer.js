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
          <View style={styles.sideContainer}>
            <Text style={[this.props.cardCommonStyles.currency, styles.leftCurrency]}>
              {this.props.data["Sell"]+"\n"+this.props.data["AmountSell"]}</Text>
          </View>
          <View style={styles.centerContainer}>
            <Image style={styles.center} source={require('image!plane')}/>
          </View>
          <View style={styles.sideContainer}>
            <Text style={[this.props.cardCommonStyles.currency, styles.rightCurrency]}>
              {this.props.data["Buy"]+"\n"+this.props.data["AmountBuy"]}</Text>
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
