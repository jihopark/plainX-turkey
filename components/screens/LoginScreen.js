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
var BaseSessionScreen = require('./BaseSessionScreen.js');
var SessionActions = require('../../actions/SessionActions');

var PlainTextInput = require('../PlainTextInput.js');
var RestKit = require('react-native-rest-kit');
var md5 = require('md5');
var ActionButton = require('../ActionButton.js');

var PlainLog = require('../../PlainLog.js');
var P = new PlainLog("LoginScreen");

var MixpanelTracker = require('../../MixpanelTracker.js');


class LoginScreen extends BaseSessionScreen{
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: "",
      data: [],
      keyboardSpace: 0,
      enableLoginButton: true,
    };
    this.saveLoginToken = this.saveLoginToken.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.handleRequest = this.handleRequest.bind(this);
    this.saveDeviceTokenToServer = this.saveDeviceTokenToServer.bind(this);
    this.onPressSignUp = this.onPressSignUp.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
    this.trackName = "Login"
  }

  onLogin(){
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
    P.log("onLogin", url);
    RestKit.send(url, request, this.handleRequest);
  }

  handleRequest(error, json){
    this.props.setNetworkActivityIndicator(false);
    this.setState({enableLoginButton: true});

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
      P.log("handleRequest", "Success");
      SessionActions.updateLoginToken(json["Session"]);
      P.log("handleRequest",json["Session"]);
      this.saveLoginToken(json["Session"]).then(this.saveDeviceTokenToServer);
      this.updateEmailOnMixpanel(json["Session"]);
    }
  }

  updateEmailOnMixpanel(token) {
    var request = {
      method: 'get',
      headers:{ 'X-Session': token }
    };
    var url = this.props.api_domain + "user/me";
    P.log("updateEmailOnMixpanel", url);
    RestKit.send(url, request, function(error, json) {
      if (error) {
        P.log("updateEmailOnMixpanel", error);
        return ;
      }
      if (json) {
        P.log("updateEmailOnMixpanel", json["Email"]);
        if (json["Email"])
          MixpanelTracker.setProfile(json["Email"]);
      }
    });
  }

  async saveLoginToken(token) {
    try {
      await AsyncStorage.setItem("SESSION", token);
      P.log("saveLoginToken", token);
    } catch (error) {
      this.setState({errorMsg: "Problem occured. Please try again."});
    }
    this.props.setNetworkActivityIndicator(false);
    return token;
  }

  saveDeviceTokenToServer(loginToken){
    this.setState({enableLoginButton: true});
    P.log("saveDeviceTokenToServer", "DEVICE_TOKEN " + this.props.deviceToken);

    var request = {
      method: 'post',
      headers:{
        'X-Session': loginToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"Token": this.props.deviceToken}),
    };
    var url = this.props.api_domain + "user/token";
    RestKit.send(url, request, function(error, json){
      P.log("saveDeviceTokenToServer", "SENT DEVICE TOKEN TO SERVER");
    });
    this.props.popScreen();
  }

  onPressSignUp(){
    this.props.pushScreen({uri: this.props.routes.addRoute('signup')});
  }

  renderScreen() {
    var margin = 30-this.state.keyboardSpace;
    return (
      <ScrollView contentContainerStyle={[this.screenCommonStyle.container, {flexDirection: 'column', alignItems: 'center'}]}>
        <Image source={require('../../assets/BG2.png')} style={this.styles.backgroundImage}>
          <View style={[this.styles.container, (margin > 0 ? {paddingTop: margin} : {paddingTop: 0})]}>
            {margin > 0 ? (<Image source={require('../../assets/logo_lg.png')} style={this.styles.logo}/>) : null}
            <TouchableOpacity onPress={this.onPressSignUp}>
              <Text style={this.styles.descriptionText}>
                {"Don't have an account yet?"} <Text style={{color: '#33cc66'}}>{"Register Here!"}</Text>
              </Text>
            </TouchableOpacity>
            <View style={this.styles.textInputContainer}>
              <Text style={this.styles.errorMsg}>{this.state.errorMsg || ""}</Text>
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

            <Text style={[this.styles.descriptionText, this.styles.extraText]}>
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
}

module.exports = LoginScreen;
