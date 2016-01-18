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
    };
  },
  onMapFirstOptions: function(value){
    var _onPress = () => {
      this.setState({firstResponse: value})
      if (this.props.data["Options"][this.state.firstResponse] == null)
        this.finishFeedback(this.state.firstResponse, null);
    };
    return (<TouchableOpacity onPress={_onPress}>
      <Text key={value} style={styles.answerText}>{value}</Text>
    </TouchableOpacity>);
  },
  onMapSecondOptions: function(value){
    var _onPress = () => {
      this.setState({secondResponse: value, showThanks: true});
      this.finishFeedback(this.state.firstResponse, value);
    };
    return (<TouchableOpacity onPress={_onPress}>
      <Text key={value} style={styles.answerText}>{value}</Text>
    </TouchableOpacity>)
  },
  finishFeedback: function(firstResponse, secondResponse) {
    this.props.handleClick(this.props.name, {"option": firstResponse, "detail": secondResponse});
  },
  render: function() {
    var firstOptions = Object.keys(this.props.data["Options"]);
    var firstOptionsView = firstOptions.map(this.onMapFirstOptions);

    var secondOptionsView = [];

    if (this.state.firstResponse) {
      if (this.props.data["Options"][this.state.firstResponse]){
        secondOptionsView = this.props.data["Options"][this.state.firstResponse].map(this.onMapSecondOptions);
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
        {this.state.firstResponse && (this.state.secondResponse || secondOptionsView.length == 0) ?
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
