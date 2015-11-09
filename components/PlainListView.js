'use strict';

var React = require('react-native');
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
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows(this.props.cards), //cardData should be in state of the Screen
    };
  },
  _onEndReached: function() {

  },
  _renderCards: function(card) {
    //find which card to render
    var CardComponent = CardRouter.getComponent(card.name);
    return (
      <CardComponent />
    );
    //find if there is cardObserver to pass
  },
  render: function() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderCards}
        onEndReached={this._onEndReached}
      />
    );
  }

});

module.exports = PlainListView;
