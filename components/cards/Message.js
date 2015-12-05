'use strict';

var React = require('react-native');
var Rx = require('rx')

var {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} = React;

var Message = React.createClass({
  displayName: "MessageCard",
  render: function() {
    return (
      <TouchableOpacity style={{flex:1}} onPress={() => subject.onNext({"Id": this.props.data["Id"]})}>
        <View style={styles.container}>
          <Text>{this.props.data["User"]} {this.props.data["Text"]}</Text>
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
});


module.exports = Message;
