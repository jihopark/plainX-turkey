'use strict';

var update = require('react-addons-update');


var CurrencyAmountSelectCardMixin =  {
  roundUpNumber: function(number) {
    return ""+(Math.round(number*100)/100);
  },
  getRateFromCurrencyList: function(id) {
    var cards = this.state.data["Cards"];
    for (var i=0, numCards = cards.length ; i<numCards; i++) {
      if (cards[i]["UUID"] == id) {
        var sell = cards[i]["Data"]["Sell"];
        var buy = cards[i]["Data"]["Buy"];

        var rate = 1;
        var list = cards[i]["Data"]["CurrencyList"];
        for (var j=0, numCurr = list.length; j< numCurr; j++) {
          if (list[j]["Code"] == sell)
            rate *= list[j]["Rate"];
          else if (list[j]["Code"] == buy)
            rate /= list[j]["Rate"];
        }
        return rate;
      }
    }
  },
  clearAll: function(id) {
    var data = this.mutateCardStateData(this.state.data, id, "AmountSell", '');
    data = this.mutateCardStateData(data, id, "AmountBuy", '');
    data = this.mutateCardStateData(data, id, "SellRate", '');
    data = this.mutateCardStateData(data, id, "BuyRate", '');
    return data;
  },
  currencyAmountSelectCardOnNext: function(event) {
    var data;
    switch(event["Target"]){
      case "Focus":
        if (this.state.showCurrencyPicker)
          this.setState({showCurrencyPicker: false});
          break;
      case "Next":
        console.log("NEXT");
        break;
      case "AmountSell":
        if (!event[event["Target"]]) {
          data = this.clearAll(event["id"]);
        }
        else {
          var rate = this.getRateFromCurrencyList(event["id"]);
          data = this.mutateCardStateData(this.state.data, event["id"], "AmountSell", event[event["Target"]]);
          data = this.mutateCardStateData(data, event["id"], "AmountBuy", this.roundUpNumber(event[event["Target"]]/rate));
          data = this.mutateCardStateData(data, event["id"], "BuyRate", this.roundUpNumber(1/rate));
          data = this.mutateCardStateData(data, event["id"], "SellRate", "");
        }
        this.setState({data: data});
        break;
      case "AmountBuy":
        if (!event[event["Target"]]) {
          console.log("EMPTY");
          data = this.clearAll(event["id"]);
        }
        else {
          var rate = this.getRateFromCurrencyList(event["id"]);
          data = this.mutateCardStateData(this.state.data, event["id"], "AmountBuy", event[event["Target"]]);
          data = this.mutateCardStateData(data, event["id"], "AmountSell", this.roundUpNumber(event[event["Target"]]*rate));
          data = this.mutateCardStateData(data, event["id"], "SellRate", this.roundUpNumber(rate));
          data = this.mutateCardStateData(data, event["id"], "BuyRate", "");
        }
        this.setState({data: data});
        break;
      case "Sell":
      case "Buy":
        //Remove numbers if change of currency.
        data = this.clearAll(event["id"]);
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
