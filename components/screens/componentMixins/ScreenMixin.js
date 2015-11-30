'use strict';

var React = require('react-native');
var update = require('react-addons-update');
var LoadingView = require('../../LoadingView.js');
var {
  View,
  StyleSheet,
} = React;

//This mixin is to define common functions for Screen Components.

var ScreenMixin =  {
  screenCommonStyle:
    StyleSheet.create({
      container: {
        paddingTop: 50,
        flex: 1,
      }
    }),
  propTypes: {
    leftNavBarButton: React.PropTypes.object.isRequired,
    rightNavBarButton: React.PropTypes.object.isRequired,
    routes: React.PropTypes.object.isRequired,
    pushScreen: React.PropTypes.func.isRequired,
  },
  loadMore: function() {
    console.log("Load More");
    if (this.state.data["HasNext"]) {
      console.log("Fetch Data " + (this.state.data["Page"]+1));
      this.fetchData(this.state.data["Page"]+1);
    }
  },
  mutateCardStateData: function(data, id, key, value) {
    var cards = data["Cards"];
    for (var i=0, numCards = cards.length ; i<numCards; i++) {
      if (cards[i]["UUID"] == id) {
        return update(data, {"Cards": {[i]: {"Data": {[key]: {$set: value}}}}});
      }
    }
  },
  getCardDataState: function(id) {
    var cards = this.state.data["Cards"];
    for (var i=0, numCards = cards.length ; i<numCards; i++) {
      if (cards[i]["UUID"] == id) {
        return cards[i]["UUID"];
      }
    }
  },
  componentDidMount: function() {
    this.fetchData(this.props.enablePagination ? 1 : 0);
  },
  render: function() {
    if (this.state.data) {
      return this.renderScreen();
    }
    else {
      return (
        <View>
          <LoadingView />
        </View>
      );
    }
  },
  fetchData: function(page) {
    if (this.endPoint){
      this.props.setNetworkActivityIndicator(true);
      var url = this.props.api_domain + this.endPoint + "?" + this.props.params + "page=" + page;
      console.log(url);
      fetch(url)
        .then((response) => response.json())
          .then((responseData) => {
            console.log(responseData);
            this.props.setNetworkActivityIndicator(false);
            if (page <= 1) {
              this.setState({
                data: responseData
              });
            }
            else {
              console.log("Load More the Card List");
              var data = update(this.state.data, {"Cards": {$push : responseData["Cards"] }})
              data = update(data, {"HasNext": {$set : responseData["HasNext"] }})
              data = update(data, {"Page": {$set : responseData["HasNext"] }})

              this.setState({
                data: data
              });
            }
          })
        .catch((error) => {
          console.log(error);
          this.setState({data: {"Page":0, "HasNext": false,
                           "Cards": [{"UUID": "1", "Name": "Error", "Merged": ""}]}});
         })
        .done();
    }
  },
  getParamsToString: function(params) {
    var s = "";
    var keys = Object.keys(params);
    for (var i=0, length = keys.length ; i<length; i++)
      s += (keys[i] + "=" + params[keys[i]] + "&");
    return s;
  }
};

module.exports = ScreenMixin;
