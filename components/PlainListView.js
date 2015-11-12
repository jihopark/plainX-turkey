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
    if (this.nameOfCardsTobeObserved.length == 0 && this.props.cardObservers.length!=0)
      this.nameOfCardsTobeObserved = Object.keys(this.props.cardObservers);

    for (var i=0; i<this.nameOfCardsTobeObserved.length; i++) {
      if (this.nameOfCardsTobeObserved[i] == cardName) return true;
    }
    return false;
  },
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(this.props.cards), //cardData should be in state of the Screen
    };
  },
  onEndReached: function() {

  },
  renderCards: function(card) {
    var observer;
    //find if there is cardObserver to pass
    if (this.needsTobeObserved(card.name)) {
      observer = this.props.cardObservers[card.name];
      console.log("Need To observe " + card.name + " with " + observer);
    }
    //find which card to render
    var CardComponent = CardRouter.getComponent(card.name);
    return (
      <CardComponent
        observer={observer}
        data={card.data}/>
    );
  },
  render: function() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderCards}
        onEndReached={this.onEndReached}
      />
    );
  }

});

module.exports = PlainListView;
