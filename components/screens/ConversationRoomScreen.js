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

var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var ConversationRoomScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "ConversationRoomScreen",
  endPoint: "conversation",
  getInitialState: function() {
    return {
      data: null,
      keyboardSpace: 0,
    };
  },
  updateKeyboardSpace: function(frames) {
    this.setState({keyboardSpace: frames.end.height});
  },
  resetKeyboardSpace: function() {
    this.setState({keyboardSpace: 0});
  },
  componentDidMount: function() {
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  },
  componentWillUnmount: function() {
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
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
        <View style={[styles.sendContainer, {height: (40+this.state.keyboardSpace)}]} >
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
