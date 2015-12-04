'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Text,
  TextInput,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var KeyboardSpaceMixin = require('./componentMixins/KeyboardSpaceMixin.js');

var ConversationRoomScreen = React.createClass({
  mixins: [ScreenMixin,KeyboardSpaceMixin],
  displayName: "ConversationRoomScreen",
  endPoint: "conversation",
  getInitialState: function() {
    return {
      data: null,
      keyboardSpace: 0,
    };
  },
  renderScreen: function() {
    var cardObservers = { };

    var listView = (<PlainListView
      cardObservers={cardObservers}
      cards={this.state.data["Cards"]}
      onEndReached={this.loadMore}
      />);

    return (
      <View style={[this.screenCommonStyle.container, styles.container]}>
        {listView}
        <View style={[styles.sendContainer, , {marginBottom: this.state.keyboardSpace}]} >
          <TextInput style={styles.msgInput}/>
          <Text style={styles.sendButton} >Send</Text>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  msgInput: {
    flex: 6,
    height: 35,
  },
  sendButton: {
    flex:1,
  },
  sendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },
});

module.exports = ConversationRoomScreen;
