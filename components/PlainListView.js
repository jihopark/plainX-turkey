'use strict';

var React = require('react-native');
var Rx = require('rx');

var CardRouter = require('./cards/CardRouter.js');

var {
  ListView,
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
      <CardComponent
        id={card["UUID"]}
        observer={observer}
        data={card["Data"]}/>
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

module.exports = PlainListView;
