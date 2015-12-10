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
  contextTypes: {
    menuActions: React.PropTypes.object.isRequired,
  },
  toggleSideMenu: function() {
    this.context.menuActions.close();
  },
  pushMakeOfferScreen: function() {
    this.toggleSideMenu();
    this.props.sideMenuSubject.onNext({type: "pushScreen", uri:"makeOffer"});
  },
  pushMyOfferScreen: function(){

  },
  pushLoginScreen: function() {
    this.toggleSideMenu();
    this.props.sideMenuSubject.onNext({type: "pushScreen", uri: "login"});
  },
  pressLogout: function() {
    var toggleSideMenu = this.toggleSideMenu;
    this.logOut().then((hasLoggedOut)=>{
      if (hasLoggedOut) {
        toggleSideMenu();
        this.props.sideMenuSubject.onNext({type: "logout"});
      }
    }).done();
  },
  async logOut(){
    try {
      await AsyncStorage.removeItem("SESSION");
      console.log("User Is Logged Out");
      return true;
    } catch (error) {
      console.log("Error Logging Out " + error);
      return false;
    }
  },
  render: function() {
    var commonMenus = (<View><MenuItem text={"FAQ"} onPress={() => LinkingIOS.openURL("http://plainexchange.xyz/faq")} />
    <MenuItem text={"TERMS & CONDITIONS"} onPress={() => LinkingIOS.openURL("http://plainexchange.xyz/terms")} />
    <MenuItem text={"ABOUT US"} onPress={() => LinkingIOS.openURL("http://plainexchange.xyz")} /></View>);

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

    return (
      <View style={[styles.container, (this.props.isOpen ? null : {opacity: 0})]}>
        <View style={styles.header}>
          {this.props.user ?
            (<Text style={styles.nameText}>{this.props.user["Email"]}</Text>) : null}
        </View>
        <View style={styles.menuContainer}>
          {this.props.user ? loginUserMenu : nonLoginUserMenu}
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
