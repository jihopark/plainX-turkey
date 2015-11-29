'use strict';

var React = require('react-native');

var {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');

var PlainTextInput = require('../PlainTextInput.js');
var sha256 = require('sha256');

var SignUpScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "SignUpScreen",
  getInitialState: function() {
    return {
      password: "",
      passwordConfirm:"",
      email: "",
      data: [],
    };
  },
  onChangeEmail: function(text) {
    this.setState({email: text});
  },
  onChangePassword: function(text) {
    this.setState({password: text});
  },
  onChangePasswordConfirm: function(text) {
    this.setState({passwordConfirm: text});
  },
  onSignUp: function(){
    console.log(this.state.email);
    console.log(this.state.password);
    console.log(this.state.passwordConfirm);
    console.log(sha256(this.state.password));
    console.log(sha256(this.state.passwordConfirm));
  },
  renderScreen: function() {
    return (
      <ScrollView contentContainerStyle={[this.screenCommonStyle.container, {flexDirection: 'row', alignItems: 'center'}]}>
        <View style={styles.signupContainer}>
          <Text>This is Sign up</Text>
          <PlainTextInput
              placeholder={"Email"}
              keyboardType={"email-address"}
              onChangeText={this.onChangeEmail}
              value={this.state.email} />
          <PlainTextInput
              placeholder={"Password"}
              secureTextEntry={true}
              onChangeText={this.onChangePassword}
              value={this.state.password} />
          <PlainTextInput
              placeholder={"Password Confirmation"}
              secureTextEntry={true}
              onChangeText={this.onChangePasswordConfirm}
              value={this.state.passwordConfirmation} />
          <Text style={styles.errorMsg}>{this.state.errorMsg || ""}</Text>
          <TouchableOpacity onPress={this.onSignUp}>
            <Text>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  signupContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  }
});


module.exports = SignUpScreen;
