'use strict';

var React = require('react-native');
var {
  View,
} = React;

var Divider = React.createClass({
  displayName: 'Divider',
  render: function() {
    return (<View style={{flex:1, height: 1, backgroundColor: '#33cc66'}}/>);
  }
});
module.exports = Divider;
