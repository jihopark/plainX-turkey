'use strict';

var React = require('react-native');

var {
  View,
} = React;

var PlainListView = require('../PlainListView.js');
var BaseScreen = require('./BaseScreen.js');
var MenuButtonMixin = require('./componentMixins/MenuButtonMixin.js');

var ActionButton = require('../ActionButton.js');

class OfferSubmittedScreen extends BaseScreen{
  constructor(props) {
    super(props);
    this.endPoint = "offer/submitted";
    this.onPressActionButton = this.onPressActionButton.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
  }

  onPressActionButton(){
    this.props.replaceScreen({uri: 'main'});
  }

  renderScreen() {
    this.props.leftNavBarButtonSubject.subscribe(this.toggleSideMenu);
    var listView = this.createListView(cardObservers, false);
    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
        <ActionButton
          text={"OKAY"}
          onPress={this.onPressActionButton}
          enabled={true} />
      </View>
    );
  }
}


module.exports = OfferSubmittedScreen;
