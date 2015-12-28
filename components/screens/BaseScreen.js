'use strict';

var React = require('react-native');
var update = require('react-addons-update');
var LoadingView = require('../LoadingView.js');
var ParameterUtils = require('../utils/ParameterUtils.js');
var RestKit = require('react-native-rest-kit');
var KeyboardEvents = require('react-native-keyboardevents');
var KeyboardEventEmitter = KeyboardEvents.Emitter;

var PlainListView = require('../PlainListView.js');

var SessionActions = require('../../actions/SessionActions');
var PlainActions = require('../../actions/PlainActions');

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

    this.pushScreenDataToStore = this.pushScreenDataToStore.bind(this);
    this.createListView = this.createListView.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.loadScreen = this.loadScreen.bind(this);
    this.checkEndPointInParams = this.checkEndPointInParams.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onPressErrorDialog = this.onPressErrorDialog.bind(this);
    this.handleInitialRequest = this.handleInitialRequest.bind(this);
    this.handleAddMoreRequest = this.handleAddMoreRequest.bind(this);
    this.toggleSideMenu = this.toggleSideMenu.bind(this);

    this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
    this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
  }

  loadMore() {
    if (this.state.data["HasNext"]) {
      console.log("Fetch Data " + (this.state.data["Page"]+1));
      this.fetchData(this.props.loginToken, (this.state.data["Page"]+1));
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
    if (this.state.data){
      P.log("componentWillUnmount", "Remove Cards");
      PlainActions.removeCards(this.state.data["Cards"]);
    }
  }

  createListView(){
    createListView(false);
  }

  createListView(pagination){
    return (<PlainListView
      getCard={this.props.getCard}
      getOffer={this.props.getOffer}
      getConversation={this.props.getConversation}
      handleClick={this.handleClick}
      onEndReached={pagination ? this.loadMore : null}
      cards={this.state.data["Cards"]}/>);
  }

  handleClick(cardName, data){
    P.log("handleClick", cardName);
    switch(cardName){
      case "Offer":
        this.props.pushScreen({uri: this.props.routes.addRoute('offerDetail?'+ParameterUtils.getParamsToString({"Id": data["OfferId"]}))});
        break;
      case "CurrencySelect":
        this.props.pushScreen({uri: this.props.routes.addRoute('offerlist?'+ParameterUtils.getParamsToString(data))});
        break;
    }
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
      P.log("handleInitialRequest", "Error occured");
      if (error.status == 500 || error.status == 400 || error.status == 404) {
        var text = JSON.parse(error.body)["Error"];
        P.log("handleInitialRequest", "Route Depth:"+this.props.routes.getDepth());
        if (this.props.routes.getDepth() > 1) {
          P.log("handleInitialRequest", "Alert Called");
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
        if (this.props.loginToken)
          SessionActions.logOut(this.props.loginToken, this.props.deviceToken);
        this.props.replaceScreen({uri:this.props.routes.addRoute('login')});
      }
      return ;
    }
    if (json){
      P.log("handleInitialRequest", "200");
      this.pushScreenDataToStore(json);
      this.setState({data: json});
    }
  }

  handleAddMoreRequest(error, json){
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      console.log(error);
      if (error.status == 500) {
      //  this.setState({data: {"Page":0, "HasNext": false,
      //                   "Cards": [{"UUID": "1", "Name": "Error", "Merged": ""}]}});
      }
      else if (error.status == 401){
        if (this.props.loginToken)
          SessionActions.logOut(this.props.loginToken, this.props.deviceToken);
          this.props.replaceScreen({uri:this.props.routes.addRoute('login')});
      }
      return ;
    }
    // if normal response 200
    if (json == undefined)
      return ;
    if (this.state.data != null && this.state.data["Page"] < json["Page"]) {
      var data = update(this.state.data, {"Cards": {$push : json["Cards"] }})
      data = update(data, {"HasNext": {$set : json["HasNext"] }})
      data = update(data, {"Page": {$set : json["Page"] }})

      this.pushScreenDataToStore(json);
      this.setState({
        data: data
      });
    }
  }

  pushScreenDataToStore(data){
    PlainActions.updateScreenData(
      data["Offers"], data["Conversations"], data["Cards"]);
  }

  toggleSideMenu(event) {
    this.context.menuActions.toggle();
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
