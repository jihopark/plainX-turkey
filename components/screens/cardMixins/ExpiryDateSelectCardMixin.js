'use strict';

var ExpiryDateSelectCardMixin =  {
  expiryDateSelectCardonNext: function(event) {
    this.setCardDataState(event["id"], "Date", event["Date"]);
  }
}

module.exports = ExpiryDateSelectCardMixin;
