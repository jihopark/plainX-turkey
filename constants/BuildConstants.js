'use strict';

const DEVELOPMENT = "DEV";
const PRODUCTION = "PROD";

const BUILD = PRODUCTION;

var BuildConstants = {
  API_DOMAIN: BUILD == DEVELOPMENT ?
    'https://plaindev.herokuapp.com/api/v1/' : 'https://plainexchange.herokuapp.com/api/v1/',
  MIXPANEL_TOKEN: BUILD == DEVELOPMENT ?
    "b96294c2f2d4ba22307fc1396251b62a" : "04885f324faf84460d4b8418cd52eac6",
};

module.exports = BuildConstants;
