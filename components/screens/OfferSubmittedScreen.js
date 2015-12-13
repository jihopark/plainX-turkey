'use strict';

var React = require('react-native');

var {
  View,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var MenuButtonMixin = require('./componentMixins/MenuButtonMixin.js');

var ActionButton = require('../ActionButton.js');

var OfferSubmittedScreen = React.createClass({
  mixins: [ScreenMixin, MenuButtonMixin],
  displayName: "OfferSubmittedScreen",
  endPoint: "offer/submitted",
  getInitialState: function() {
    return {
      data: null,
    };
  },
  onPressActionButton: function(){
    this.props.replaceScreen({uri: 'main'});
  },
  renderScreen: function() {
    this.props.leftNavBarButtonSubject.subscribe(this.toggleSideMenu);

    return (
      <View style={this.screenCommonStyle.container}>
        <PlainListView
          cardObservers={{}}
          cards={this.state.data["Cards"]}/>
        <ActionButton
          text={"OKAY"}
          onPress={this.onPressActionButton}
          enabled={true} />
      </View>
    );
  }
});


module.exports = OfferSubmittedScreen;
