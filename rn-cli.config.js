var blacklist= require("react-native/packager/blacklist");
var config = {
    getBlacklistRE(platform) {
        return blacklist(platform,[/plainX.+\/node_modules\/fbjs.*/]);
    }
}
module.exports = config;
