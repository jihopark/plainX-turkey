'use strict';

var React = require('react-native');
var {
  Text,
  View,
  ActivityIndicatorIOS,
  Platform,
} = React;

var ProgressBar = require('ProgressBarAndroid');


var LoadingView = React.createClass({
  displayName: 'LoadingView',
  getDefaultProps: function(){
    return {
      size: "small",
      color: "#33cc66"
    };
  },
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  render: function() {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
        { Platform.OS === 'ios' ?
        <ActivityIndicatorIOS size={this.props.size} color={this.props.color} />
        :
        <ProgressBar styleAttr={this.capitalizeFirstLetter(this.props.size)} color={this.props.color} />
        }
      </View>
    );
  }
});

module.exports = LoadingView;
