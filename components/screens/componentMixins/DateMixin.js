'use strict';

var moment = require('moment');

var DateMixin =  {
  getMessageTimestampFormat: function(timestamp) {
    var time = moment(timestamp*1000);
    if (time.isSame(moment(), 'd'))
      return time.format("h:mm a");
    return time.format("MMM Do h:mm a");
  },
  getConversationTimestampFormat: function(timestamp) {
    var time = moment(timestamp*1000);
    if (time.isSame(moment(), 'd'))
      return time.format("h:mm a");
    return time.format("MMM Do");
  },
  getDateFormat: function(date) {
    var time = moment(date*1000);
    return time.format("MMM Do YY");
  },
}

module.exports = DateMixin;
