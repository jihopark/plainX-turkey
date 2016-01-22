'use strict';

var React = require('react-native');

var PlainLog = require('../../PlainLog.js');
var P = new PlainLog("ConversationRoomScreen");

var {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  AppStateIOS,
  ActivityIndicatorIOS,
  Platform,
} = React;

var PlainListView = require('../PlainListView.js');
var BaseScreen = require('./BaseScreen.js');
var ParameterUtils = require('../utils/ParameterUtils.js');

var RestKit = require('react-native-rest-kit');
var update = require('react-addons-update');
var PlainActions = require('../../actions/PlainActions.js');
var SessionActions = require('../../actions/SessionActions.js');
var ActivityAndroid = require('react-native-activity-android');
var ProgressBar = require('ProgressBarAndroid');

var LoadingView = require('../LoadingView.js');


var MAX_WAITING_TIME = 60000;// in ms

class ConversationRoomScreen extends BaseScreen{
  constructor(props) {
    super(props);
    this.endPoint = "conversation";
    this.state = {
      data: null,
      keyboardSpace: 0,
      shouldPoll: false,
      appState: 'active', //AppStateIOS.currentState,
      msgInput: "",
      sending: false,
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.handleActivityPause = this.handleActivityPause.bind(this);
    this.handleActivityResume = this.handleActivityResume.bind(this);
    this.getConversationId = this.getConversationId.bind(this);
    this.getPollResults = this.getPollResults.bind(this);
    this.poll = this.poll.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
    this.onSend = this.onSend.bind(this);
    this.handleSendMsgRequest = this.handleSendMsgRequest.bind(this);
    this.onChangeMsgInput = this.onChangeMsgInput.bind(this);
    this.onPressHeader = this.onPressHeader.bind(this);
    this.renderScreen = this.renderScreen.bind(this);
    this.trackName = "ConversationRoom"
  }

  componentDidMount() {
    super.componentDidMount();
    this.isMount = true;
    P.log("componentDidMount", "Add AppState Listener");

    if (Platform.OS == 'ios')
      AppStateIOS.addEventListener('change', this.handleAppStateChange);
    else{
      ActivityAndroid.addEventListener('activityPause', this.handleActivityPause);
      ActivityAndroid.addEventListener('activityResume', this.handleActivityResume);
    }
  }

  componentWillUnmount() {
    super.componentDidMount();
    this.isMount = false;
    P.log("componentWillUnmount", "Remove AppState Listener");
    SessionActions.updateScreenName("");

    if (Platform.OS == 'ios')
      AppStateIOS.removeEventListener('change', this.handleAppStateChange);
    else{
      ActivityAndroid.removeEventListener('activityPause', this.handleActivityPause);
      ActivityAndroid.removeEventListener('activityResume', this.handleActivityResume);
    }
  }

  handleActivityPause(){
    P.log("handleActivityPause", "inactive");
    this.handleAppStateChange('pause');
  }

  handleActivityResume(){
    P.log("handleActivityResume", "active");
    this.handleAppStateChange('active');
  }

  handleAppStateChange(appState) {
    if (appState != 'active') {
      if (this.isMount) this.setState({shouldPoll: false, appState: appState});
    }
    else {
      if (this.isMount) this.setState({data: null, shouldPoll: true, appState: appState});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextState["data"]) {
      this.loadScreen();
      P.log("shouldComponentUpdate", "Start Polling again");
      this.poll();
      return true;
    }
    if (nextState["data"] && nextState["shouldPoll"] == false && nextState["appState"] == 'active') {
      if (this.isMount) this.setState({shouldPoll: true});
      P.log("shouldComponentUpdate", "Start Polling");
      this.loadScreenNameFromConversation();
      this.poll();
      return false;
    }
    return true;
  }

  loadScreenNameFromConversation(){
    var conversation = this.props.getConversation(this.getConversationId());
    if (!conversation || !conversation["Users"][0])
      return ;
    var screenName = conversation["Users"][0]["Email"];

    SessionActions.updateScreenName(screenName);
  }

  getConversationId() {
    return ParameterUtils.getStringToParams(this.props.params)["Id"] || ParameterUtils.getStringToParams(this.props.params)["id"];
  }

  getPollResults(params) {
    var wrappedPromise = {};
    var promise = new Promise(function (resolve, reject) {
      wrappedPromise.resolve = resolve;
      wrappedPromise.reject = reject;
    });
    wrappedPromise.then = promise.then.bind(promise);
    wrappedPromise.catch = promise.catch.bind(promise);
    wrappedPromise.promise = promise;// e.g. if you want to provide somewhere only promise, without .resolve/.reject/.catch methods

    fetch(params.url, {
      method: 'GET',
      headers: {
        'X-Session': this.props.loginToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(function (response) {
      wrappedPromise.resolve(response);
    }, function (error) {
      wrappedPromise.reject(error);
    })
    .catch(function (error) {
      wrappedPromise.catch(error);
    });

    var timeoutId = setTimeout(function () {
      // reject on timeout
      wrappedPromise.reject(new Error('Load timeout for resource: ' + params.url));
    }, MAX_WAITING_TIME);

    return wrappedPromise.promise
      .then(function(response) {
        clearTimeout(timeoutId);
        return response;
      })
      .then(function(response) {
        if (response.status === 200 || response.status === 0) {
          return Promise.resolve(response)
        } else {
          return Promise.reject(new Error(response))
        }
      })
      .then(function(response) {
        return response.json();
      });
  }

  poll() {
    var url = this.props.api_domain + "conversation/poll?id="
          + this.getConversationId();

    P.log("poll",url);

    this.getPollResults({
      url: url
    }).then(this.onMessage, this.onError);
  }

  onMessage(data) {// on success
    if (data && data["Cards"].length > 0 && this.state.shouldPoll) {
      P.log("onMessage", data);
      var stateData = this.state.data;

      var lastMsg = "";
      var created;

      for (var i=0; i< data["Cards"].length; i++) {
        this.state.data["Cards"].push(data["Cards"][i]);
        if (data["Cards"][i]["Name"] == "Message" && data["Cards"][i]["Data"]["Type"] == "message") {
          lastMsg = data["Cards"][i];
        }
      }
      PlainActions.updateCards(data["Cards"]);
      if (lastMsg) {
        PlainActions.updateConversation(this.getConversationId(), "LastMessage", lastMsg);
      }
      if (this.isMount) this.setState({data: this.state.data});
    }
    if (this.state.shouldPoll && this.isMount)
      this.poll();
  }

  onError(error) {// on reject

  }

  onSend() {
    var params = {"Id": this.getConversationId(),"Message": this.state.msgInput};
    P.log("onSend", params);

    const url = this.props.api_domain + "conversation/msg";
    var request = {
      method: 'post',
      headers: {
        'X-Session': this.props.loginToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    };
    this.props.setNetworkActivityIndicator(true);
    if (this.isMount) this.setState({sending:true});
    RestKit.send(url, request, this.handleSendMsgRequest);
  }

  handleSendMsgRequest(error, json){
    if (this.isMount) this.setState({sending:false});
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      P.log("handleSendMsgRequest/error", error);
      return ;
    }
    if (json) {
      P.log("handleSendMsgRequest/success", json);
      if (this.isMount) this.setState({msgInput: ""});
    }
  }

  onChangeMsgInput(value) {
    if (this.isMount) this.setState({msgInput: value});
  }

  onPressHeader() {
    var params = {"Id": this.state.data["Meta"]["OfferId"]};
    this.props.pushScreen({uri: this.props.routes.addRoute('offerDetail?'+ParameterUtils.getParamsToString(params))});
  }

  renderScreen() {
    var listView = this.createListView(true, true);

    var offer = this.props.getOffer(this.state.data ? this.state.data["Meta"]["OfferId"] : null);

    var header = ( offer ?
      (<TouchableOpacity
        style={{paddingTop: 15, paddingBottom: 15, backgroundColor: 'white'}}
        onPress={this.onPressHeader}>
          <Text style={styles.offerSummary}>
          {offer["Sell"]} {offer["AmountSell"]} to {offer["Buy"]} {offer["AmountBuy"]}
          <Text style={styles.moreInfo}>{"\ntap for more details"}</Text>
          </Text>
      </TouchableOpacity>) : null);

    var sendButton = this.state.sending ?
      <View style={{alignSelf:'center'}}>
        <LoadingView />
      </View>
    :
      (<TouchableOpacity onPress={this.onSend}>
        <Text style={styles.sendButton} >Send</Text>
      </TouchableOpacity>);
    return (
      <View style={[this.screenCommonStyle.container, styles.container]}>
        {header}
        {listView}
        <View style={[styles.sendContainer, {marginBottom: this.state.keyboardSpace}]} >
          <TextInput
            underlineColorAndroid={'transparent'}
            placeholder={"Type here"}
            style={styles.msgInput}
            onChangeText={this.onChangeMsgInput}
            value={this.state.msgInput} />
          {sendButton}
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  msgInput: {
    flex: 6,
    height: 35,
    alignSelf: 'center',
    marginLeft: 10,
  },
  sendButton: {
    flex:1,
    color:'#33cc66',
    fontWeight:'bold',
  },
  sendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#eee',
    height:45,
    paddingRight: 10,
  },
  offerSummary: {
    paddingTop: 3, paddingBottom: 3,
    textAlign: 'center',
    backgroundColor: 'white',
    fontSize: 18,
    color: '#33cc66',
  },
  moreInfo: {
    color:"#333",
    fontSize: 12,
  }
});

module.exports = ConversationRoomScreen;
