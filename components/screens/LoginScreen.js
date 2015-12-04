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
      <ScrollView contentContainerStyle={[this.screenCommonStyle.container, {flexDirection: 'column', alignItems: 'center'}]}>
        <Image source={require('../../assets/BG2.png')} style={styles.backgroundImage}>
          <View style={[styles.container, {paddingTop: 80-this.state.keyboardSpace}]}>
            <Image source={require('../../assets/logo_lg.png')} style={styles.logo}/>
            <TouchableOpacity onPress={this.onSignUp}>
              <Text style={styles.descriptionText}>
                {"Don't have an account yet?"} <Text style={{color: '#33cc66'}}>{"Register Here!"}</Text>
              </Text>
            </TouchableOpacity>

            <View style={{marginTop: 70}}>
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
            <Text style={styles.errorMsg}>{this.state.errorMsg || ""}</Text>

            <Text style={[styles.descriptionText, {fontSize: 12, textAlign: 'center'}]}>
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
            enabled={true} />
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
  logo:{
    width:180,
    height:75,
  },
  descriptionText: {
    marginTop: 20,
    fontSize: 15,
    fontWeight: 'bold',
  },
  errorMsg: {
    color: 'red',
  },
});


module.exports = LoginScreen;
