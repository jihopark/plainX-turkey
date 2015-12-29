'use strict';

var CardRouter = {
  registeredCards: {
    "Offer": () => require('../cards/Offer.js'),
    "CurrencySelect": () => require('../cards/CurrencySelect.js'),
    "Explanation": () => require('../cards/Explanation.js'),
    "CurrencyAmountSelect": () => require('../cards/CurrencyAmountSelect.js'),
    "LocationSelect": () => require('../cards/LocationSelect.js'),
    "ExpirySelect": () => require('../cards/ExpirySelect.js'),
    "CurrencyAmount": () => require('../cards/CurrencyAmount.js'),
    "OfferOwner": () => require('../cards/OfferOwner.js'),
    "Location": () => require('../cards/Location.js'),
    "Expiry": () => require('../cards/Expiry.js'),
    "OfferSummary": () => require('../cards/OfferSummary.js'),
    "UserConversationItem": () => require('../cards/UserConversationItem.js'),
    "Message": () => require('../cards/Message.js'),
    "Feedback": () => require('../cards/Feedback.js'),
    "Header": () => require('../cards/Header.js'),
    "Empty": () => require('../cards/Empty.js'),
    "Error": () => require('../cards/Error.js'),
    "TodaysRateOffer": () => require('../cards/TodaysRateOffer.js'),
    "IconExplanation": () => require('../cards/IconExplanation.js'),
  },
  getComponent: function(name){
    if (Object.keys(this.registeredCards).indexOf(name) == -1) return null;
    else return this.registeredCards[name]();
  },
  isOfferBaseCard: function(name) {
    var offerBaseCards = ["Offer", "CurrencyAmount", "Location", "Expiry", "TodaysRateOffer", "OfferOwner"];
    return offerBaseCards.indexOf(name)!= -1;
  },
  isConversationCard: function(name) {
    return name.indexOf("Conversation")!= -1 || name.indexOf("Message")!= -1 || name.indexOf("Feedback")!= -1;
  }
};

module.exports = CardRouter;
