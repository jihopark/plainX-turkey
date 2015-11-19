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
    "MessageThread": () => require('../cards/Offer.js'),
    "Message": () => require('../cards/Offer.js'),
    "SettingOption": () => require('../cards/Offer.js')
  },
  getComponent: function(name){
    if (Object.keys(this.registeredCards).indexOf(name) == -1) return null;
    else return this.registeredCards[name]();
  }
};

module.exports = CardRouter;
