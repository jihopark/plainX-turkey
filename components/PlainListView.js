'use strict';

var React = require('react-native');
var Rx = require('rx');

var CardRouter = require('./cards/CardRouter.js');

var {
  ListView,
  StyleSheet,
  View,
  PixelRatio,
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
  onEndReached: function() {

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
    return (
      <View style={styles.cardContainer}>
        <CardComponent
          id={card["UUID"]}
          observer={observer}
          data={card["Data"]}/>
      </View>
    );
  },
  render: function() {
    return (
      <ListView
        dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.props.cards)}
        renderRow={this.renderCards}
        onEndReached={this.onEndReached}
      />
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
});

module.exports = PlainListView;
