'use strict';

var CurrencySelectMixin =  {
  currencySelectCardOnNext: function(event) {
    //If event is button
    if (event["Target"] == "Button") {
      console.log("BUTTON Clicked in CurrencySelectCard");
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
