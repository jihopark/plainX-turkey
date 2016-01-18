'use strict';

const DEVELOPMENT = "DEV";
const PRODUCTION = "PROD";

const BUILD = DEVELOPMENT;

var BuildConstants = {
  API_DOMAIN: BUILD == DEVELOPMENT ?
    'https://plaindev.herokuapp.com/api/v1/' : 'https://plainexchange.herokuapp.com/api/v1/',
  MIXPANEL_TOKEN: BUILD == DEVELOPMENT ?
    "b96294c2f2d4ba22307fc1396251b62a" : "c350b022d1918a7139a9b08a682aecc3",
};

module.exports = BuildConstants;
