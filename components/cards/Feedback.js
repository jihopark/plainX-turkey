'use strict';

var React = require('react-native');
var Rx = require('rx')
var RestKit = require('react-native-rest-kit');

var {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} = React;

var Feedback = React.createClass({
  displayName: "FeedbackCard",
  getInitialState: function(){
    return {
      firstResponse: null,
      secondResponse: null,
      showThanks: false,
    };
  },
  handleEvent: function(event) {
    switch(event.name){
      case "FirstResponse":
        if (this.props.data["Options"][event.value] == null) {
          this.setState({firstResponse: event.value, showThanks: true});
          return {"option": event.value};
        }
        this.setState({firstResponse: event.value});
        return null;
        break;
      case "SecondResponse":
        this.setState({showThanks: true, secondResponse: event.value});
        return {"option": this.state.firstResponse, "detail": event.value};
        break;
    }
  },
  render: function() {
    var cardSubject = new Rx.Subject();
    if (this.props.observer) {
      cardSubject.subscribe(this.props.observer);
    }

    var firstOptions = Object.keys(this.props.data["Options"]);
    var responseSubject = new Rx.Subject();

    responseSubject.map(this.handleEvent).filter((value, idx, obs)=> value!=null)
      .subscribe(cardSubject);

    var firstOptionsView = firstOptions.map(function(value){
      return (<TouchableOpacity onPress={function(){
        responseSubject.onNext({name: "FirstResponse", value: value});
      }}>
      <Text style={styles.answerText}>{value}</Text>
      </TouchableOpacity>)
    });
    var secondOptionsView = [];
    if (this.state.firstResponse) {
      if (this.props.data["Options"][this.state.firstResponse]){
        secondOptionsView = this.props.data["Options"][this.state.firstResponse].map(function(value){
          return (<TouchableOpacity onPress={function(){
            responseSubject.onNext({name: "SecondResponse", value: value});
          }}>
          <Text style={styles.answerText}>{value}</Text>
          </TouchableOpacity>)
        });
      }
    }

    return (
      <View style={{flex:1, flexDirection: 'column'}}>
        {this.state.firstResponse ? null :
          (<View style={styles.questionContainer}>
            <Text style={styles.questionText}>{this.props.data["Question1"]}</Text>
            {firstOptionsView.map(view => view)}
          </View>) }
        {!this.state.secondResponse && secondOptionsView.length > 0 ?
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{this.props.data["Question2"]}</Text>
            {secondOptionsView.map(view => view)}
          </View>
            : null}
        {this.state.showThanks ?
          (<View style={styles.questionContainer}>
            <Text style={styles.thanksText}>Thank you for your response!</Text>
            </View>)
          : null}
        </View>
      );
    }
  });

  var styles = StyleSheet.create({
    questionContainer: {
      flex: 1,
      flexDirection: 'column',
      borderColor: '#33cc66',
      borderWidth: 1,
      paddingTop: 10, paddingBottom: 10,
      paddingLeft: 15, paddingRight: 15,
      borderRadius: 20,
      overflow: 'hidden',
      margin: 10,
    },
    questionText: {
      color: '#2a6033',
      fontSize: 16,
      textAlign:'center',
      paddingTop: 10, paddingBottom: 10,
      paddingLeft: 15, paddingRight: 15,
    },
    answerText:{
      textAlign: 'center',
      color:'#33cc66',
      paddingTop: 10,
      paddingBottom: 10,
      marginTop: 5, marginBottom: 5,
    },
    thanksText: {
      textAlign: 'center',
      color:'#33cc66',
      fontSize: 20,
    }
  });


  module.exports = Feedback;
