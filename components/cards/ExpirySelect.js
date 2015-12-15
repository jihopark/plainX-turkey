'use strict';

var React = require('react-native');
var Rx = require('rx');

var {
  View,
  Text,
  Platform,
  Image,
  DatePickerIOS,
  StyleSheet,
  TouchableOpacity,
} = React;

var Divider = require('../Divider.js');

var DateFormat = React.createClass({
  displayName: "DateFormat",
  render: function() {
    var triangle = require('image!triangle');
    return (
      <View style={styles.dateformatContainer}>
        <Image source={require('image!calendar')}
          style={styles.calendarIcon} />
        <View style={[{width: 45}, styles.textContainer]}>
          <Text style={styles.dateformatText}>{(this.props.date.getMonth()+1)}</Text>
          <View style={{height:1, flex:1, backgroundColor: '#33cc66'}} />
        </View>
        <Image style={[this.props.triangleIconStyle, {marginRight: 5}]} source={triangle} />

        <View style={[{width: 45}, styles.textContainer]}>
          <Text style={styles.dateformatText}>{this.props.date.getDate()}</Text>
          <View style={{height:1, flex:1, backgroundColor: '#33cc66'}} />
        </View>
        <Image style={[this.props.triangleIconStyle, {marginRight: 5}]} source={triangle} />

        <View style={[{width: 90}, styles.textContainer]}>
          <Text style={styles.dateformatText}>{this.props.date.getFullYear()}</Text>
          <View style={{height:1, flex:1, backgroundColor: '#33cc66'}} />
        </View>
        <Image style={[this.props.triangleIconStyle, {marginRight: 5}]} source={triangle} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  dateformatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  dateformatText: {
    color: '#33cc66',
    fontSize: 60/2,
    textAlign: 'center',
  },
  calendarIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  doneButtonIcon: {
    width:14,
    height: 14,
  },
  doneButtonText: {
    fontSize: 15,
    color: '#33cc66',
    fontWeight: 'bold',
  },
});

var ExpirySelect = React.createClass({
  displayName: "ExpirySelect",
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
    var date = new Date(this.props.data["Expiry"]*1000);

    var datePicker = Platform.OS === 'ios' ?
     (
      <View style={{alignItems:'center', flexDirection:'column'}}>
        <DatePickerIOS
            style={{backgroundColor: 'transparent'}}
            date={date}
            mode="date"
            onDateChange={function(selectedDate){
              if (selectedDate >= new Date()) { //No past dates
                next["Expiry"] = selectedDate.getTime()/1000;
                subject.onNext(next);
              }
            }}
          />
        <TouchableOpacity style={{alignSelf: 'flex-end', flexDirection: 'row', marginRight: 10,}} onPress={this.closeDatePicker}>
          <Image source={require('image!checkmark')}
                  style={styles.doneButtonIcon}/>
          <Text style={styles.doneButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    ) :
    null; //for android

    return (
      <View>
        <Text style={[this.props.cardCommonStyles.titles, {marginBottom: 5}]}>
          {this.props.data["TitleText"]}</Text>
        <Divider />
        <TouchableOpacity style={{flexDirection:'column', alignItems:'center'}} onPress={this.showDatePicker}>
          <DateFormat
            triangleIconStyle={this.props.cardCommonStyles.triangleIconStyle}
            date={date} />
        </TouchableOpacity>
        {this.state.isDatePickerShown ? datePicker : null}
        <Text style={this.props.cardCommonStyles.description}>
          {this.props.data["DescriptionText"]}</Text>
      </View>
    );
  }
});

module.exports = ExpirySelect;
