'use strict';

var React = require('react-native');

var {
  View,
  Text,
  WebView,
} = React;

var BaseScreen = require('./BaseScreen.js');

var ParameterUtils = require('../utils/ParameterUtils.js');

var PlainLog = require('../../PlainLog.js');
var P = new PlainLog("WebViewScreen");
var SessionActions = require('../../actions/SessionActions.js');

const TITLE = {"faq": "FAQ", "terms": "Terms & Conditions", "" : "About Us"};

class WebViewScreen extends BaseScreen{
  constructor(props){
    super(props);
    this.renderScreen = this.renderScreen.bind(this);
    this.trackName = "WebView";
  }

  componentDidMount() {
    super.componentDidMount();
    SessionActions.updateScreenName(TITLE[ParameterUtils.getStringToParams(this.props.params)["code"]]);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    SessionActions.updateScreenName("");
  }

  renderScreen() {
    var code = ParameterUtils.getStringToParams(this.props.params)["code"];
    var url = "http://ihome.ust.hk/~lhoang/plainexchangeteaser/" + code;

    P.log("renderScreen","rendering webview " + url);

    return (
      <View style={this.screenCommonStyle.container}>
        <WebView
          url={url}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>
    );
  }
}


module.exports = WebViewScreen;
