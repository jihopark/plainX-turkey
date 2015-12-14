'use strict';

var React = require('react-native');

var ViewPager = require('react-native-viewpager');

var {
  View,
  Text,
  Image,
  TouchableOpacity,
} = React;

var TutorialPager = React.createClass({
  displayName: "TutorialPager",
  getInitialState: function() {
    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });
    return {
      dataSource: dataSource.cloneWithPages(this.props.urls),
    };
  },
  renderPage: function(data: Object, pageID: number | string,) {
    console.log(data);
    return (
      <Image
        style={{flex:1}}
        resizeMode={'stretch'}
        source={{uri: data}}/>
    );
  },
  render: function() {
    return (
      <View style={{flex:1, flexDirection: 'column'}}>
        <View style={{backgroundColor: 'white',}}>
          <TouchableOpacity onPress={this.props.closeTutorial}>
            <Image
              source={require('image!cross')}
              style={{alignSelf:'flex-end', width:20, height:20, marginRight: 10, marginTop: 10, marginBottom: 5}}/>
          </TouchableOpacity>
        </View>
        <ViewPager
          dataSource={this.state.dataSource}
          renderPage={this.renderPage}/>
      </View>
    );
  }
});

module.exports = TutorialPager;
