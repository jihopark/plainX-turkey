'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} = React;
var OffersList = require('../components/OffersList.js');
var Routes = require('../screens/Routes.js');

var MainScreen = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.props.navigator.push({uri:this.props.routes.addRoute("offers")})}>
          <Text>This is the Main Page</Text>
        </TouchableOpacity>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});


module.exports = MainScreen;
