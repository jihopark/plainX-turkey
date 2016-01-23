'use strict';

var React = require('react-native');
var {
  View,
  Navigator,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBarIOS,
  Platform,
  StyleSheet,
  Image,
  Animated,
  BackAndroid,
} = React;

var Routes = require('./screens/Routes.js');
var Rx = require('rx')
var SideMenu = require('react-native-side-menu');

var PlainSideMenu = require('./PlainSideMenu.js');
var NavigationTextButton = require('./NavigationTextButton.js');
var RestKit = require('react-native-rest-kit');

var PlainLog = require('../PlainLog.js');
var P = new PlainLog("PlainNavigator");

var PlainDataStore = require('../stores/PlainDataStore.js');
var PlainActions = require('../actions/PlainActions.js');

class PlainNavigator extends React.Component {
  constructor(props){
    super(props);
    this.state = PlainDataStore.getState();
    this.state.messageBounceValue = new Animated.Value(0);
    this.state.shouldBounceCount = true;
    this.state.isSideMenuOpen = false;

    this.componentDidMount = this.componentDidMount.bind(this);
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);

    this.toggleSideMenu = this.toggleSideMenu.bind(this);
    this.onChangeState = this.onChangeState.bind(this);
    this.getCard = this.getCard.bind(this);
    this.getOffer = this.getOffer.bind(this);
    this.getConversation = this.getConversation.bind(this);

    this.getInitialRouteStack = this.getInitialRouteStack.bind(this);
    this.setNetworkActivityIndicator = this.setNetworkActivityIndicator.bind(this);
    this.bounceMessage = this.bounceMessage.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.getNavBarRouter = this.getNavBarRouter.bind(this);
    this.sideMenuSubject = new Rx.Subject();
    this.handleBackAndroid = this.handleBackAndroid.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps["uri"] != this.props.uri) {
      this.shouldRerender = true;
    }
    if (nextProps["messageCount"]>0 && nextProps["messageCount"]!= this.props.messageCount)
      this.setState({shouldBounceCount: true});
    return true;
  }

  componentDidMount() {
    PlainDataStore.listen(this.onChangeState);
    if (Platform.OS == 'android')
      BackAndroid.addEventListener('hardwareBackPress', this.handleBackAndroid);
  }

  componentDidUpdate() {
    if (this.state.shouldBounceCount)
      this.bounceMessage();
  }

  componentWillUnmount() {
    PlainDataStore.unlisten(this.onChangeState);
    if (Platform.OS == 'android')
      BackAndroid.removeEventListener('hardwareBackPress', this.handleBackAndroid);
  }

  handleBackAndroid(){
    if (this.refs.navigator.getCurrentRoutes().length > 1)
      this.refs.navigator.pop();
    else if (this.state.isSideMenuOpen) {
      this.toggleSideMenu();
    }
    else {
      return false; //turn the app off if on the main screen
    }
    return true;
  }

  onChangeState(state) {
    state.messageBounceValue = this.state.messageBounceValue;
    state.shouldBounceCount = this.state.shouldBounceCount;
    state.isSideMenuOpen =  this.state.isSideMenuOpen;
    this.setState(state);
  }

  getCard(uuid) {
    return this.state.cards[uuid];
  }

  getConversation(id) {
    return this.state.conversations[id];
  }

  getOffer(id) {
    return this.state.offers[id];
  }

  //To Load all necessary screens from the uri
  getInitialRouteStack(uri){
    var initialRoutesStack = [];
    var routes = new Routes(uri);
    var length = routes.getDepth();
    for (var i=0;i<length;i++) {
      initialRoutesStack.push({uri: routes.getUri()});
      routes = routes.getPreviousRoutes();
    }
    return initialRoutesStack.reverse();
  }

  setNetworkActivityIndicator(value) {
    if (Platform.OS === 'ios')
      StatusBarIOS.setNetworkActivityIndicatorVisible(value);
  }

  getNavBarRouter() {
    return {
      Title: (route, navigator, index, navState) => {
        var routes = new Routes(route.uri);

        return routes.getCurrentRoute().title ?
          (<Text style={[navBarStyle.navBarText, navBarStyle.navBarTitleText]}>
              {navigator.props.screenName ? navigator.props.screenName : routes.getCurrentRoute().title}
          </Text>)
          :
          (<Image style={navBarStyle.navBarTitleImage} source={require('../assets/logo.png')} />);2
      },
      LeftButton: (route, navigator, index, navState) => {
        var routes = new Routes(route.uri);
        if (routes.getDepth() == 1) {
          var button = (
            <Image style={navBarStyle.navBarIcon}
              source={require("../assets/menuicon.png")} /> );
          return (
            <TouchableOpacity
              onPress={() => navigator.props.toggleSideMenu() }
              style={navBarStyle.navBarLeftButton}>
              {button}
            </TouchableOpacity>);
        }
        else {
          if (routes.hasBack()) {
            return (
              <TouchableOpacity
                style={navBarStyle.navBarLeftButton}
                onPress={() => navigator.pop()}>
                <Image style={navBarStyle.navBarIcon}
                  source={require('../assets/backicon.png')} />
              </TouchableOpacity>);
          }
        }
        return null;
      },
      RightButton: (route, navigator, index, navState) => {
        var routes = new Routes(route.uri);
        var routeName = routes.getCurrentRoute().name;
        var messageIconScreenBlackList = ["conversations", "conversationRoom", "login", "signup"];
        var shouldNotShowMsgIcon = messageIconScreenBlackList.indexOf(routeName) != -1;

        return shouldNotShowMsgIcon ? null :
          (<TouchableOpacity
            style={navBarStyle.navBarRightButton}
            onPress={() => navigator.push({uri: routes.addRoute('conversations')})}>
              <Image style={[navBarStyle.navBarIcon, navBarStyle.messageIcon]}
                source={require("../assets/msgicon.png")} />
              {navigator.props.messageCount > 0 ?
                (<Animated.View style={[navBarStyle.messageCountContainer, {transform: [{scale: navigator.props.messageBounceValue}]}]}>
                  <Text style={navBarStyle.messageCount}>
                    {navigator.props.messageCount}
                  </Text>
                </Animated.View>) : null}
            </TouchableOpacity>);
      }
    };
  }

  bounceMessage() {
    this.state.messageBounceValue.setValue(1.1);
    Animated.spring(
      this.state.messageBounceValue,
      {
        toValue: 0.8,
        friction: 0.5,
      }
    ).start();
    this.setState({shouldBounceCount: false});
  }

  renderScene(route, navigator) {
    var routes = new Routes(route.uri);
    if (this.shouldRerender && this.props.uri != route.uri) {
      this.shouldRerender = false;
      var newRouteStack = this.getInitialRouteStack(this.props.uri);
      navigator.immediatelyResetRouteStack(newRouteStack);
      return ;
    }
    if (routes!= null) {
      if (!navigator.props.sideMenuSubject.hasObservers()) {
        var changeState =
          navigator.props.sideMenuSubject.subscribe(function(event){
            switch (event.type) {
              case "pushScreen":
                navigator.push({uri: routes.addRoute(event.uri)});
              case "toggleSideMenu":
                navigator.props.toggleSideMenu();
            }
          });
      }

      var Screen = routes.getCurrentRoute().getComponent();

      return (
        <View
          style={styles.scene} keyboardShouldPersistTaps={false}>
          <Screen
            enablePagination={routes.getCurrentRoute().enablePagination}
            routes={routes}
            pushScreen={navigator.push}
            popScreen={navigator.pop}
            replaceScreen={navigator.replace}
            immediatelyResetRouteStack={navigator.immediatelyResetRouteStack}
            api_domain={this.props.API_DOMAIN}
            setNetworkActivityIndicator={this.setNetworkActivityIndicator}
            params={routes.getCurrentRouteParams()}

            getCard={this.getCard}
            getConversation={this.getConversation}
            getOffer={this.getOffer}

            //From AppContainer
            updateMessageCount={this.props.updateMessageCount}
            loginToken={this.props.loginToken}
            deviceToken={this.props.deviceToken}
            user={this.props.user}
            />
        </View>
      );
    }
    return null;
  }

  toggleSideMenu() {
    this.setState({isSideMenuOpen: !this.state.isSideMenuOpen});
  }

  render() {
    return (
      <SideMenu
          onChange={(isOpen) => this.setState({isSideMenuOpen: isOpen})}
          isOpen={this.state.isSideMenuOpen}
          menu={
            <PlainSideMenu
              isOpen={this.state.isSideMenuOpen}
              sideMenuSubject={this.sideMenuSubject} />}>
        <Navigator
          ref="navigator"
          screenName={this.props.screenName}
          toggleSideMenu={this.toggleSideMenu}
          sideMenuSubject={this.sideMenuSubject}
          initialRouteStack={this.getInitialRouteStack(this.props.uri)}
          renderScene={this.renderScene}
          messageCount={this.props.messageCount}
          messageBounceValue={this.state.messageBounceValue}
          style={styles.appContainer}
          navigationBar={
            <Navigator.NavigationBar
              style={styles.navBar}
              routeMapper={this.getNavBarRouter()}/>
          }
        />
      </SideMenu>
    );
  }
}

var navBarAndroid = StyleSheet.create({
  navBarText: {
    fontSize: 15,
  },
  navBarTitleText: {

  },
  navBarTitleImage: {
    width:59,
    height:25,
    padding: 5,
  },
  navBarIcon: {
    width:20,
    height:20,
    resizeMode: 'stretch',
  },
  navBarLeftButton: {
    marginLeft: 10,
    padding: 3,
  },
  navBarRightButton: {
    marginRight: 10,
    padding: 3,
  },
  navBarButtonText: {
    color: '#33cc66',
  },
  messageIcon: {
    width: 25, height: 25,
  },
  messageCountContainer: {
    backgroundColor:'#33cc66',
    width:15, height: 15,
    borderRadius: 10,
    justifyContent: 'center',
    flexDirection: 'row',
    position:'absolute',
    top:0,
    left:0,
  },
  messageCount: {
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 10,
  },
});

var navBarIOS = StyleSheet.create({
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {

  },
  navBarTitleImage: {
    width:59,
    height:25,
    marginVertical: 10,
    padding: 5,
  },
  navBarIcon: {
    width:20,
    height:20,
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  navBarLeftButton: {
    paddingLeft: 13,
    paddingTop: 15,
    paddingBottom: 3,
    paddingRight: 3,
  },
  navBarRightButton: {
    marginRight: 10,
    marginTop: 12,
    padding: 3,
  },
  navBarButtonText: {
    color: '#33cc66',
  },
  messageIcon: {
    position:'absolute',
    top:-2,
    left: -20,
    width: 30, height: 30
  },
  messageCountContainer: {
    backgroundColor:'#33cc66',
    width:20, height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    flexDirection: 'row',
    position:'absolute',
    top:-2,
    left: -33,
  },
  messageCount: {
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
  },
});

const isIOS = Platform.OS == 'ios';
var navBarStyle = isIOS ? navBarIOS : navBarAndroid;

var styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'white',
  },
  scene: {
    flex: 1,
    paddingTop: (Platform.OS =='ios' ? 20 : 12),
    backgroundColor: '#EAEAEA', //should change to background image later
  },
});

module.exports = PlainNavigator;
