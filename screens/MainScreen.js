'use strict';

var React = require('react-native');
var {
  Component,
} = React;
var OffersList = require('../components/OffersList.js');

var MainScreen = React.createClass({
  render: function() {
    return (
      <OffersList api_domain={this.props.api_domain} />
    );
  }
});


module.exports = MainScreen;
