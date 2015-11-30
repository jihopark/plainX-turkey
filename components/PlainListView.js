'use strict';

var React = require('react-native');
var Rx = require('rx');

var CardRouter = require('./cards/CardRouter.js');

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
  renderCards: function(card) {
    var observer;
    //find if there is cardObserver to pass
    if (this.needsTobeObserved(card["Name"])) {
      observer = this.props.cardObservers[card["Name"]];
    //  console.log("Need To observe " + card["Name"] + " with " + observer);
    }
    //find which card to render
    var CardComponent = CardRouter.getComponent(card["Name"]);
    if (CardComponent == null)
      return null;
    return (
      <View style={styles.cardContainer}>
        <CardComponent
          cardCommonStyles={cardCommonStyles}
          id={card["UUID"]}
          observer={observer}
          data={card["Data"]}/>
      </View>
    );
  },
  render: function() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.cards)}
          renderRow={this.renderCards}
          onEndReached={this.props.onEndReached}
        />
      </View>
    );
  }

});

var styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 2,
    backgroundColor: 'white',
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    shadowRadius: 0.5,
    shadowColor: 'grey',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.8,
  },
  container: {
    flex:1,
  },
  backgroundContainer: {
    flex: 1,
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
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
});

module.exports = PlainListView;
