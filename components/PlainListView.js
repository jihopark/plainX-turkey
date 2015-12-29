'use strict';

var React = require('react-native');

var CardRouter = require('./cards/CardRouter.js');
var Divider = require('./Divider.js');

var PlainLog = require('../PlainLog.js');
var P = new PlainLog("PlainListView");


var {
  ListView,
  StyleSheet,
  View,
  PixelRatio,
  Image,
} = React;

var PlainListView = React.createClass({
  displayName: 'PlainListView',
  propType: {
    cards: React.PropTypes.array,
    cardObservers: React.PropTypes.array,
    loadMore: React.PropTypes.func
  },
  nameOfCardsTobeObserved: [],
  needsTobeObserved: function(cardName) {
    if (this.nameOfCardsTobeObserved.length == 0 && this.props.cardObservers
       && this.props.cardObservers.length!=0)
      this.nameOfCardsTobeObserved = Object.keys(this.props.cardObservers);

    for (var i=0, numCards = this.nameOfCardsTobeObserved.length; i<numCards; i++) {
      if (this.nameOfCardsTobeObserved[i] == cardName) return true;
    }
    return false;
  },
  getMarginStyle: function(merged) {
    switch(merged){
      case "":
        return styles.singleCard;
      case "Top":
        return styles.topCard;
      case "Mid":
        return styles.midCard;
      case "Bottom":
        return styles.bottomCard;
    }
  },
  validateCardData(card) {
    if (CardRouter.isOfferBaseCard(card["Name"])) {
      var offerId = card["Data"]["OfferId"];
      return (offerId || offerId == 0) && this.props.getOffer(offerId);
    }
    if (CardRouter.isConversationCard(card["Name"])) {
      //TODO: Implement Conversation Card validation;
    }
    return true;
  },
  renderCards: function(card) {
    card = this.props.getCard(card["UUID"]);

    //find which card to render
    var CardComponent = CardRouter.getComponent(card["Name"]);
    if (CardComponent == null)
      return null;
    var isConversationCard = CardRouter.isConversationCard(card["Name"]);

    return this.validateCardData(card) ? (
      <View style={isConversationCard ? null : [styles.cardContainer, this.getMarginStyle(card["Merged"])]}>
        <CardComponent
          cardCommonStyles={cardCommonStyles}
          id={card["UUID"]}
          key={card["UUID"]}
          name={card["Name"]}
          data={card["Data"]}
          handleClick={this.props.handleClick}
          getOffer={this.props.getOffer}
          getConversation={this.props.getConversation}
          user={this.props.user}
          />
        {card["Merged"] == "Top" || card["Merged"] == "Mid" ?
          <Divider margin={styles.mergedCardDivider} /> : null}
      </View>
    ): null;
  },
  render: function() {
    var listView;

    if (this.props.invertList) {
       var InvertibleScrollView = require('react-native-invertible-scroll-view');

       listView = (<ListView
         style={this.props.hasBackgroundColor ? styles.background: null}
         renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
         dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.cards.slice().reverse())}
         renderRow={this.renderCards}
         onEndReached={this.props.onEndReached}
       />);
    }
    else {
      listView = (<ListView
        style={this.props.hasBackgroundColor ? styles.background: null}
        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.cards)}
        renderRow={this.renderCards}
        onEndReached={this.props.onEndReached}
      />);
    }

    return (
      <View style={styles.listContainer}>
        {listView}
      </View>
    );
  }

});

var styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
  },
  singleCard: {
    marginTop: 2.5,
    marginBottom: 2.5,
    borderRadius: 2,
    padding: 10,
  },
  midCard:{
    paddingTop: 10,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  topCard:{
    paddingTop: 10,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    marginTop: 2.5,
    borderBottomColor: 'transparent',
  },
  bottomCard: {
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 2.5,
    borderTopColor: 'transparent',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  cardContainer: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
    shadowRadius: 0.3,
    shadowColor: 'grey',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.8,
  },
  listContainer: {
    flex:1,
  },
  mergedCardDivider: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
  },
});

var cardCommonStyles = StyleSheet.create({
  titles: {
    color: '#333333',
    fontSize: 40/2,
    textAlign: 'center',
    //font: 'SF UI Text Regular'
  },
  description: {
    color: '#333333',
    fontSize: 36/2,
    textAlign: 'center',
  },
  headings: {
    color: '#333333',
    fontSize: 36/2,
    fontWeight: 'bold',
    textAlign: 'center',
    //font: 'SF UI Text Semibold'
  },
  currency: {
    color: '#333333',
    fontSize: 40/2,
    marginRight: 10,
    //font: 'SF UI Text Regular'
  },
  finePrint: {
    color: '#333333',
    fontSize: 30/2,
  },
  inputAmountText:{
    fontSize: 60/2,
    textAlign: 'center',
    color: '#33cc66',
    //font: 'SF UI Text Regular'
  },
  urgentText: {
    fontSize: 30/2,
    color: '#006633',
    //font: 'SF UI Text Bold'
  },
  triangleIconStyle: {
    width: 11,
    height: 5.5,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  offerTitle:{
    fontSize: 15,
    textAlign: 'center',
  },
  offerOptions:{
    fontSize: 18,
    fontWeight: 'bold',
    color: "#333",
  },
});

module.exports = PlainListView;
