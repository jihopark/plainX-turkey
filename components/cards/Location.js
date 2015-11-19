'use strict';

var React = require('react-native');

var {
  Text,
  View,
} = React;

var Location = React.createClass({
  displayName: "LocationCard",
  render: function() {
    var locations = this.props.data["Locations"];
    var locationViews = Object.keys(locations).map(
      function(location){
        return (<Text>{locations[location]["Name"]}</Text>);
      }
    );
    return (
      <View>
        <Text>{this.props.data["TitleText"]}</Text>
        {locationViews}
      </View>
    );
  }
});

module.exports = Location;
