'use strict';

var React = require('react-native');
var Rx = require('rx');

var {
  View,
  Text,
  Platform,
  DatePickerIOS,
  TouchableOpacity,
} = React;

var ExpiryDateSelect = React.createClass({
  displayName: "ExpiryDateSelectCard",
  getInitialState: function() {
    return {
      isDatePickerShown: false
    };
  },
  showDatePicker: function() {
    this.setState({isDatePickerShown: true});
  },
  closeDatePicker: function() {
    this.setState({isDatePickerShown: false});
  },
  render: function() {
    var subject = new Rx.Subject();
    if (this.props.observer) {
      subject.subscribe(this.props.observer);
    }
    var next = {"id": this.props.id};
    var date = new Date(this.props.data["Date"]);

    var datePicker = Platform.OS === 'ios' ?
     (
      <View>
        <DatePickerIOS
            date={date}
            mode="date"
            onDateChange={function(selectedDate){
              if (selectedDate >= new Date()) { //No past dates
                next["Date"] = selectedDate;
                subject.onNext(next);
              }
            }}
          />
        <TouchableOpacity onPress={this.closeDatePicker}><Text>Close</Text></TouchableOpacity>
      </View>
    ) :
    null; //for android

    return (
      <View>
        <Text>{this.props.data["TitleText"]}</Text>
        <TouchableOpacity onPress={this.showDatePicker}>
          <Text>{date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()}</Text>
        </TouchableOpacity>
        {this.state.isDatePickerShown ? datePicker : null}
        <Text>{this.props.data["DescriptionText"]}</Text>
      </View>
    );
  }
});

module.exports = ExpiryDateSelect;
