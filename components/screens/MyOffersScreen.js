'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
} = React;

var BaseScreen = require('./BaseScreen.js');
var ActionButton = require('../ActionButton.js');

class MyOffersScreen extends BaseScreen{
  constructor(props){
    super(props);
    this.endPoint = "user/offers";
    this.onPressMakeOffer = this.onPressMakeOffer.bind(this);
    this.trackName = "MyOffers"
  }

  onPressMakeOffer() {
    this.props.pushScreen({uri: this.props.routes.addRoute('makeOffer?')});
  }

  renderScreen() {
    var listView = this.createListViewPagination(true);

    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
        <ActionButton
          text={"ADD NEW OFFER"}
          onPress={this.onPressMakeOffer}
          enabled={true} />
      </View>
    );
  }
}

module.exports = MyOffersScreen;
