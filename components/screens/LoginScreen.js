'use strict';

var React = require('react-native');

var {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var PlainTextInput = require('../PlainTextInput.js');
var RestKit = require('react-native-rest-kit');
var md5 = require('md5');

var LoginScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "LoginScreen",
  getInitialState: function() {
    return {
      password: "",
      email: "",
      data: [],
    };
  },
  async saveToken(token) {
    try {
      await AsyncStorage.setItem("SESSION", token);
      console.log("SAVED");
      this.props.popScreen();
    } catch (error) {
      this.setState({errorMsg: "Problem occured. Please try again."});
    }
    this.props.setNetworkActivityIndicator(false);
  },
  onLogin: function(){
    var email = this.state.email;
    var pwd = ""+this.state.password;
    this.props.setNetworkActivityIndicator(true);
    var url = this.props.api_domain + "login";
    var request = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        hashedpw: md5(pwd),
      })
    };
    RestKit.send(url, request, this.handleRequest);
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
    if (json){
      console.log(json["Session"]);
      this.saveToken(json["Session"]);
    }
  },
  onSignUp: function(){
    this.props.pushScreen({uri: this.props.routes.addRoute('signup')});
  },
  onChangeEmail: function(text) {
    this.setState({email: text});
  },
  onChangePassword: function(text) {
    this.setState({password: text});
  },
  renderScreen: function() {
    return (
      <ScrollView contentContainerStyle={[this.screenCommonStyle.container, {flexDirection: 'row', alignItems: 'center'}]}>
        <View style={styles.loginContainer}>
          <Text>You need to be logged in to continue!</Text>
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
          <Text style={styles.errorMsg}>{this.state.errorMsg || ""}</Text>
          <TouchableOpacity onPress={this.onLogin}>
            <Text>Login</Text>
          </TouchableOpacity>
          <Text>Or</Text>
          <TouchableOpacity onPress={this.onSignUp}>
            <Text>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
    width: 200,
    height: 40,
    flexDirection: 'column',
    padding: 3,
    borderWidth: 1,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: '#33cc66',
    alignItems: 'center',
  },
  loginInput: {
    width: 200,
    height: 30,
    fontSize: 60/3,
    color: '#33cc66',
  },
  errorMsg: {
    color: 'red',
  },
  loginId: {

  },
  loginPw: {

  },
});


module.exports = LoginScreen;
