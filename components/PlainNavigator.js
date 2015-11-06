'use strict';

var React = require('react-native');
var {
  Navigator,
  Text,
  TouchableOpacity,
} = React;

var Routes = require('../screens/Routes.js');
var Rx = require('rx')
var NavigationTextButton = require('./NavigationTextButton.js');

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
    var routes = new Routes(uri.split("/"));
    var length = routes.getDepth();
    for (var i=0;i<length;i++) {
      initialRoutesStack.push({uri: routes.getUri()});
      routes = routes.getPreviousRoutes();
    }
    return initialRoutesStack.reverse();
  },
  _navBarRouter: {
    Title: (route, navigator, index, navState) => {
      var routes = new Routes(route.uri.split("/"));
      return (
        <Text>
          {routes.getCurrentRoute().title}
        </Text>
      );
    },
    LeftButton: (route, navigator, index, navState) => {
      var routes = new Routes(route.uri.split("/"));
      if (routes.getCurrentRoute().hasCustomLeftButton) {
        if (routes.getCurrentRoute().leftButtonText) {
          return (<NavigationTextButton
                    buttonText={routes.getCurrentRoute().leftButtonText}
                    onPress={() => navigator.props.leftButtonSubject.onNext(routes)} />);
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
      var routes = new Routes(route.uri.split("/"));
      if (routes.getCurrentRoute().hasCustomRightButton) {
        if (routes.getCurrentRoute().rightButtonText) {
          return (<NavigationTextButton
                    buttonText={routes.getCurrentRoute().rightButtonText}
                    onPress={() => navigator.props.rightButtonSubject.onNext(routes)}/>);
        }
      }
      return null;
    }
  },
  _renderScene: function(route, navigator) {
    var routes = new Routes(route.uri.split("/"));
    if (routes!= null) {
      var Screen = routes.getCurrentRoute().getComponent();
      return (
        <Screen
          //subscribe to these subjects if need to receive left,right button events
          leftButtonSubject={this._leftButtonSubject}
          rightButtonSubject={this._rightButtonSubject}
          routes={routes}
          navigator={navigator}
          api_domain={this.props.api_domain} />
      );
    }
    return null;
  },
  _leftButtonSubject: new Rx.Subject(),
  _rightButtonSubject: new Rx.Subject(),
  render: function() {
    return (
      <Navigator
        leftButtonSubject={this._leftButtonSubject}
        rightButtonSubject={this._rightButtonSubject}
        initialRouteStack={this.getInitialRouteStack(this.props.uri)}
        renderScene={this._renderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={this._navBarRouter}/>
        }
      />
    );
  }
});

module.exports = PlainNavigator;
