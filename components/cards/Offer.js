'use strict';

var React = require('react-native');
var Rx = require('rx')

var {
  Text,
  TouchableOpacity,
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
        <Text>{this.props.data["Sell"]} {this.props.data["AmountSell"]} to {this.props.data["Buy"]} {this.props.data["AmountBuy"]}</Text>
      </TouchableOpacity>
    );
  }
});

module.exports = Offer;
