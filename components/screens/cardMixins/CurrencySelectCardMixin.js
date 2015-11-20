'use strict';

var CurrencySelectMixin =  {
  currencySelectCardOnNext: function(event) {
    //If event is button
    if (event["Target"] == "Button") {
      var params = {"sell": event["Sell"], "buy": event["Buy"]};
      this.props.pushScreen({uri: this.props.routes.addRoute('offerlist?'+this.getParamsToString(params))});
      return ;
    }

    //If event is selecting currency
    this.setState({showCurrencyPicker: true,
                    currentCurrency: event["CurrentCurrency"],
                    targetInput: event["Target"],
                    currencyList: event["CurrencyList"],
                    currencySelectId: event["id"]});
  }
}

module.exports = CurrencySelectMixin;
