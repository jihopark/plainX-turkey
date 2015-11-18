'use strict';

var React = require('react-native');
var Rx = require('rx');

var {
  View,
  Text,
  TouchableOpacity,
} = React;

var LocationCheckBox = React.createClass({
  displayName: "LocationCheckBox",
  render: function() {
    return (
      <View>
        <Text>{(this.props.selected ? "[v]" : "[ ]") + this.props.name}</Text>
      </View>
    );
  }
});

var LocationSelect = React.createClass({
  displayName: "LocationSelectCard",
  render: function() {
    var subject = new Rx.Subject();
    if (this.props.observer) {
      subject.subscribe(this.props.observer);
    }
    var id = this.props.id;
    var next = {"id": id};
    var locations = this.props.data["Locations"];

    var selections = Object.keys(this.props.data["Locations"]).map(function(location){
      return (
        <TouchableOpacity onPress={function(){
          next["Location"] = location;
          next["Selected"] = !locations[location]["Selected"];
          subject.onNext(next);
        }}>
          <LocationCheckBox name={location} selected={locations[location]["Selected"]}/>
        </TouchableOpacity>
      );
    });
    return (
      <View>
        <Text>Step 3: Set your location</Text>
        {selections}
        <Text>FINISH</Text>
      </View>
    );
  }
});

module.exports = LocationSelect;
