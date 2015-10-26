/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

var API_DOMAIN = 'https://plainexchange.herokuapp.com/api/v1/';

var plainXiOS = React.createClass({
  APIRoute: "offer",
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    fetch(API_DOMAIN + this.APIRoute)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true,
        });
      })
      .done();
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderOffer}
        style={styles.listView}
      />
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading offers...
        </Text>
      </View>
    );
  },
  renderOffer: function(offer) {
    return (
      <View style={styles.container}>
        <Text style={styles.seller}>Seller {offer["Seller"]}</Text>
        <View style={styles.rightContainer}>
          <Text style={styles.number}>Amount Have: {offer["AmountHave"]}</Text>
          <Text style={styles.currency}>{offer["Have"]}</Text>
          <Text style={styles.number}>Amount Need: {offer["AmountNeed"]}</Text>
          <Text style={styles.currency}>{offer["Need"]}</Text>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  seller: {
    fontSize: 20,
  },
  rightContainer: {
    flex: 1,
  },
  currency: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  number: {
    fontSize: 25,
  },
  year: {
    textAlign: 'center',
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});


AppRegistry.registerComponent('plainXiOS', () => plainXiOS);
