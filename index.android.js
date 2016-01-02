'use strict';

var React = require('react-native');
var {
  AppRegistry,
} = React;

var AppContainer = require('./components/AppContainer.js');

var PlainLog = require('./PlainLog.js');
var P = new PlainLog("AppContainerIOS");

class AppContainerAndroid extends AppContainer {
  constructor(){
    super();
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    //PushNotificationIOS.addEventListener("register", this.onRegister);
    //PushNotificationIOS.checkPermissions(this.onCheckPermission);

  }

  componentWillUnmount() {
    super.componentWillUnmount();
    //PushNotificationIOS.removeEventListener('notification', this.onNotification);
    //PushNotificationIOS.removeEventListener("register", this.onRegister);
  }
}

AppRegistry.registerComponent('plainX', () => AppContainerAndroid);
