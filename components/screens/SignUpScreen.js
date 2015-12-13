'use strict';

var React = require('react-native');

var {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  LinkingIOS,
  Platform,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var KeyboardSpaceMixin = require('./componentMixins/KeyboardSpaceMixin.js');

var RestKit = require('react-native-rest-kit');
var md5 = require('md5');

var ActionButton = require('../ActionButton.js');
var PlainTextInput = require('../PlainTextInput.js');

var SignUpScreen = React.createClass({
  mixins: [ScreenMixin, KeyboardSpaceMixin],
  displayName: "SignUpScreen",
  getInitialState: function() {
    return {
      password: "",
      passwordConfirm:"",
      email: "",
      data: [],
      showConfirmation: false,
      keyboardSpace: 0,
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
      console.log(error);
      if (error.status == 400) {
        var errorMsg = JSON.parse(error.body)["Error"];
        if (errorMsg)
          this.setState({errorMsg: errorMsg});
      }
      return ;
    }
    console.log(json);
    if (json){
      // if 200
      this.setState({showConfirmation: true});
    }
  },
  onSignUp: function(){
    if (this.state.password != this.state.passwordConfirm) {
      this.setState({errorMsg: "Passwords do not match."});
      return ;
    }
    this.props.setNetworkActivityIndicator(true);
    var url = this.props.api_domain + "register";
    var pwd = ""+this.state.password;
    var request = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        hashedpw: md5(pwd),
      })
    };
    RestKit.send(url, request, this.handleRequest);
  },
  popScreen: function(){
    this.props.popScreen();
  },
  renderScreen: function() {
    return (
      <ScrollView contentContainerStyle={[this.screenCommonStyle.container, {flexDirection: 'column', alignItems: 'center'}]}>
        <Image source={require('../../assets/BG2.png')} style={styles.backgroundImage}>
        <View style={[styles.container, {paddingTop: 30-this.state.keyboardSpace}]}>
            <Image source={require('../../assets/logo_lg.png')} style={styles.logo}/>
            {this.state.showConfirmation ?
              (<Text style={[styles.descriptionText, {fontSize: 18}]}>{"Thank you for registering!\nPlease check your email for\nactivation instructions."}</Text>)
              :
            (<View style={{flex:1, alignItems: 'center', flexDirection: 'column'}}>
                <TouchableOpacity onPress={this.props.popScreen}>
                <Text style={styles.descriptionText}>
                  {"Already have an account?"} <Text style={{color: '#33cc66'}}>{"Login Here!"}</Text>
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
                <PlainTextInput
                    icon={require("../../assets/passwordicon.png")}
                    placeholder={"Password Confirmation"}
                    secureTextEntry={true}
                    onChangeText={this.onChangePasswordConfirm}
                    value={this.state.passwordConfirm} />
              </View>

              <TouchableOpacity onPress={() => (Platform.OS == 'ios' ? LinkingIOS.openURL("http://plainexchange.xyz/terms") : null)}>
                <Text style={[styles.descriptionText, styles.extraText]}>
                  {"By signing up, you are agreeing to\n "}
                  <Text style={{color: '#33cc66'}}>our terms and conditions</Text>
                </Text>
              </TouchableOpacity>

              <Text style={[styles.descriptionText, styles.extraText]}>
                {"*Our service is currently open to HKUST & HKU only.\nPlease register with a valid email from those institutions."}
              </Text>
            </View>)}
          </View>
        </Image>
        {this.state.showConfirmation ? null :
          (<View  style={{alignSelf:'stretch'}}>
            <ActionButton
              text={"REGISTER"}
              onPress={this.onSignUp}
              enabled={true} />
          </View>)}
      </ScrollView>
    );

    return this.state.showConfirmation ? activationNeededView : signUpFormsView;
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
    marginTop: 10,
    alignItems:'center',
  },
  logo:{
    width:144,
    height:60,
    resizeMode: 'stretch',
  },
  descriptionText: {
    marginTop: 10,
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


module.exports = SignUpScreen;
