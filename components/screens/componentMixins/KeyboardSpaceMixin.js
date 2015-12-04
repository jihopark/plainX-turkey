'use strict';

var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;


var KeyboardSpaceMixin =  {
  updateKeyboardSpace: function(frames) {
    if (frames.end)
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
};

module.exports = KeyboardSpaceMixin;
