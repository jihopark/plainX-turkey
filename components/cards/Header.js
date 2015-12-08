'use strict';

var React = require('react-native');
var {
  View,
  Text,
} = React;

var Header = React.createClass({
  displayName: "HeaderCard",
  render: function() {
    return (
      <View style={{flexDirection: 'column'}}>
        <Text style={this.props.cardCommonStyles.titles}>
          {this.props.data["TitleText"]}
        </Text>
        {this.props.data["DescriptionText"] ?
          (<Text style={[this.props.cardCommonStyles.description, {fontSize: 12, marginTop: 10}]}>
            {this.props.data["DescriptionText"]}
          </Text>): null}
      </View>
    );
  }
});

module.exports = Header;
