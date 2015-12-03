'use strict';

var React = require('react-native');
var Rx = require('rx')

var {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} = React;

var UserConversationItem = React.createClass({
  displayName: "UserConversationItemCard",
  render: function() {
    var subject = new Rx.Subject();
    if (this.props.observer) {
      subject.subscribe(this.props.observer);
    }
    return (
      <TouchableOpacity style={{flex:1}} onPress={() => subject.onNext({"Id": this.props.data["Id"]})}>
        <View style={styles.container}>
          <Text>{this.props.data["Id"]}</Text>
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


module.exports = UserConversationItem;
