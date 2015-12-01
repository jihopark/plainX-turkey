'use strict';

var React = require('react-native');
var update = require('react-addons-update');
var LoadingView = require('../../LoadingView.js');
var RestKit = require('react-native-rest-kit');

var {
  View,
  AsyncStorage,
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
  async loadTokenIfAny(){
    try {
      var value = await AsyncStorage.getItem("SESSION");
      console.log("User Is Logged In");
      return value;
    } catch (error) {
      console.log("Error Retreving LoginToken");
      return null;
    }
  },
  componentDidMount: function() {
    var enablePagination = this.props.enablePagination;
    this.loadTokenIfAny().then((value) => {
      console.log("PAGINATION");
      console.log(this.props.enablePagination);
      this.fetchData(value, this.props.enablePagination ? 1 : 0);
    }).done();
  },
  render: function() {
    if (this.state.data) {
      return this.renderScreen();
    }
    else {
      return (<LoadingView />);
    }
  },
  fetchData: function(token, page) {
    if (this.endPoint){
      this.props.setNetworkActivityIndicator(true);
      var url = this.props.api_domain + this.endPoint + "?" + this.props.params + "page=" + page;
      console.log(url);

      var request = token ?
      {
        method: 'get',
        headers:{ 'X-Session': token, }
      } : { method: 'get' };

      RestKit.send(url, request, page <= 1 ? this.handleInitialRequest : this.handleAddMoreRequest);

    }
  },
  handleInitialRequest: function(error, json){
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      console.log("ERROR");
      console.log(error);
      if (error.status == 500 || error.status == 404) {
        this.setState({data: {"Page":0, "HasNext": false,
                         "Cards": [{"UUID": "1", "Name": "Error", "Merged": ""}]}});
      }
      else if (error.status == 401){
        this.props.replaceScreen({uri:this.props.routes.addRoute('login')});
      }
      return ;
    }
    if (json == undefined)
      return ;

    // if normal response 200

    this.setState({
      data: json,
    });
  },
  handleAddMoreRequest: function(error, json){
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      console.log(error);
      if (error.status == 500) {
      //  this.setState({data: {"Page":0, "HasNext": false,
      //                   "Cards": [{"UUID": "1", "Name": "Error", "Merged": ""}]}});
      }
      else if (error.status == 400){

      }
      return ;
    }
    // if normal response 200
    if (json == undefined)
      return ;
    console.log(json);
    console.log("Load More the Card List");
    var data = update(this.state.data, {"Cards": {$push : json["Cards"] }})
    data = update(data, {"HasNext": {$set : json["HasNext"] }})
    data = update(data, {"Page": {$set : json["HasNext"] }})

    this.setState({
      data: data
    });
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
