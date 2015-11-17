'use strict';

var CurrencyAmountSelectCardMixin =  {
  currencyAmountSelectCardOnNext: function(event) {
    switch(event["Target"]){
      case "Focus":
        if (this.state.showCurrencyPicker)
          this.setState({showCurrencyPicker: false});
          break;
      case "Next":
        console.log("NEXT");
        break;
      case "SellAmount":
      case "BuyAmount":
        this.setCardDataState(event["id"], event["Target"], event[event["Target"]]);
        break;
      case "Sell":
      case "Buy":
        this.setState({showCurrencyPicker: true,
                        currentCurrency: event["CurrentCurrency"],
                        targetInput: event["Target"],
                        currencyList: event["CurrencyList"],
                        currencySelectId: event["id"]});
    }
  }
}

module.exports = CurrencyAmountSelectCardMixin;
