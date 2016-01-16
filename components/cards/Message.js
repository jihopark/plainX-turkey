'use strict';

var React = require('react-native');
var Rx = require('rx')

var DateUtils = require('../utils/DateUtils.js');

var {
  Text,
  View,
  StyleSheet,
} = React;

var Message = React.createClass({
  displayName: "MessageCard",
  render: function() {
    var message;
    switch (this.props.data["Type"]) {
      case 'message':
        var isSelf = this.props.data["IsSelf"];
        message = (<View style={[{flexDirection:'column'}, (isSelf ? styles.rightContainer : styles.leftContainer)]}>
	    <View style={[
		styles.messageContainer,
		(isSelf ? styles.selfText : styles.otherText)]
	    }>
            <Text style={styles.messageText}>
               {this.props.data["Text"]}
            </Text>
	  </View>
          <Text style={[styles.dateText, (isSelf ? styles.rightContainer : styles.leftContainer)]}>
            {DateUtils.getMessageTimestampFormat(this.props.data["Created"])}
          </Text>
        </View>);
        break;
      case 'note':
        message = (<View style={{flexDirection:'column', margin: 10}}>
          <View style={styles.noteContainer}>
	    <Text style={[styles.messageText, styles.noteText]}>
              {this.props.data["Text"]}
            </Text>
	  </View>
          <Text style={[styles.dateText, styles.noteSubText]}>
            {"Only shown to you"}
          </Text>
        </View>);
        break;
    }

    return (
      <View style={styles.container}>
        {message}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 5,
    marginBottom: 5,
  },
  rightContainer:{
    alignItems:'flex-end',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  leftContainer: {
    alignItems:'flex-start',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  centerContainer: {
    alignSelf: 'center',
  },
  selfText: {
    backgroundColor:'#33cc66',
  },
  otherText: {
    backgroundColor:'#2a6033',
  },
  messageContainer: {
    paddingTop: 10, paddingBottom: 10,
    paddingLeft: 15, paddingRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 5,
    marginRight: 5,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  noteContainer: {
    paddingTop: 10, paddingBottom: 10,
    paddingLeft: 15, paddingRight: 15,
    overflow: 'hidden',
    marginLeft: 5,
    marginRight: 5,
    borderColor: '#33cc66',
    borderWidth: 1,
    borderRadius: 20,
  },
  noteText: {
    textAlign:'center',
    color: '#33cc66',
  },
  noteSubText: {
    marginTop: 5, marginBottom: 5,
    textAlign:'right'
  },
  dateText: {
    color: '#333',
    fontSize: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  userIcon:{
    width: 50,
    height: 50,
    alignSelf: 'center'
  },
});


module.exports = Message;
