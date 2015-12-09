'use strict';

var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  AsyncStorage,
} = React;

var Routes = require('../screens/Routes.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var CurrencySelectCardMixin = require('./cardMixins/CurrencySelectCardMixin.js');
var OfferCardMixin = require('./cardMixins/OfferCardMixin.js');

var TutorialPager = require('../TutorialPager.js');
var PlainListView = require('../PlainListView.js');

var MainScreen = React.createClass({
  mixins: [ScreenMixin, CurrencySelectCardMixin, OfferCardMixin],
  displayName: "MainScreen",
  endPoint: "main",
  getInitialState: function() {
    return {
      data: null,
      showTutorial: false,
    }
  },
  async checkIfFirstExec(){
    try {
      var keys = await AsyncStorage.getAllKeys();
      if (keys.indexOf("FIRST_LOGIN") == -1) {
        await AsyncStorage.setItem("FIRST_LOGIN", "false");
        return true;
      }
      else
        return false;
    } catch (error) {
      console.log("Error Retreving checkIfFirstLogin");
      return false;
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (nextState["data"] && nextState["showTutorial"] == false) {
      this.checkIfFirstExec().then((isFirstExec) => {
        if (isFirstExec) {
          this.setState({showTutorial: true});
        }
      }).done();
    }
    return true;
  },
  pushConversationsScreen: function(event) {
    this.props.pushScreen({uri: this.props.routes.addRoute('conversations')});
  },
  toggleSideMenu: function(event) {
    console.log("TOGGLE FROM MaIN");
    this.context.menuActions.toggle();
  },
  contextTypes: {
    menuActions: React.PropTypes.object.isRequired,
  },
  closeTutorial: function() {
    this.setState({showTutorial: false});
  },
  renderScreen: function() {
    this.props.leftNavBarButtonSubject.subscribe(this.toggleSideMenu);
    this.props.rightNavBarButtonSubject.subscribe(this.pushConversationsScreen);

    var cardObservers = { }
    cardObservers["CurrencySelect"] = this.currencySelectCardOnNext;
    cardObservers["Offer"] = this.offerCardonNext;

    var listView = (
      <PlainListView
        cardObservers={cardObservers}
        cards={this.state.data["Cards"]}/>);

    return (
      <View style={this.screenCommonStyle.container}>
        {(this.state.data["Meta"] && this.state.data["Meta"]["tutorialUrls"] && this.state.showTutorial) ?
          (<TutorialPager
            closeTutorial={this.closeTutorial}
            urls={this.state.data["Meta"]["tutorialUrls"]} />) :
          listView}
      </View>
    );
  }
});

module.exports = MainScreen;
