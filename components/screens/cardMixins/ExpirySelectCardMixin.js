'use strict';

var ExpirySelectCardMixin =  {
  expirySelectCardonNext: function(event) {
    this.setState({data:this.mutateCardStateData(this.state.data, event["id"], "Expiry", event["Expiry"])});
  }
}

module.exports = ExpirySelectCardMixin;
