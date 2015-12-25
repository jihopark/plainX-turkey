'use strict';

class PlainLog {
  constructor(tag){
    this.tag = tag;
  }

  log(funcName, log){
    console.log(this.tag + "/" + funcName + " : " + JSON.stringify(log));
  }
}

module.exports = PlainLog;
