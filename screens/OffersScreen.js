'use strict';

var React = require('react-native');

var OffersList = require('../components/OffersList.js');

var OffersScreen = React.createClass({
  render: function() {
    return (
      <OffersList api_domain={this.props.api_domain} />
    );
  }
});


module.exports = OffersScreen;
