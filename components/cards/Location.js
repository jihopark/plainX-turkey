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
    var offer = this.props.getOffer(this.props.data["OfferId"]);
    var locations = offer["Locations"];
    var offerOptionStyle = this.props.cardCommonStyles.offerOptions;

    var locationViews = Object.keys(locations).map(
      function(location){
        return (locations[location]["IsSelected"] ?
          (<Text key={location} style={offerOptionStyle}>{location}</Text>)
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
