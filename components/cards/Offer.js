'use strict';

var React = require('react-native');
var Rx = require('rx')

var {
  Text,
  TouchableOpacity,
} = React;

var Offer = React.createClass({
  displayName: "OfferCard",
  _onPress: function(subject) {
    return () => subject.onNext(this.props.data.id)
  },
  render: function() {
    //create here as a local variable, rather than component variable, because there may be multiple cards
    var subject = new Rx.Subject();
    if (this.props.observer) {
      subject.subscribe(this.props.observer);
    }
    return (
      <TouchableOpacity onPress={this._onPress(subject)}>
        <Text>OfferCard</Text>
      </TouchableOpacity>
    );
  }
});

module.exports = Offer;
