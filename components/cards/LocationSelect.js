'use strict';

var React = require('react-native');
var PlainActions = require('../../actions/PlainActions.js');

var {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} = React;

var Divider = require('../Divider.js');


var LocationCheckBox = React.createClass({
  displayName: "LocationCheckBox",
  render: function() {
    var checkmarkStyle = this.props.selected ?
    [styles.checkmark]
    : [styles.checkmark, {opacity: 0}] ;

    return (
      <View style={styles.selection}>
        <View style={styles.checkbox}>
          <Image style={checkmarkStyle} source={require('../../assets/checkmark.png')} />
        </View>
        <Text style={styles.locationName}>{this.props.name}</Text>
      </View>
    );
  }
});

var LocationSelect = React.createClass({
  displayName: "LocationSelectCard",
  render: function() {
    var id = this.props.id;
    var locations = this.props.data["Locations"];

    var selections = Object.keys(this.props.data["Locations"]).map(function(location){
      return (
        <TouchableOpacity key={location} onPress={function(){
          var copy = JSON.parse(JSON.stringify(locations));
          copy[location]["IsSelected"] = !copy[location]["IsSelected"];
          PlainActions.updateCardData(id, "Locations", copy);
        }}>
          <LocationCheckBox key={location} name={location} selected={locations[location]["IsSelected"]}/>
        </TouchableOpacity>
      );
    });
    return (
      <View>
        <Text style={[this.props.cardCommonStyles.titles, {marginBottom: 5}]}>
          {this.props.data["TitleText"]}
        </Text>
        <Divider />
        <View style={styles.selectionContainer}>
          {selections}
        </View>
        <Text style={this.props.cardCommonStyles.description}>
          {this.props.data["DescriptionText"]}
        </Text>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  selectionContainer: {
    flexDirection: 'row',
    flexWrap:'wrap',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'space-around',
  },
  selection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: '#33cc66',
    borderRadius: 4,
    marginRight: 3,
  },
  checkmark:{
    width: 12,
    height: 12,
    resizeMode: 'stretch',
    alignSelf: 'center'
  },
  locationName: {
    color: '#333333',
    fontSize: 60/3,
  }
});

module.exports = LocationSelect;
