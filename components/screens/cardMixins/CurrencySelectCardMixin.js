'use strict';

var CurrencySelectMixin =  {
  currencySelectCardOnNext: function(event) {
    //If event is button
    switch (event["Target"]){
      case "Button":
        var params = {"Sell": event["Sell"], "Buy": event["Buy"]};
        this.props.pushScreen({uri: this.props.routes.addRoute('offerlist?'+this.getParamsToString(params))});
        break;
      case "Buy":
      case "Sell":
        this.setState({data: this.mutateCardStateData(this.state.data, event["id"], event["Target"], event[event["Target"]])});
        break;
    }
  }
}

module.exports = CurrencySelectMixin;
