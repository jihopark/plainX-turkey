var registeredRoutes = [
  {
    name: "main",
    id: 1,
    getComponent: () => require("../screens/MainScreen.js"),
    title: "Helloworld",
  },
  {
    name: "offers",
    id: 2,
    getComponent: () => "",
    title: "See all offers",
  }
]

class Routes {
  constructor(routeNames) {
    var registeredNames = registeredRoutes.map((route)=>route.name);
    for (var name in routeNames) {
      if (!(name in registeredNames))
        return null;
    }
    this.routes = routeNames.map((name)=>registeredRoutes[registeredNames.indexOf(name)]);
  }

  getCurrentRoute() {
    return this.routes[this.routes.length-1];
  }

  getPreviousRoutes() {
    return new Routes(this.routes.slice(0, length-1));
  }

  hasBack() {
    return this.routes.length != 1
  }
}

module.exports = Routes;
