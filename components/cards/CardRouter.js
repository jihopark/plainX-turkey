'use strict';

var CardRouter = {
  registeredCards: {
    "Offer": () => require('../cards/Offer.js'),
    "CurrencySelect": () => require('../cards/CurrencySelect.js'),
    "Explanation": () => require('../cards/Explanation.js'),
    "CurrencyAmountSelect": () => require('../cards/CurrencyAmountSelect.js'),
    "LocationSelect": () => require('../cards/LocationSelect.js'),
    "ExpiryDateSelect": () => require('../cards/ExpiryDateSelect.js'),
    "CurrencyAmount": () => require('../cards/Offer.js'),
    "User": () => require('../cards/Offer.js'),
    "Location": () => require('../cards/Offer.js'),
    "ExpireDate": () => require('../cards/Offer.js'),
    "OfferSummary": () => require('../cards/Offer.js'),
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
