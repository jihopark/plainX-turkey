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
var RestKit = require('react-native-rest-kit');

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
      showConfirmation: false,
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
  handleRequest: function(error, json){
    this.props.setNetworkActivityIndicator(false);
    if (error){
      if (error.status == 400) {
        var errorMsg = JSON.parse(error.body)["Error"];
        if (errorMsg)
          this.setState({errorMsg: errorMsg});
      }
      return ;
    }
    // if 200
    this.setState({showConfirmation: true});
  },
  onSignUp: function(){
    if (this.state.password != this.state.passwordConfirm) {
      this.setState({errorMsg: "Passwords do not match."});
      return ;
    }
    this.props.setNetworkActivityIndicator(true);
    var url = this.props.api_domain + "register";

    var request = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        hashedpw: sha256(this.state.password),
      })
    };

    RestKit.send(url, request, this.handleRequest);
  },
  popScreen: function(){
    this.props.popScreen();
  },
  renderScreen: function() {
    var signUpFormsView = (
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
    var activationNeededView = (
      <View style={this.screenCommonStyle.container}>
        <Text>You need to activate.</Text>
        <TouchableOpacity onPress={this.popScreen}>
          <Text>Okay</Text>
        </TouchableOpacity>
      </View>
    );
    return this.state.showConfirmation ? activationNeededView : signUpFormsView;
  }
});

var styles = StyleSheet.create({
  signupContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  errorMsg: {
    color: 'red',
  },
});


module.exports = SignUpScreen;
