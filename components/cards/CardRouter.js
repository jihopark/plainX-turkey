'use strict';

var CardRouter = {
  registeredCards: {
    "Offer": () => require('../cards/Offer.js'),
    "CurrencySelect": () => require('../cards/CurrencySelect.js'),
    "Explanation": () => require('../cards/Explanation.js'),
    "CurrencyAmountSelect": () => require('../cards/CurrencyAmountSelect.js'),
    "LocationSelect": () => require('../cards/LocationSelect.js'),
    "ExpiryDateSelect": () => require('../cards/ExpiryDateSelect.js'),
    "CurrencyAmount": () => require('../cards/CurrencyAmount.js'),
    "User": () => require('../cards/Offer.js'),
    "Location": () => require('../cards/Location.js'),
    "ExpiryDate": () => require('../cards/ExpiryDate.js'),
    "OfferSummary": () => require('../cards/OfferSummary.js'),
    "UserConversationItem": () => require('../cards/UserConversationItem.js'),
    "Message": () => require('../cards/Message.js'),
    "Header": () => require('../cards/Header.js'),
    "Empty": () => require('../cards/Empty.js'),
    "Error": () => require('../cards/Error.js'),
  },
  getComponent: function(name){
    if (Object.keys(this.registeredCards).indexOf(name) == -1) return null;
    else return this.registeredCards[name]();
  },
  isConversationCard: function(name) {
    return name.indexOf("Conversation")!= -1 || name.indexOf("Message")!= -1;
  }
};

module.exports = CardRouter;
