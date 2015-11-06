

class Routes {
  getRegisteredRoutes() {
    return [
      {
        name: "main",
        id: 1,
        getComponent: () => require("../screens/MainScreen.js"),
        title: "Helloworld",
        hasCustomLeftButton: true,
        hasCustomRightButton: true
      },
      {
        name: "offers",
        id: 2,
        getComponent: () => require("../screens/OffersScreen.js"),
        title: "See all offers",
      }
    ];
  }

  constructor(routeNames) {
    if (routeNames.length > 0){
      for (var i=0;i<routeNames.length; i++) {
        if (!this.isRegisteredName(routeNames[i])){
          return null;
        }
      }
      this.routes = routeNames.map((name) => this.getRegisteredRouteWithName(name));
    }
  }

  isRegisteredName(name){
    for (var i=0; i<this.getRegisteredRoutes().length; i++){
      if (this.getRegisteredRoutes()[i].name==name) return true;
    }
    return false;
  }

  getRegisteredRouteWithName(name){
    if (this.isRegisteredName(name)) {
      return this.getRegisteredRoutes()[this.getRegisteredRoutes().map((route)=>route.name).indexOf(name)];
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

  addRoute(name) {
    if (this.isRegisteredName(name))
      this.routes.push(this.getRegisteredRouteWithName(name));
    return this.getUri();
  }

  getUri() {
    var uri = this.routes[0].name;
    for (var i=1;i<this.routes.length;i++)
      uri += ("/" + this.routes[i].name);
    return uri;
  }

  getPreviousRoutes() {
    var previous = new Routes([]);
    previous.routes = this.routes.slice(0, this.routes.length-1);
    return previous;
  }


  hasBack() {
    return this.routes.length != 1
  }
}

module.exports = Routes;
