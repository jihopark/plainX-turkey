'use strict';

var NumberUtils =  {
  formatNumber: function(n) {
    var f = parseFloat(n);
    return f ? (Math.round(f * 100) / 100)+"" : f;
  },
  formatRate: function(n) {
    var f = parseFloat(n);
    return f ? (Math.round(f * 1000) / 1000)+"" : f;
  },
}

module.exports = NumberUtils;
