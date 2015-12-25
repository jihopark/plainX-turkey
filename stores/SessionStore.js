var alt = require('../alt');
var SessionActions = require('../actions/SessionActions');
var PlainLog = require('../PlainLog.js');
var P = new PlainLog("SessionStore");

class SessionStore {
  constructor() {
    this.loginToken = null;
    this.deviceToken = null;
    this.messageCount = 0;
    this.user = null
    this.uri = 'main';

    this.bindActions(SessionActions);
  }

  onUpdateLoginToken(token) {
    this.loginToken = token;
  }

  onLogOut() {
    this.loginToken = "";
    this.user = {};
  }

  onUpdateUri(uri) {
    this.uri = uri;
  }

  onUpdateMessageCount(count) {
    this.messageCount = count;
  }

  onUpdateUser(user){
    this.user = user;
  }

  onUpdateDeviceToken(token) {
    this.deviceToken = token;
  }


}

module.exports = alt.createStore(SessionStore, 'SessionStore');
