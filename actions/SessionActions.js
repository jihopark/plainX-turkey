var alt = require('../alt');

var React = require('react-native');
var {
  AsyncStorage,
} = React;


var RestKit = require('react-native-rest-kit');
var API_DOMAIN = require('../constants/BuildConstants').API_DOMAIN;
var PlainLog = require('../PlainLog.js');
var P = new PlainLog("SessionActions");


async function removeLoginTokenFromAsyncStorage(){
  try {
    await AsyncStorage.removeItem("SESSION");
    P.log("removeLoginTokenFromAsyncStorage", "Removed!");
    return true;
  } catch (error) {
    P.log("Error Logging Out " + error);
    return false;
  }
}

function postLogOutToServer(loginToken, deviceToken) {
  var request = {
    method: 'post',
    headers:{
      'X-Session': loginToken,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({"Token": deviceToken}),
  };
  var url = API_DOMAIN + "user/logout";
  RestKit.send(url, request, (error, json)=>
    {
      P.log("postLogOut",error);
      P.log("postLogOut", json);
    });
}

class SessionActions {
  logOut(loginToken, deviceToken) {
    P.log("logOut","action called" + loginToken + " " + deviceToken);
    postLogOutToServer(loginToken, deviceToken);
    return (dispatch) => {
      removeLoginTokenFromAsyncStorage().then(
        (hasLoggedOut) => {
          if (hasLoggedOut){
            P.log("logOut","dispatch action");
            dispatch(true);
          }
        }
      ).done();
    }
  }

  updateLoginToken(token) {
    return token;
  }

  updateMessageCount(count) {
    return count;
  }

  updateUri(uri) {
    return uri;
  }

  updateUser(token) {
    P.log("updateUser", token);
    return (dispatch) => {
      var user = {};
      if (token) {
        var request = {
          method: 'get',
          headers:{ 'X-Session': token, }
        };
        P.log("getUser", "Fetching User from server");
        var url = API_DOMAIN + "user/me";
        RestKit.send(url, request, function(error, json) {
          if (error) {
            P.log("getUser", error)
            return ;
          }
          if (json) {
            P.log("getUser", json);
            user = json;
          }
          return dispatch(user);
        });
      }
      else{
        return dispatch(user);
      }
    };
  }

  updateDeviceToken(token) {
    return token;
  }
}

module.exports = alt.createActions(SessionActions);
