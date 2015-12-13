'use strict';

var React = require('react-native');

var {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  AppStateIOS,
  ActivityIndicatorIOS,
} = React;

var PlainListView = require('../PlainListView.js');
var ScreenMixin = require('./componentMixins/ScreenMixin.js');
var KeyboardSpaceMixin = require('./componentMixins/KeyboardSpaceMixin.js');

var RestKit = require('react-native-rest-kit');
var update = require('react-addons-update');

var MAX_WAITING_TIME = 60000;// in ms

var ConversationRoomScreen = React.createClass({
  mixins: [ScreenMixin,KeyboardSpaceMixin],
  displayName: "ConversationRoomScreen",
  endPoint: "conversation",
  getInitialState: function() {
    return {
      data: null,
      keyboardSpace: 0,
      shouldPoll: false,
      appState: AppStateIOS.currentState,
      msgInput: "",
      sending: false,
    };
  },
  componentDidMount: function() {
    console.log("Add Listener");
    AppStateIOS.addEventListener('change', this.handleAppStateChange);
  },
  componentWillUnmount: function() {
    console.log("Remove Listener");
    AppStateIOS.removeEventListener('change', this.handleAppStateChange);
  },
  handleAppStateChange: function(appState) {
    if (appState != 'active') {
      this.setState({shouldPoll: false, appState: appState});
    }
    else {
      this.setState({data: null, shouldPoll: true, appState: appState});
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if (!nextState["data"]) {
      this.loadScreen();
      console.log("START POLLING AGAIN");
      this.poll();
      return true;
    }
    if (nextState["data"] && nextState["shouldPoll"] == false && nextState["appState"] == 'active') {
      this.setState({shouldPoll: true});
      console.log("START POLLING");
      this.poll();
      return false;
    }
    return true;
  },
  getConversationId: function() {
    return this.getStringToParams(this.props.params)["Id"];
  },
  getJSON: function(params) {
    var wrappedPromise = {};
    var promise = new Promise(function (resolve, reject) {
      wrappedPromise.resolve = resolve;
      wrappedPromise.reject = reject;
    });
    wrappedPromise.then = promise.then.bind(promise);
    wrappedPromise.catch = promise.catch.bind(promise);
    wrappedPromise.promise = promise;// e.g. if you want to provide somewhere only promise, without .resolve/.reject/.catch methods

    console.log(params.url);
    fetch(params.url, {
      method: 'GET',
      headers: {
        'X-Session': this.loginToken,
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
  },
  poll: function() {
    var url = this.props.api_domain + "conversation/poll?id="
          + this.getConversationId();

    console.log("POLL");
    this.getJSON({
      url: url
    }).then(this.onMessage, this.onError);
  },
  onMessage: function(data) {// on success
    console.log('Receive!!');
    if (data && data["Cards"].length > 0 && this.state.shouldPoll) {
      console.log("here"+data["Cards"].length);
      var stateData = this.state.data;
      for (var i=0; i< data["Cards"].length; i++) {
        console.log("add"+data["Cards"][i]);
        this.state.data["Cards"].push(data["Cards"][i]);
      }
      this.setState({data: this.state.data});
    }
    if (this.state.shouldPoll && this.isMounted())
      this.poll();
  },
  onError: function(error) {// on reject
    console.log('onError!!!!!');
    console.log(error);
  //  if (error.state==undefined && this.state.shouldPoll && this.isMounted())
  //    this.poll();
  },
  onSend: function() {
    var params = {"Id": this.getConversationId(),"Message": this.state.msgInput};
    console.log(params);
    const url = this.props.api_domain + "conversation/msg";
    var request = {
      method: 'post',
      headers: {
        'X-Session': this.loginToken,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    };
    this.props.setNetworkActivityIndicator(true);
    this.setState({sending:true});
    RestKit.send(url, request, this.handleSendMsgRequest);
  },
  handleSendMsgRequest: function(error, json){
    this.setState({sending:false});
    this.props.setNetworkActivityIndicator(false);
    if (error) {
      console.log(error);
      return ;
    }
    if (json) {
      console.log("SUCCESSFULLY SENT");
      console.log(json);
      this.setState({msgInput: ""});
    }
  },
  onChangeMsgInput: function(value) {
    this.setState({msgInput: value});
  },
  onPressHeader: function() {
    var params = {"Id": this.state.data["Meta"]["Offer"]["Id"]};
    this.props.pushScreen({uri: this.props.routes.addRoute('offerDetail?'+this.getParamsToString(params))});
  },
  renderScreen: function() {
    var cardObservers = { };

    var listView = (<PlainListView
      hasBackgroundColor={true}
      invertList={true}
      cardObservers={cardObservers}
      cards={this.state.data["Cards"]}
      onEndReached={this.loadMore}
      />);
    var offer = this.state.data ? this.state.data["Meta"]["Offer"] : null;
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
    (<ActivityIndicatorIOS size='small' color="#33cc66" />)
    :
      (<TouchableOpacity onPress={this.onSend}>
        <Text style={styles.sendButton} >Send</Text>
      </TouchableOpacity>);
    return (
      <View style={[this.screenCommonStyle.container, styles.container]}>
        {header}
        {listView}
        <View style={[styles.sendContainer, {marginBottom: this.state.keyboardSpace}]} >
          <TextInput style={styles.msgInput} onChangeText={this.onChangeMsgInput} value={this.state.msgInput} />
          {sendButton}
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  msgInput: {
    flex: 6,
    height: 35,
    alignSelf: 'center',
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
