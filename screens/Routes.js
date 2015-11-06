

class Routes {
  getRegisteredRoutes() {
    return [
      {
        name: "main",
        id: 1,
        getComponent: () => require("../screens/MainScreen.js"),
        title: "Helloworld",
      },
      {
        name: "offers",
        id: 2,
        getComponent: () => "../screens/OffersScreen.js",
        title: "See all offers",
      }
    ];
  }
  constructor(routeNames) {
    for (var i=0;i<routeNames.length; i++) {
      if (!this.isRegisteredName(routeNames[i])){
        return null;
      }
    }
    this.routes = routeNames.map((name) => this.getRegisteredRouteWithName(name));
    console.log(this.routes);
  }

  isRegisteredName(name){
    for (var i=0; i<this.getRegisteredRoutes().length; i++){
      console.log("hey"+this.getRegisteredRoutes()[i].name);
      console.log("yo"+name);
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

  getCurrentRoute() {
    return this.routes[this.routes.length-1];
  }

  addRoute(name) {
    if (isRegisteredName(name))
      this.routes.push(getRegisteredRouteWithName(name));
  }

  getPreviousRoutes() {
    return new Routes(this.routes.slice(0, length-1));
  }


  hasBack() {
    return this.routes.length != 1
  }
}

module.exports = Routes;
