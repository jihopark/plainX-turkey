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
} = React;

var Routes = require('./screens/Routes.js');
var Rx = require('rx')
var NavigationTextButton = require('./NavigationTextButton.js');
var API_DOMAIN = 'https://plainexchange.herokuapp.com/api/v1/';

var routesMap;

var PlainNavigator = React.createClass({
  getDefaultProps: () => {
    return {
      uri: 'main'
    };
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
      return routes.getCurrentRoute().title ?
      (<Text style={[styles.navBarText, styles.navBarTitleText]}>{routes.getCurrentRoute().title}</Text>)
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
            onPress={() => navigator.props.leftNavBarButtonSubject.onNext(routes)}
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
      if (routes.getCurrentRoute().hasCustomRightButton) {
        var button;
        if (routes.getCurrentRoute().rightButtonText) {
          button = (<NavigationTextButton
              styles={styles}
              buttonText={routes.getCurrentRoute().rightNavBarButtonText} />);
        }
        if (routes.getCurrentRoute().rightButtonImageSource) {
          button = (
            <Image style={[styles.navBarIcon, {position:'absolute', top:0, left: -20, width: 30, height: 30}]}
              source={routes.getCurrentRoute().rightButtonImageSource()} />);
        }
        return (
            <TouchableOpacity
              style={styles.navBarRightButton}
              onPress={() => navigator.props.rightNavBarButtonSubject.onNext(routes)}>
                {button}
              </TouchableOpacity>);

      }
      return null;
    }
  },
  renderScene: function(route, navigator) {
    var routes = new Routes(route.uri);
    if (routes!= null) {
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
            api_domain={API_DOMAIN}
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
      <Navigator
        leftNavBarButtonSubject={this.leftNavBarButtonSubject}
        rightNavBarButtonSubject={this.rightNavBarButtonSubject}
        initialRouteStack={this.getInitialRouteStack(this.props.uri)}
        renderScene={this.renderScene}
        style={styles.appContainer}
        navigationBar={
          <Navigator.NavigationBar
            style={styles.navBar}
            routeMapper={this.navBarRouter}/>
        }
      />
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
});

module.exports = PlainNavigator;
