'use strict';

var React = require('react-native');
var {
  View,
  Navigator,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBarIOS,
  Platform,
  StyleSheet,
  Image,
  Animated,
} = React;

var Routes = require('./screens/Routes.js');
var Rx = require('rx')
var SideMenu = require('react-native-side-menu');

var PlainSideMenu = require('./PlainSideMenu.js');
var NavigationTextButton = require('./NavigationTextButton.js');
var RestKit = require('react-native-rest-kit');

var routesMap;

var PlainNavigator = React.createClass({
  getDefaultProps: () => {
    return {
      sideMenuSubject: new Rx.Subject(),
    };
  },
  getInitialState: function() {
    return {
      user: null,
      messageBounceValue: new Animated.Value(0),
      shouldBounceCount: true,
      isSideMenuOpen: false,
    };
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (nextProps["uri"] != this.props.uri) {
      this.shouldRerender = true;
    }
    if (nextProps["messageCount"]>0 && nextProps["messageCount"]!= this.props.messageCount)
      this.setState({shouldBounceCount: true});
    return true;
  },
  componentDidUpdate: function() {
    if (this.state.shouldBounceCount)
      this.bounceMessage();
  },
  //To Load all necessary screens from the uri
  getInitialRouteStack: (uri) => {
    var initialRoutesStack = [];
    var routes = new Routes(uri);
    var length = routes.getDepth();
    for (var i=0;i<length;i++) {
      initialRoutesStack.push({uri: routes.getUri()});
      routes = routes.getPreviousRoutes();
    }
    return initialRoutesStack.reverse();
  },
  setNetworkActivityIndicator: function(value) {
    if (Platform.OS === 'ios')
      StatusBarIOS.setNetworkActivityIndicatorVisible(value);
  },
  navBarRouter: {
    Title: (route, navigator, index, navState) => {
      var routes = new Routes(route.uri);
      var screenNameParam = routes.getScreenNameInParamsIfAny();

      return routes.getCurrentRoute().title ?
      (<Text style={[styles.navBarText, styles.navBarTitleText]}>{screenNameParam ? screenNameParam : routes.getCurrentRoute().title}</Text>)
      :
      (<Image style={styles.navBarTitleImage} source={require('../assets/logo.png')} />);
    },
    LeftButton: (route, navigator, index, navState) => {
      var routes = new Routes(route.uri);
      if (routes.getCurrentRoute().hasCustomLeftButton) {
        var button;
        if (routes.getCurrentRoute().leftButtonText) {
          button = (
              <NavigationTextButton
                styles={styles}
                buttonText={routes.getCurrentRoute().leftButtonText} />);
        }
        if (routes.getCurrentRoute().leftButtonImageSource) {
          button = (
            <Image style={styles.navBarIcon}
              source={routes.getCurrentRoute().leftButtonImageSource()} />
          );
        }
        return (
          <TouchableOpacity
            onPress={() => navigator.props.leftNavBarButtonSubject.onNext(routes) }
            style={styles.navBarLeftButton}>
            {button}
          </TouchableOpacity>);
      }
      else {
        if (routes.hasBack()) {
          return (
            <TouchableOpacity
              style={styles.navBarLeftButton}
              onPress={() => navigator.pop()}>
              <Image style={styles.navBarIcon}
                source={require('../assets/backicon.png')} />
            </TouchableOpacity>);
        }
      }
      return null;
    },
    RightButton: (route, navigator, index, navState) => {
      var routes = new Routes(route.uri);
      var routeName = routes.getCurrentRoute().name;
      var isMessageRelatedScreen = routeName == "conversations" || routeName == "conversationRoom"
      console.log(navigator.props.messageCount);
      return isMessageRelatedScreen ? null :
        (<TouchableOpacity
          style={styles.navBarRightButton}
          onPress={() => navigator.props.rightNavBarButtonSubject.onNext(routes)}>
            <Image style={[styles.navBarIcon, styles.messageIcon]}
              source={require("../assets/msgicon.png")} />
            {navigator.props.messageCount > 0 ?
              (<Animated.View style={[styles.messageCountContainer, {transform: [{scale: navigator.props.messageBounceValue}]}]}>
                <Text style={styles.messageCount}>
                  {navigator.props.messageCount}
                </Text>
              </Animated.View>) : null}
          </TouchableOpacity>);
    }
  },
  updateInfo: function(token) {
    var request = {
      method: 'get',
      headers:{ 'X-Session': token, }
    };

    if (!this.state.user){
      console.log("UPDATE USER INFO");
      var url = this.props.API_DOMAIN + "user/me";
      RestKit.send(url, request, this.updateUserInfo);
    }
    this.props.updateMessageCount(token);
  },
  updateUserInfo: function(error, json) {
    if (error) {
      console.log("Error loading UserInfo")
      console.log(error);
      return ;
    }
    if (json) {
      console.log("Update User info " + json);
      this.setState({user: json});
    }
  },
  bounceMessage: function() {
    this.state.messageBounceValue.setValue(1.1);
    Animated.spring(
      this.state.messageBounceValue,
      {
        toValue: 0.8,
        friction: 0.5,
      }
    ).start();
  },
  setLogoutState: function() {
    this.setState({user:null});
  },
  renderScene: function(route, navigator) {
    var routes = new Routes(route.uri);
    if (this.shouldRerender && this.props.uri != route.uri) {
      this.shouldRerender = false;
      var newRouteStack = this.getInitialRouteStack(this.props.uri);
      navigator.immediatelyResetRouteStack(newRouteStack);
      return ;
    }
    if (routes!= null) {
      if (!navigator.props.sideMenuSubject.hasObservers()) {
        var changeState =
        navigator.props.sideMenuSubject.subscribe(function(event){
          switch (event.type) {
            case "pushScreen":
              navigator.push({uri: routes.addRoute(event.uri)});
              break;
            case "logout":
              navigator.props.setLogoutState();
              break;
          }
        });
      }

      var Screen = routes.getCurrentRoute().getComponent();
      return (
        <View
          style={styles.scene} keyboardShouldPersistTaps={false}>
          <Screen
            //subscribe to these subjects if need to receive left,right button events
            enablePagination={routes.getCurrentRoute().enablePagination}
            leftNavBarButtonSubject={this.leftNavBarButtonSubject}
            rightNavBarButtonSubject={this.rightNavBarButtonSubject}
            routes={routes}
            pushScreen={navigator.push}
            popScreen={navigator.pop}
            replaceScreen={navigator.replace}
            immediatelyResetRouteStack={navigator.immediatelyResetRouteStack}
            api_domain={this.props.API_DOMAIN}
            updateInfo={this.updateInfo}
            setNetworkActivityIndicator={this.setNetworkActivityIndicator}
            params={routes.getCurrentRouteParams()} />
        </View>
      );
    }
    return null;
  },
  leftNavBarButtonSubject: new Rx.Subject(),
  rightNavBarButtonSubject: new Rx.Subject(),
  render: function() {
    return (
      <SideMenu
          onChange={(isOpen) => this.setState({isSideMenuOpen: isOpen})}
          menu={
          <PlainSideMenu
            isOpen={this.state.isSideMenuOpen}
            sideMenuSubject={this.props.sideMenuSubject}
            user={this.state.user} />}
            touchToClose={true}>
        <Navigator
          setLogoutState={this.setLogoutState}
          sideMenuSubject={this.props.sideMenuSubject}
          leftNavBarButtonSubject={this.leftNavBarButtonSubject}
          rightNavBarButtonSubject={this.rightNavBarButtonSubject}
          initialRouteStack={this.getInitialRouteStack(this.props.uri)}
          renderScene={this.renderScene}
          messageCount={this.props.messageCount}
          messageBounceValue={this.state.messageBounceValue}
          style={styles.appContainer}
          navigationBar={
            <Navigator.NavigationBar
              style={styles.navBar}
              routeMapper={this.navBarRouter}/>
          }
        />
      </SideMenu>
    );
  }
});

var styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {

  },
  navBarTitleImage: {
    width:59,
    height:25,
    marginVertical: 10,
    padding: 5,
  },
  navBarIcon: {
    width:20,
    height:20,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  navBarLeftButton: {
    marginLeft: 10,
    marginTop: 12,
    padding: 3,
  },
  navBarRightButton: {
    marginRight: 10,
    marginTop: 12,
    padding: 3,
  },
  navBarButtonText: {
    color: '#33cc66',
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA', //should change to background image later
  },
  messageIcon: {
    position:'absolute',
    top:-2,
    left: -20,
    width: 30, height: 30
  },
  messageCountContainer: {
    backgroundColor:'#33cc66',
    width:20, height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    flexDirection: 'row',
    position:'absolute',
    top:-2,
    left: -33,
  },
  messageCount: {
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
  }
});

module.exports = PlainNavigator;
