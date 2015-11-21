'use strict';

var ExpiryDateSelectCardMixin =  {
  expiryDateSelectCardonNext: function(event) {
    this.setState({data:this.mutateCardStateData(this.state.data, event["id"], "Date", event["Date"])});
  }
}

module.exports = ExpiryDateSelectCardMixin;
