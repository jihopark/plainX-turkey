'use strict';

var React = require('react-native');

var {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  LinkingIOS,
  Platform,
} = React;

var PlainListView = require('../PlainListView.js');
var BaseSessionScreen = require('./BaseSessionScreen.js');

var RestKit = require('react-native-rest-kit');
var md5 = require('md5');

var ActionButton = require('../ActionButton.js');
var PlainTextInput = require('../PlainTextInput.js');

class SignUpScreen extends BaseSessionScreen{
  constructor(props){
    super(props);
    this.state = {
      password: "",
      passwordConfirm:"",
      email: "",
      data: [],
      showConfirmation: false,
      keyboardSpace: 0,
      signup_note: "",
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSignUpNote = this.handleSignUpNote.bind(this);
    this.onChangePasswordConfirm = this.onChangePasswordConfirm.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.handleRequest = this.handleRequest.bind(this);
    this.popScreen = this.popScreen.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
  }

  componentDidMount(){
    super.componentDidMount();
    var url = this.props.api_domain + "meta?key=signup_note";
    var request = {
      method: 'get',
      'Content-Type': 'application/text'
   };
    RestKit.send(url, request, this.handleSignUpNote);
  }

  handleSignUpNote(error, json) {
    if (!error) {
      this.setState({signup_note: (json["Text"] || "")});
    }
  }

  onChangePasswordConfirm(text) {
    this.setState({passwordConfirm: text});
  }

  onSignUp(){
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
  }

  handleRequest(error, json){
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
  }

  popScreen(){
    this.props.popScreen();
  }

  renderScreen() {
    var margin = 30-this.state.keyboardSpace;

    return (
      <ScrollView contentContainerStyle={[this.screenCommonStyle.container, {flexDirection: 'column', alignItems: 'center'}]}>
        <Image source={require('image!BG2')} style={this.styles.backgroundImage}>
        <View style={[this.styles.container, (margin > 0 ? {paddingTop: margin} : {paddingTop: 0})]}>
            {margin > 0 ? (<Image source={require('image!logo_lg')} style={this.styles.logo}/>) : null}
            {this.state.showConfirmation ?
              (<Text style={[this.styles.descriptionText, {fontSize: 18}]}>{"Thank you for registering!\nPlease check your email for\nactivation instructions."}</Text>)
              :
            (<View style={{flex:1, alignItems: 'center', flexDirection: 'column'}}>
              {margin > 0 ?
              (<TouchableOpacity onPress={this.props.popScreen}>
                <Text style={this.styles.descriptionText}>
                  {"Already have an account?"} <Text style={{color: '#33cc66'}}>{"Login Here!"}</Text>
                </Text>
              </TouchableOpacity>) : null}

              <View style={this.styles.textInputContainer}>
                <Text style={this.styles.errorMsg}>{this.state.errorMsg || ""}</Text>
                <PlainTextInput
                    icon={require("image!emailicon")}
                    placeholder={"Email"}
                    keyboardType={"email-address"}
                    onChangeText={this.onChangeEmail}
                    value={this.state.email} />
                <PlainTextInput
                    icon={require("image!passwordicon")}
                    placeholder={"Password"}
                    secureTextEntry={true}
                    onChangeText={this.onChangePassword}
                    value={this.state.password} />
                <PlainTextInput
                    icon={require("image!passwordicon")}
                    placeholder={"Password Confirmation"}
                    secureTextEntry={true}
                    onChangeText={this.onChangePasswordConfirm}
                    value={this.state.passwordConfirm} />
              </View>

              <TouchableOpacity onPress={() => (Platform.OS == 'ios' ? LinkingIOS.openURL("http://plainexchange.xyz/terms") : null)}>
                <Text style={[this.styles.descriptionText, this.styles.extraText]}>
                  {"By signing up, you are agreeing to\n "}
                  <Text style={{color: '#33cc66'}}>our terms and conditions</Text>
                </Text>
              </TouchableOpacity>

              <Text style={[this.styles.descriptionText, this.styles.extraText]}>
                {this.state.signup_note}
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
}

module.exports = SignUpScreen;
