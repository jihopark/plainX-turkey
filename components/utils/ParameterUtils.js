'use strict';

function isNumeric(n){
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function parseNumber(s){
  return s.indexOf('.') == -1 ? parseInt(s) : parseFloat(s);
}

var ParameterUtils = {

  getParamsToString: (params) => {
    var s = "";
    var keys = Object.keys(params);
    for (var i=0, length = keys.length ; i<length; i++) {
      if (isNumeric(params[keys[i]])){
        s += (keys[i] + "=" + params[keys[i]] + "&");
      }
      else {
        s += (keys[i] + "=" + params[keys[i]] + "&");
      }
    }
    return s;
  },

  getStringToParams: (queryString) => {
    var params = {};
    var paramStrings = queryString.split("&");
    for (var i=0; i<paramStrings.length; i++) {
      var split = paramStrings[i].split("=");
      params[split[0]] = isNumeric(split[1]) ? parseNumber(split[1]+"") : split[1];
    }
    return params;
  },
}

module.exports = ParameterUtils;
