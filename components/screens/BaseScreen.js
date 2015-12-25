'use strict';

var React = require('react-native');
var update = require('react-addons-update');
var LoadingView = require('../LoadingView.js');
var ParameterUtils = require('../utils/ParameterUtils.js');
var RestKit = require('react-native-rest-kit');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var PlainLog = require('../../PlainLog.js');
var P = new PlainLog("BaseScreen");

var {
  View,
  AsyncStorage,
  StyleSheet,
  AlertIOS,
} = React;

class BaseScreen extends React.Component {
  constructor() {
    super();
    this.screenCommonStyle = StyleSheet.create({
      container: {
        paddingTop: 45,
        flex: 1,
      }
    });
    this.state = {
      data: null,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.mutateCardStateData = this.mutateCardStateData.bind(this);
    this.getCardDataState = this.getCardDataState.bind(this);
    this.loadScreen = this.loadScreen.bind(this);
    this.checkEndPointInParams = this.checkEndPointInParams.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onPressErrorDialog = this.onPressErrorDialog.bind(this);
    this.handleInitialRequest = this.handleInitialRequest.bind(this);
    this.handleAddMoreRequest = this.handleAddMoreRequest.bind(this);
    this.toggleSideMenu = this.toggleSideMenu.bind(this);

    this.offerCardonNext = this.offerCardonNext.bind(this);
    this.currencySelectCardOnNext = this.currencySelectCardOnNext.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.getRateFromCurrencyList = this.getRateFromCurrencyList.bind(this);
    this.currencyAmountSelectCardOnNext = this.currencyAmountSelectCardOnNext.bind(this);
    this.expirySelectCardonNext = this.expirySelectCardonNext.bind(this);
    this.locationSelectonNext = this.locationSelectonNext.bind(this);

    this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
  }

  loadMore() {
    if (this.state.data["HasNext"]) {
      console.log("Fetch Data " + (this.state.data["Page"]+1));
      this.fetchData(this.props.loginToken, (this.state.data["Page"]+1));
    }
  }

  mutateCardStateData(data, id, key, value) {
    var cards = data["Cards"];
    for (var i=0, numCards = cards.length ; i<numCards; i++) {
      if (cards[i]["UUID"] == id) {
        return update(data, {"Cards": {[i]: {"Data": {[key]: {$set: value}}}}});
      }
    }
  }

  getCardDataState(id) {
    var cards = this.state.data["Cards"];
    for (var i=0, numCards = cards.length ; i<numCards; i++) {
      if (cards[i]["UUID"] == id) {
        return cards[i]["UUID"];
      }
    }
  }

  componentDidMount() {
    this.loadScreen();
    this.props.updateMessageCount();
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

  componentWillUnmount() {
    this.props.updateMessageCount();
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardDidShowEvent, this.updateKeyboardSpace);
    KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillHideEvent, this.resetKeyboardSpace);
  }

  loadScreen() {
    var enablePagination = this.props.enablePagination;
    P.log("loadScreen", "Load Screen with Token " + this.props.loginToken);
    this.fetchData(this.props.loginToken, this.props.enablePagination ? 1 : 0);
  }

  render() {
    if (this.state.data) {
      return this.renderScreen();
    }
    else {
      return (<LoadingView />);
    }
  }

  checkEndPointInParams() {
    var params = ParameterUtils.getStringToParams(this.props.params);
    if (params["endPoint"])
      return params["endPoint"];
    return null;
  }

  fetchData(token, page) {
    var endPoint = this.endPoint || this.checkEndPointInParams();
    console.log(endPoint);
    if (endPoint){
      this.props.setNetworkActivityIndicator(true);
      var url = this.props.api_domain + endPoint + "?" + this.props.params + "&Page=" + page;
      console.log(url);

      var request = token ?
      {
        method: 'get',
        headers:{ 'X-Session': token, }
      } : { method: 'get' };

      RestKit.send(url, request, page <= 1 ? this.handleInitialRequest : this.handleAddMoreRequest);

    }
  }

  onPressErrorDialog() {
    this.props.popScreen();
  }

  handleInitialRequest(error, json){
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      console.log("ERRORabc");
      if (error.status == 500 || error.status == 400 || error.status == 404) {
        var text = JSON.parse(error.body)["Error"];
        console.log(this.props.routes.getDepth());
        if (this.props.routes.getDepth() > 1) {
          console.log("ALERT");
          AlertIOS.alert(
            'Error',
            text,
            [
              {text: 'OK', onPress: this.onPressErrorDialog},
            ]
          );
          return ;
        }
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
    // TODO: Flux Action
    this.setState({
      data: json,
    });
  }

  handleAddMoreRequest(error, json){
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

      // TODO: Flux Action
      this.setState({
        data: data
      });
    }
  }

  toggleSideMenu(event) {
    this.context.menuActions.toggle();
  }

  //Card Events
  offerCardonNext(event) {
    this.props.pushScreen({uri: this.props.routes.addRoute('offerDetail?'+ParameterUtils.getParamsToString({"Id": event["Id"]}))});
  }

  currencySelectCardOnNext(event) {
    // TODO: Flux Action
    switch (event["Target"]){
      case "Button":
        var params = {"Sell": event["Sell"], "Buy": event["Buy"]};
        this.props.pushScreen({uri: this.props.routes.addRoute('offerlist?'+ParameterUtils.getParamsToString(params))});
        break;
      case "Buy":
      case "Sell":
        this.setState({data: this.mutateCardStateData(this.state.data, event["id"], event["Target"], event[event["Target"]])});
        break;
    }
  }

  //CurrencyAmountSelect Card Events

  getRateFromCurrencyList(id) {
    var cards = this.state.data["Cards"];
    for (var i=0, numCards = cards.length ; i<numCards; i++) {
      if (cards[i]["UUID"] == id) {
        var sell = cards[i]["Data"]["Sell"];
        var buy = cards[i]["Data"]["Buy"];

        var rate = 1;
        var list = cards[i]["Data"]["CurrencyList"];
        for (var j=0, numCurr = list.length; j< numCurr; j++) {
          if (list[j]["Code"] == sell)
            rate *= list[j]["Rate"];
          else if (list[j]["Code"] == buy)
            rate /= list[j]["Rate"];
        }
        return rate;
      }
    }
  }

  clearAll(id) {
    var data = this.mutateCardStateData(this.state.data, id, "AmountSell", '');
    data = this.mutateCardStateData(data, id, "AmountBuy", '');
    data = this.mutateCardStateData(data, id, "SellRate", '');
    data = this.mutateCardStateData(data, id, "BuyRate", '');
    return data;
  }

  currencyAmountSelectCardOnNext(event) {
    // TODO: Flux Action

    function roundUpNumber(number) {
      return ""+(Math.round(number*100)/100);
    }

    var data;
    switch(event["Target"]){
      case "Next":
        console.log("NEXT");
        break;
      case "AmountSell":
        if (!event[event["Target"]]) {
          data = this.clearAll(event["id"]);
        }
        else {
          var rate = this.getRateFromCurrencyList(event["id"]);
          console.log("HEY");
          console.log(rate);
          data = this.mutateCardStateData(this.state.data, event["id"], "AmountSell", event[event["Target"]]);
          data = this.mutateCardStateData(data, event["id"], "AmountBuy", roundUpNumber(event[event["Target"]]/rate));
          data = this.mutateCardStateData(data, event["id"], "BuyRate", roundUpNumber(1/rate));
          data = this.mutateCardStateData(data, event["id"], "SellRate", "");
        }
        this.setState({data: data});
        break;
      case "AmountBuy":
        if (!event[event["Target"]]) {
          console.log("EMPTY");
          data = this.clearAll(event["id"]);
        }
        else {
          var rate = this.getRateFromCurrencyList(event["id"]);
          data = this.mutateCardStateData(this.state.data, event["id"], "AmountBuy", event[event["Target"]]);
          data = this.mutateCardStateData(data, event["id"], "AmountSell", roundUpNumber(event[event["Target"]]*rate));
          data = this.mutateCardStateData(data, event["id"], "SellRate", roundUpNumber(rate));
          data = this.mutateCardStateData(data, event["id"], "BuyRate", "");
        }
        this.setState({data: data});
        break;
      case "PressSell":
      case "PressBuy":
        //Remove numbers if change of currency.
        data = this.clearAll(event["id"]);
        this.setState({ data: data });
        break;
      case "Buy":
      case "Sell":
        this.setState({data: this.mutateCardStateData(this.state.data, event["id"], event["Target"], event[event["Target"]])});
    }
  }

  //ExpiryDateSelect
  expirySelectCardonNext(event) {
    // TODO: Flux Action
    this.setState({data:this.mutateCardStateData(this.state.data, event["id"], "Expiry", event["Expiry"])});
  }

  locationSelectonNext(event) {
    // TODO: Flux Action
    var update = require('react-addons-update');

    var cards = this.state.data["Cards"];
    for (var i=0, numCards = cards.length ; i<numCards; i++) {
      if (cards[i]["UUID"] == event["id"]) {
        this.setState({data: update(this.state.data, {"Cards": {[i]: {"Data": { "Locations": { [event["Location"]]: {"IsSelected": {$set: event["IsSelected"]}}}}}}})});
      }
    }
  }

  //KeyboardEvent

  updateKeyboardSpace(frames) {
    if (frames.end)
      this.setState({keyboardSpace: frames.end.height});
  }

  resetKeyboardSpace() {
    this.setState({keyboardSpace: 0});
  }
}

BaseScreen.propTypes = {
  leftNavBarButton: React.PropTypes.object.isRequired,
  rightNavBarButton: React.PropTypes.object.isRequired,
  routes: React.PropTypes.object.isRequired,
  pushScreen: React.PropTypes.func.isRequired,
};

BaseScreen.contextTypes = {
  menuActions: React.PropTypes.object.isRequired,
};

module.exports = BaseScreen;
