'use strict';

var React = require('react-native');
var {
  Text,
} = React;

var OfferOwner = React.createClass({
  displayName: "OfferOwnerCard",
  render: function() {
    var isOwner = this.props.user ? this.props.user["Id"] == this.props.data["SellerId"] : false;
    return (
      <Text style={[this.props.cardCommonStyles.explanation,{textAlign:'center'}]}>
        {isOwner ? this.props.data["OwnerText"] : this.props.data["DefaultText"]}
      </Text>
    );
  }
});

module.exports = OfferOwner;
