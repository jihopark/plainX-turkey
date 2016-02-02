'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Platform,
  Text,
} = React;

var PlainListView = require('../PlainListView.js');
var BaseScreen = require('./BaseScreen.js');

var ActionButton = require('../ActionButton.js');

class OfferListScreen extends BaseScreen{
  constructor(props) {
    super(props);
    this.endPoint = "offer/list";
    this.state.showActionButton = true;
    this.onPressActionButton = this.onPressActionButton.bind(this);
    this.trackName = "OfferList";
  }

  onPressActionButton() {
    this.props.pushScreen({uri: this.props.routes.addRoute('makeOffer?'+this.props.params)});
  }

  renderScreen() {
    var listView = this.createListViewPagination(true);

    var makeOfferButton = (<ActionButton
                            text={"MAKE OFFER"}
                            onPress={this.onPressActionButton}
                            enabled={true} />);
    return (
      <View style={this.screenCommonStyle.container}>
        {listView}
        {this.state.showActionButton ? makeOfferButton : null}
      </View>
    );
  }
}

module.exports = OfferListScreen;
