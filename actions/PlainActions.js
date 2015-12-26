var alt = require('../alt');

var PlainLog = require('../PlainLog.js');
var P = new PlainLog("PlainActions");

class PlainActions {

  updateScreenData(offers, conversations, cards) {
    return {offers, conversations, cards};
  }

  updateCards(cards) {
    return cards;
  }

  removeCards(cards) {
    return cards;
  }

  updateOffer(offer) {
    return offer;
  }

  removeOffer(offer) {
    return offer;
  }

  updateConversations(conversations) {
    return conversations;
  }

  removeConversation(conversation) {
    return conversation;
  }
}

module.exports = alt.createActions(PlainActions);
