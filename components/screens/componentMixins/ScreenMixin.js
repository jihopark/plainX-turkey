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
    if (this.state.data["HasNext"]) {
      console.log("Fetch Data " + (this.state.data["Page"]+1));
      this.fetchData(this.loginToken, (this.state.data["Page"]+1));
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
  loginToken: null,
  async logOut(){
    if (this.loginToken) return this.loginToken;
    try {
      await AsyncStorage.removeItem("SESSION");
      console.log("User Is Logged Out");
    } catch (error) {
      console.log("Error Logging Out");
    }
  },
  async loadTokenIfAny(){
    if (this.loginToken) this.loginToken = null;
    try {
      var value = await AsyncStorage.getItem("SESSION");
      console.log("User Is Logged In");
      this.loginToken = value;
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
      var url = this.props.api_domain + this.endPoint + "?" + this.props.params + "Page=" + page;
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
      console.log(error.status);
      if (error.status == 500 || error.status == 400 || error.status == 404) {
        console.log(error);
        var text = JSON.parse(error.body)["Error"];
        this.setState({data: {"Page":0, "HasNext": false,
                         "Cards": [{"UUID": "1", "Name": "Error", "Merged": "", "Data": {"Text": text}}]}});
      }
      else if (error.status == 401){
        this.props.replaceScreen({uri:this.props.routes.addRoute('login')});
      }
      return ;
    }
    if (json == undefined)
      return ;

    // if normal response 200
    console.log(json);
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
    if (this.state.data != null && this.state.data["Page"] < json["Page"]) {
      console.log(json);
      var data = update(this.state.data, {"Cards": {$push : json["Cards"] }})
      data = update(data, {"HasNext": {$set : json["HasNext"] }})
      data = update(data, {"Page": {$set : json["Page"] }})

      this.setState({
        data: data
      });
    }
  },
  getParamsToString: function(params) {
    var s = "";
    var keys = Object.keys(params);
    for (var i=0, length = keys.length ; i<length; i++)
      s += (keys[i] + "=" + params[keys[i]] + "&");
    return s;
  },
  getStringToParams: function(queryString) {
    var params = {};
    var paramStrings = queryString.split("&");
    for (var i=0; i<paramStrings.length-1; i++) {
      var split = paramStrings[i].split("=");
      params[split[0]] = split[1];
    }
    return params;
  },
};

module.exports = ScreenMixin;
