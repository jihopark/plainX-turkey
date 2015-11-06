'use strict';

var React = require('react-native');
var {
  Navigator,
  Text,
  TouchableOpacity,
} = React;

var Routes = require('../screens/Routes.js');
var routesMap;

var PlainNavigator = React.createClass({
  getDefaultProps: () => {
    return {
      uri: 'main/offers/offers/offers/offers'
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

      }
      else {
        if (routes.hasBack()) {
          return (
            <TouchableOpacity onPress={() => navigator.pop()}>
              <Text>Back</Text>
            </TouchableOpacity>
          );
        }
      }
      return null;
    },
    RightButton: (route, navigator, index, navState) => {
      var routes = new Routes(route.uri.split("/"));
      if (routes.getCurrentRoute().hasCustomRightButton) {

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
          routes={routes}
          navigator={navigator}
          api_domain={this.props.api_domain} />
      );
    }
    return null;
  },
  render: function() {
    return (
      <Navigator
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
