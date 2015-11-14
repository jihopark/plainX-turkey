'use strict';

var React = require('react-native');
var Rx = require('rx');

var {
  View,
  Text,
  TextInput,
} = React;

var CurrencySelect = React.createClass({
  displayName: "CurrencySelectCard",
  render: function() {
    var subject = new Rx.Subject();
    if (this.props.observer) {
      subject.subscribe(this.props.observer);
    }
    var id = this.props.data.id;

    return (
      <View>
        <Text>I want to exchange</Text>
        <TextInput
          style={{width: 50, height: 30, borderColor: 'gray'}}
          onChangeText={
            function(text) {
              subject.onNext({"id": id, "currencyA": text});
            }}
          value={this.props.data.currencyA}
        />
        <Text>TO</Text>
        <TextInput
          style={{width: 50, height: 30, borderColor: 'gray'}}
          onChangeText={
            function(text) {
              subject.onNext({"id": id, "currencyB": text});
            }
          }
          value={this.props.data.currencyB}
        />
      </View>
    );
  }
});

module.exports = CurrencySelect;
