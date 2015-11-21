'use strict';

var update = require('react-addons-update');


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
      case "AmountSell":
      case "AmountBuy":
        this.setState({data: this.mutateCardStateData(this.state.data, event["id"], event["Target"], event[event["Target"]])});
        break;
      case "Sell":
      case "Buy":
        //Remove numbers if change of currency.
        var data = this.mutateCardStateData(this.state.data, event["id"], "AmountSell", '');
        data = this.mutateCardStateData(data, event["id"], "AmountBuy", '');

        this.setState({ data: data,
                        showCurrencyPicker: true,
                        currentCurrency: event["CurrentCurrency"],
                        targetInput: event["Target"],
                        currencyList: event["CurrencyList"],
                        currencySelectId: event["id"]});
    }
  }
}

module.exports = CurrencyAmountSelectCardMixin;
