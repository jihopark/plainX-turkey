'use strict';

var React = require('react-native');

var {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  Image,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var KeyboardSpaceMixin = require('./componentMixins/KeyboardSpaceMixin.js');

var PlainTextInput = require('../PlainTextInput.js');
var RestKit = require('react-native-rest-kit');
var md5 = require('md5');
var ActionButton = require('../ActionButton.js');


var LoginScreen = React.createClass({
  mixins: [ScreenMixin, KeyboardSpaceMixin],
  displayName: "LoginScreen",
  getInitialState: function() {
    return {
      password: "",
      email: "",
      data: [],
      keyboardSpace: 0,
      enableLoginButton: true,
    };
  },
  async saveToken(token) {
    try {
      await AsyncStorage.setItem("SESSION", token);
      console.log("SAVED");
    } catch (error) {
      this.setState({errorMsg: "Problem occured. Please try again."});
    }
    this.props.setNetworkActivityIndicator(false);
    return token;
  },
  onLogin: function(){
    this.setState({enableLoginButton: false});
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
      this.saveToken(json["Session"]).then(this.getDeviceToken);
    }
  },
  getDeviceToken: function(loginToken){
    if (loginToken){
      this.getDeviceTokenFromStorage(loginToken).then(this.saveDeviceTokenToServer).done();
    }
  },
  async getDeviceTokenFromStorage(loginToken){
    try {
      var value = await AsyncStorage.getItem("DEVICE_TOKEN");
      return {"loginToken": loginToken, "deviceToken": value};
    } catch (error) {
      console.log("Error Retreving LoginToken");
      return null;
    }
  },
  saveDeviceTokenToServer: function(tokens){
    if (tokens) {
      this.setState({enableLoginButton: true});
      console.log("DEVICE_TOKEN " + tokens["deviceToken"]);

      var request = {
        method: 'post',
        headers:{
          'X-Session': tokens["loginToken"],
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"Token": tokens["deviceToken"]}),
      };
      var url = this.props.api_domain + "user/token";
      RestKit.send(url, request, function(error, json){
        console.log("SENT DEVICE TOKEN TO SERVER");
      });
      this.props.popScreen();
    }
    else{
      console.log("Cannot load deviceToken..");
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
      <ScrollView contentContainerStyle={[this.screenCommonStyle.container, {flexDirection: 'column', alignItems: 'center'}]}>
        <Image source={require('../../assets/BG2.png')} style={styles.backgroundImage}>
          <View style={[styles.container, {paddingTop: 30-this.state.keyboardSpace}]}>
            <Image source={require('../../assets/logo_lg.png')} style={styles.logo}/>
            <TouchableOpacity onPress={this.onSignUp}>
              <Text style={styles.descriptionText}>
                {"Don't have an account yet?"} <Text style={{color: '#33cc66'}}>{"Register Here!"}</Text>
              </Text>
            </TouchableOpacity>
            <View style={styles.textInputContainer}>
              <Text style={styles.errorMsg}>{this.state.errorMsg || ""}</Text>
              <PlainTextInput
                  icon={require("../../assets/emailicon.png")}
                  placeholder={"Email"}
                  keyboardType={"email-address"}
                  onChangeText={this.onChangeEmail}
                  value={this.state.email} />
              <PlainTextInput
                  icon={require("../../assets/passwordicon.png")}
                  placeholder={"Password"}
                  secureTextEntry={true}
                  onChangeText={this.onChangePassword}
                  value={this.state.password} />
            </View>

            <Text style={[styles.descriptionText, styles.extraText]}>
              {"*If you have forgotten your password,\nplease email "}
              <Text style={{color: '#33cc66'}}>info@plainexchange.xyz</Text>
              {" to reset it."}
            </Text>
          </View>
        </Image>
        <View  style={{alignSelf:'stretch'}}>
          <ActionButton
            text={"LOGIN"}
            onPress={this.onLogin}
          enabled={this.state.enableLoginButton} />
        </View>
      </ScrollView>
    );
  }
});

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


module.exports = LoginScreen;
