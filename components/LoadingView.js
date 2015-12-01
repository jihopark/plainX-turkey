'use strict';

var React = require('react-native');
var {
  Text,
  View,
  ActivityIndicatorIOS,
  Platform,
} = React;

var LoadingView = React.createClass({
  displayName: 'LoadingView',
  render: function() {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        {Platform.OS === 'ios' ?
        <ActivityIndicatorIOS size='small' color="#33cc66" />
        :
        (<Text>Loading...</Text>)}

      </View>
    );
  }
});

module.exports = LoadingView;
