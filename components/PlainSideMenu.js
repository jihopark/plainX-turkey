'use strict';

var React = require('react-native');
var Routes = require('./screens/Routes.js');
const Dimensions = require('Dimensions');

var {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  LinkingIOS,
} = React;

const window = Dimensions.get('window');

var SessionStore = require('../stores/SessionStore.js');
var SessionActions = require('../actions/SessionActions.js');

var PlainLog = require('../PlainLog.js');
var P = new PlainLog("PlainSideMenu");


var MenuItem = React.createClass({
  displayName: "MenuItem",
  render: function() {
    return (
      <TouchableOpacity style={styles.menuItem} onPress={this.props.onPress || null}>
        <Text style={styles.menuItemText}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
});

var PlainSideMenu = React.createClass({
  displayName: 'PlainSideMenu',

  getInitialState: function() {
    return SessionStore.getState();
  },

  componentDidMount: function(){
    SessionStore.listen(this.onChange);
  },

  componentWillUnmount: function(){
    SessionStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if (nextState["loginToken"]) {
      if (nextState["user"] == -1 && this.state.user!=-1) {
        P.log("shouldComponentUpdate", "Logout should be called");
        SessionActions.logOut(this.state.loginToken, this.state.deviceToken);
      }
      else if (nextState["user"] == null) {
        P.log("shouldComponentUpdate", "updateUser called");
        SessionActions.updateUser(nextState["loginToken"]);
      }
    }
    return true;
  },

  pushMakeOfferScreen: function() {
    this.props.sideMenuSubject.onNext({type: "pushScreen", uri:"makeOffer"});
  },
  pushMyOfferScreen: function(){
    this.props.sideMenuSubject.onNext({type: "pushScreen", uri: "myOffers"});
  },
  pushLoginScreen: function() {
    this.props.sideMenuSubject.onNext({type: "pushScreen", uri: "login"});
  },
  pushFAQScreen: function() {
    this.props.sideMenuSubject.onNext({type: "pushScreen", uri: "webView?code=faq"});
  },
  pushAboutScreen: function() {
    this.props.sideMenuSubject.onNext({type: "pushScreen", uri: "webView?code="});
  },
  pushTermsScreen: function() {
    this.props.sideMenuSubject.onNext({type: "pushScreen", uri: "webView?code=terms"});
  },
  pressLogout: function() {
    this.props.sideMenuSubject.onNext({type: "toggleSideMenu"});
    SessionActions.logOut(this.state.loginToken, this.state.deviceToken);
  },

  async removeLoginTokenFromAsyncStorage(){
    try {
      await AsyncStorage.removeItem("SESSION");
      P.log("removeLoginTokenFromAsyncStorage", "Removed!");
      return true;
    } catch (error) {
      P.log("Error Logging Out " + error);
      return false;
    }
  },

  render: function() {
    var commonMenus = (<View>
        <MenuItem text={"ABOUT US"} onPress={this.pushAboutScreen} />
        <MenuItem text={"FAQ"} onPress={this.pushFAQScreen} />
        <MenuItem text={"TERMS & CONDITIONS"} onPress={this.pushTermsScreen} />
      </View>);

    var loginUserMenu = (
      <View style={{flexDirection: 'column', flex:1}}>
        <MenuItem text={"MY OFFERS"} onPress={this.pushMyOfferScreen} />
        <MenuItem text={"MAKE OFFER"} onPress={this.pushMakeOfferScreen} />
        {commonMenus}
        <MenuItem text={"LOGOUT"} onPress={this.pressLogout} />
      </View>);
    var nonLoginUserMenu = (<View>
      {commonMenus}
      <MenuItem text={"LOGIN"} onPress={this.pushLoginScreen} />
      </View>);

    var isLoggedin = this.state.user ? Object.keys(this.state.user).length > 0 : false;

    return (
      <View style={[styles.container, (this.props.isOpen ? null : {opacity: 0})]}>
        <View style={styles.header}>
          {isLoggedin ?
            (<Text style={styles.nameText}>{this.state.user["Email"]}</Text>) : null}
        </View>
        <View style={styles.menuContainer}>
          {isLoggedin ? loginUserMenu : nonLoginUserMenu}
        </View>
        <View style={styles.footer}></View>

      </View>
    );
  }
});

var styles = StyleSheet.create({
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#3F7842',
    borderBottomWidth: 1,
    height: 60,
  },
  menuItemText: {
    color: 'white',
    marginLeft: 20,
    fontWeight: 'bold',
  },
  nameText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: window.width,
    height: window.height,
    flexDirection: 'column',
    paddingTop: 20,
  },
  header: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#33cc66',
  },
  footer: {
    flex: 3,
    backgroundColor: 'white',
  },
});

module.exports = PlainSideMenu;
