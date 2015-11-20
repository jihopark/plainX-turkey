'use strict';

var React = require('react-native');
var {
  Navigator,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBarIOS,
  Platform,
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
      return (
        <Text>
          {routes.getCurrentRoute().title}
        </Text>
      );
    },
    LeftButton: (route, navigator, index, navState) => {
      var routes = new Routes(route.uri);
      if (routes.getCurrentRoute().hasCustomLeftButton) {
        if (routes.getCurrentRoute().leftButtonText) {
          return (<NavigationTextButton
                    buttonText={routes.getCurrentRoute().leftButtonText}
                    onPress={() => navigator.props.leftNavBarButtonSubject.onNext(routes)} />);
        }
      }
      else {
        if (routes.hasBack()) {
          return (<NavigationTextButton onPress={() => navigator.pop()} />);
        }
      }
      return null;
    },
    RightButton: (route, navigator, index, navState) => {
      var routes = new Routes(route.uri);
      if (routes.getCurrentRoute().hasCustomrRightButton) {
        if (routes.getCurrentRoute().rightButtonText) {
          return (<NavigationTextButton
                    buttonText={routes.getCurrentRoute().rightNavBarButtonText}
                    onPress={() => navigator.props.rightNavBarButtonSubject.onNext(routes)}/>);
        }
      }
      return null;
    }
  },
  renderScene: function(route, navigator) {
    var routes = new Routes(route.uri);
    if (routes!= null) {
      var Screen = routes.getCurrentRoute().getComponent();
      return (
        <ScrollView  keyboardShouldPersistTaps={false}>
          <Screen
            //subscribe to these subjects if need to receive left,right button events
            leftNavBarButtonSubject={this.leftNavBarButtonSubject}
            rightNavBarButtonSubject={this.rightNavBarButtonSubject}
            routes={routes}
            pushScreen={navigator.push}
            api_domain={API_DOMAIN}
            setNetworkActivityIndicator={this.setNetworkActivityIndicator}
            params={routes.getCurrentRouteParams()} />
        </ScrollView>
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
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={this.navBarRouter}/>
        }
      />
    );
  }
});

module.exports = PlainNavigator;
