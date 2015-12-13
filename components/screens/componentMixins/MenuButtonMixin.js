'use strict';


var React = require('react-native');

var MenuButtonMixin =  {
  toggleSideMenu: function(event) {
    console.log("TOGGLE FROM MaIN");
    this.context.menuActions.toggle();
  },
  contextTypes: {
    menuActions: React.PropTypes.object.isRequired,
  },
}

module.exports = MenuButtonMixin;
