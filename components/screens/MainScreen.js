'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} = React;

var OffersList = require('../OffersList.js');
var Routes = require('../screens/Routes.js');
var ScreenMixin = require('./ScreenMixin.js');

var MainScreen = React.createClass({
  mixins: [ScreenMixin],
  subscribeToSubject: (left, right) => {
    left.subscribe((x) => console.log(x));
    right.subscribe((x) => console.log(x));
  },
  render: function() {
    this.subscribeToSubject(this.props.leftNavBarButtonSubject, this.props.rightNavBarButtonSubject);
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.props.pushScreen({uri:this.props.routes.addRoute("offers")})}>
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
