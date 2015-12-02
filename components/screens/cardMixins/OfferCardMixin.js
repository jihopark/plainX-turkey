'use strict';

var OfferCardMixin =  {
  offerCardonNext: function(event) {
    this.props.pushScreen({uri: this.props.routes.addRoute('offerDetail?'+this.getParamsToString({"Id": event["Id"]}))});
  },
}

module.exports = OfferCardMixin;
