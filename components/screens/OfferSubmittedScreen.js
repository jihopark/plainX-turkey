'use strict';

var React = require('react-native');

var {
  View,
} = React;

var PlainListView = require('../PlainListView.js');
var BaseScreen = require('./BaseScreen.js');

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
    var listView = this.createListView(false);
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
