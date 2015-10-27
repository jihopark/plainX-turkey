'use strict';

var React = require('react-native');
var {
  AppRegistry,
} = React;

var API_DOMAIN = 'https://plainexchange.herokuapp.com/api/v1/';

var OffersList = require('./components/OffersList.js')
var body = React.createClass({
  render: function() {
    return (
      <OffersList API_DOMAIN={API_DOMAIN}/>
    );
  }
});
AppRegistry.registerComponent('plainX', () => body);
