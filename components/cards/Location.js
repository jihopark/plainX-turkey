'use strict';

var React = require('react-native');

var {
  Text,
  View,
  Image,
  StyleSheet,
} = React;

var Location = React.createClass({
  displayName: "LocationCard",
  render: function() {
    var locations = this.props.data["Locations"];
    var offerOptionStyle = this.props.cardCommonStyles.offerOptions;
    var locationViews = Object.keys(this.props.data["Locations"]).map(
      function(location){
        return (locations[location]["IsSelected"] ?
          (<Text style={offerOptionStyle}>{location}</Text>)
          : null
        );
      }
    );
    return (
      <View style={styles.container}>
        <Image style={styles.icon} source={require('../../assets/locationicon.png')} />
        <Text style={this.props.cardCommonStyles.offerTitle}>{this.props.data["TitleText"]}</Text>
        {locationViews}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container:{
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon:{
    width: 27, height: 40,
    resizeMode:'contain',
  },
});


module.exports = Location;
