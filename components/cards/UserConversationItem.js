'use strict';

var React = require('react-native');
var Rx = require('rx')

var DateMixin = require('../screens/componentMixins/DateMixin.js');

var {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} = React;

var UserConversationItem = React.createClass({
  displayName: "UserConversationItemCard",
  mixins: [DateMixin],
  getOfferSummaryText: function(offer) {
    return (<View style={{flexDirection: 'row'}}>
        <Text style={styles.offerSummary}>
          {offer["Sell"]} {offer["AmountSell"]} to {offer["Buy"]} {offer["AmountBuy"]}
        </Text>
      </View>);
  },
  render: function() {
    var subject = new Rx.Subject();
    if (this.props.observer) {
      subject.subscribe(this.props.observer);
    }
    return (
      <TouchableOpacity style={styles.container}
        onPress={() => {
            var param = {"Id": this.props.data["Id"]};
            if (this.props.data["Users"][0]["Email"])
              param["ScreenName"] = this.props.data["Users"][0]["Email"];
            subject.onNext(param);
          }
        }>
        <View style={{flexDirection:'row'}}>
          <Image source={require('../../assets/usericon_green.png')} style={styles.userIcon} />
          <View>
            {this.getOfferSummaryText(this.props.data["Offer"])}
            <Text style={[this.props.cardCommonStyles.title, styles.name, (this.props.data["HasUnread"] ? {fontWeight: 'bold'} : null)]}>
              {this.props.data["Users"][0]["Email"]}
            </Text>
            <Text style={[this.props.cardCommonStyles.description, styles.lastMessage, (this.props.data["HasUnread"] ? {fontWeight: 'bold'} : null)]}>
              {this.props.data["LastMessage"]["Text"]}
            </Text>
          </View>
          <View style={{flex:1}}>
            <Text style={[styles.dateText, (this.props.data["HasUnread"] ? {fontWeight: 'bold'} : null)]}>{this.getConversationTimestampFormat(this.props.data["LastMessage"]["Created"])}</Text>
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
