'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

var BaseScreen = require('./BaseScreen.js');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;


class BaseSessionScreen extends BaseScreen{
  constructor(props) {
    super(props);
    this.styles = styles;
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
  }

  onChangeEmail(text) {
    this.setState({email: text});
  }

  onChangePassword(text) {
    this.setState({password: text});
  }
}

var styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingTop: 80,
    flex:1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  textInputContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  logo:{
    width:144,
    height:60,
  },
  descriptionText: {
    marginTop: 20,
    fontSize: 15,
    color: '#333333',
  },
  extraText: {
    fontSize: 12,
    textAlign: 'center',
    marginLeft: 10, marginRight: 10,
  },
  errorMsg: {
    color: '#ff3366',
    fontSize: 15,
  },
});
module.exports = BaseSessionScreen;
