'use strict';

var React = require('react-native');

var {
  View,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');

var OfferSubmittedScreen = React.createClass({
  mixins: [ScreenMixin],
  displayName: "OfferSubmittedScreen",
  getInitialState: function() {
    return {
      data: {
        "HasNext":false,
        "Page": 0,
        "Cards": [
          {
            "UUID": "123",
            "Name": "IconExplanation",
            "Data":{
              "Text": "Offer Submitted!"
            }
          },
          {
            "UUID": "124",
            "Name": "Header",
            "Data":{
              "TitleText": "What happens next?"
            },
            "Merged": "Top",
          },
          {
            "UUID": "124",
            "Name": "Explanation",
            "Data":{
              "Text": "Your offer will be displayed whenever someone is looking to exchange the opposite. You will get a message if they want to exchange with you!"
            },
            "Merged": "Bottom",
          },
        ]
      },
    };
  },
  renderScreen: function() {
    return (
      <View style={this.screenCommonStyle.container}>
        <PlainListView
          cardObservers={{}}
          cards={this.state.data["Cards"]}/>
      </View>
    );
  }
});


module.exports = OfferSubmittedScreen;
