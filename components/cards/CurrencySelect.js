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
    var id = this.props.data["UUID"];

    return (
      <View>
        <Text>I want to exchange</Text>
        <TextInput
          style={{width: 50, height: 30, borderColor: 'gray'}}
          onChangeText={
            function(text) {
              subject.onNext({"UUID": id, "CurrencyA": text});
            }}
          value={this.props.data["CurrencyA"]}
        />
        <Text>TO</Text>
        <TextInput
          style={{width: 50, height: 30, borderColor: 'gray'}}
          onChangeText={
            function(text) {
              subject.onNext({"UUID": id, "CurrencyB": text});
            }
          }
          value={this.props.data["CurrencyB"]}
        />
      </View>
    );
  }
});

module.exports = CurrencySelect;
