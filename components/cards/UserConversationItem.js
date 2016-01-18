'use strict';

var React = require('react-native');

var DateUtils = require('../utils/DateUtils.js');

var {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} = React;

var PlainActions = require('../../actions/PlainActions.js');


var UserConversationItem = React.createClass({
  displayName: "UserConversationItemCard",
  getOfferSummaryText: function(offer) {
    return (<View style={{flexDirection: 'row'}}>
        <Text style={styles.offerSummary}>
          {offer["Sell"]} {offer["AmountSell"]} to {offer["Buy"]} {offer["AmountBuy"]}
        </Text>
      </View>);
  },
  onPressCard: function(){
    this.props.handleClick(this.props.name, this.props.data);
    PlainActions.updateConversation(this.props.data["ConversationId"], "HasUnread", false);
  },
  render: function() {
    var conversation = this.props.getConversation(this.props.data["ConversationId"]);
    var offer = this.props.getOffer(conversation["OfferId"]);
    console.log(conversation);
    return (
      <TouchableOpacity style={styles.container}
        onPress={this.onPressCard}>
        <View style={{flexDirection:'row'}}>
          <Image source={require('../../assets/usericon_green.png')} style={styles.userIcon} />
          <View>
            {this.getOfferSummaryText(offer)}
            <Text style={[this.props.cardCommonStyles.title, styles.name, (conversation["HasUnread"] ? {fontWeight: 'bold'} : null)]}>
              {conversation["Users"][0] ? conversation["Users"][0]["Email"] : ""}
            </Text>
            <Text style={[this.props.cardCommonStyles.description, styles.lastMessage, (conversation["HasUnread"] ? {fontWeight: 'bold'} : null)]}>
              {conversation["LastMessage"] ? conversation["LastMessage"]["Text"] : ""}
            </Text>
          </View>
          <View style={{flex:1}}>
            <Text style={[styles.dateText, (conversation["HasUnread"] ? {fontWeight: 'bold'} : null)]}>
              {conversation["LastMessage"] ?
                DateUtils.getConversationTimestampFormat(conversation["LastMessage"]["Created"])
                : ""}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 100,
    backgroundColor: 'white',
    borderBottomColor: '#33cc66',
    borderBottomWidth: 0.5,
  },
  userIcon: {
    width: 40, height: 40,
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  name: {
    textAlign: 'left',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
  },
  lastMessage:{
    textAlign: 'left',
    fontSize: 14,
    marginBottom: 5,
  },
  offerSummary: {
    fontSize: 14,
    color: '#33cc66',
    fontWeight: 'bold',
  },
  dateText:{
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
});


module.exports = UserConversationItem;
