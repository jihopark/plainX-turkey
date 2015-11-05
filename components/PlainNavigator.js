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
      initialRoute: {uri: 'main', id:'main'}
    };
  },
  _onBackPress: () => {
    console.log("On Back Press");
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
      if (routes.hasBack()) {
        return (
          <TouchableOpacity onPress={this._onBackPress}>
            <Text>Back</Text>
          </TouchableOpacity>
        );
      }
      else {
        return null;
      }
    },
    RightButton: (route, navigator, index, navState) => {

    }
  },
  _renderScene: function(route, navigator) {
    var routes = new Routes(route.uri.split("/"));
    if (routes!= null) {
      var Screen = routes.getCurrentRoute().getComponent();
      return (
        <Screen
          navigator={navigator}
          api_domain={this.props.api_domain} />
      );
    }
    return null;
  },
  render: function() {
    return (
      <Navigator
        initialRoute={this.props.initialRoute}
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
