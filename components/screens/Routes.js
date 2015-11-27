

class Routes {
  getRegisteredRoutes() {
    return [
      {
        name: "main",
        id: 1,
        getComponent: () => require("../screens/MainScreen.js"),
        hasCustomLeftButton: true,
        hasCustomRightButton: true,
        rightButtonImageSource: () => require("../../assets/msgicon.png"),
        leftButtonImageSource: () => require("../../assets/menuicon.png"),
        enablePagination: false
      },
      {
        name: "offerlist",
        id: 2,
        getComponent: () => require("../screens/OfferListScreen.js"),
        title: "See all offers",
        enablePagination: true
      },
      {
        name: "makeOffer",
        id: 3,
        getComponent: () => require("../screens/MakeOfferScreen.js"),
        title: "Make an offer",
        enablePagination: false
      },
      {
        name: "login",
        id: 4,
        getComponent: () => require("../screens/LoginScreen.js"),
        title: "Login",
        enablePagination: false
      }
    ];
  }

  constructor(uri) {
    var routeNames = uri.split('/');
    if (routeNames.length > 0){
      for (var i=0;i<routeNames.length; i++) {
        if (!this.isRegisteredName(routeNames[i].split('?')[0])){
          return null;
        }
        if (routeNames[i].split('?').length > 1) {
          this.params = this.params || {};
          this.params[i] = routeNames[i].split('?')[1];
        }
      }
      this.routes = routeNames.map((name) => this.getRegisteredRouteWithName(name));
    }
  }

  isRegisteredName(name){
    name = name.split('?')[0];
    var registeredRoutes = this.getRegisteredRoutes();
    for (var i=0, numRoutes = registeredRoutes.length; i<numRoutes; i++){
      if (registeredRoutes[i].name==name) return true;
    }
    return false;
  }

  getRegisteredRouteWithName(name){
    name = name.split('?')[0];
    if (this.isRegisteredName(name)) {
      var registeredRoutes = this.getRegisteredRoutes();
      return registeredRoutes[registeredRoutes.map((route)=>route.name).indexOf(name)];
    }
    else {
      return null;
    }
  }

  getDepth() {
    return this.routes.length
  }

  getCurrentRoute() {
    return this.routes[this.routes.length-1];
  }

  getCurrentRouteParams() {
    return this.params ? this.params[this.routes.length-1] || "" : "";
  }

  addRoute(name) {
    if (this.isRegisteredName(name)) {
      this.routes.push(this.getRegisteredRouteWithName(name));
      if (name.split('?').length > 1) {
        this.params = this.params || {};
        this.params[this.routes.length-1] = name.split('?')[1];
      }
    }
    return this.getUri();
  }

  getUri() {
    var uri = this.routes[0].name;
    for (var i=1;i<this.routes.length;i++) {
      uri += ("/" + this.routes[i].name);
      if (this.params && this.params[i])
        uri+= ("?"+this.params[i]);
    }
    return uri;
  }

  getPreviousRoutes() {
    var previous = new Routes("");
    if (this.params && this.params[this.routes.length-1])
      delete this.params[this.routes.length-1];
    previous.routes = this.routes.slice(0, this.routes.length-1);
    return previous;
  }


  hasBack() {
    return this.routes.length != 1
  }
}

module.exports = Routes;
