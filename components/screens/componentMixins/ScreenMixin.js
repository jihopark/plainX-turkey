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
        paddingTop: 45,
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
    if (this.loginToken) this.loginToken = null;
    try {
      await AsyncStorage.removeItem("SESSION");
      console.log("User Is Logged Out");
    } catch (error) {
      console.log("Error Logging Out");
    }
  },
  async loadTokenIfAny(){
    if (this.loginToken) return this.loginToken;
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
    this.loadScreen();
  },
  componentWillUnmount: function() {
    this.props.updateInfo(this.loginToken);
  },
  loadScreen: function() {
    var enablePagination = this.props.enablePagination;
    this.loadTokenIfAny().then((value) => {
      this.props.updateInfo(value);
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
  checkEndPointInParams: function() {
    var params = this.getStringToParams(this.props.params);
    console.log(this.props.params);
    if (params["endPoint"])
      return params["endPoint"];
    return null;
  },
  fetchData: function(token, page) {
    var endPoint = this.endPoint || this.checkEndPointInParams();
    if (endPoint){
      this.props.setNetworkActivityIndicator(true);
      var url = this.props.api_domain + endPoint + "?" + this.props.params + "Page=" + page;
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
  isNumeric: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  parseNumber: function(s) {
    return s.indexOf('.') == -1 ? parseInt(s) : parseFloat(s);
  },
  getParamsToString: function(params) {
    var s = "";
    var keys = Object.keys(params);
    for (var i=0, length = keys.length ; i<length; i++) {
      if (this.isNumeric(params[keys[i]])){
        s += (keys[i] + "=" + params[keys[i]] + "&");
      }
      else {
        s += (keys[i] + "=" + params[keys[i]] + "&");
      }
    }
    return s;
  },
  getStringToParams: function(queryString) {
    var params = {};
    var paramStrings = queryString.split("&");
    for (var i=0; i<paramStrings.length-1; i++) {
      var split = paramStrings[i].split("=");
      params[split[0]] = this.isNumeric(split[1]) ? this.parseNumber(split[1]+"") : split[1];
    }
    return params;
  },
};

module.exports = ScreenMixin;
