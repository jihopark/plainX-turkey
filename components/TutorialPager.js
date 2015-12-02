'use strict';

var React = require('react-native');

var ViewPager = require('react-native-viewpager');

var {
  View,
  Text,
  Image,
} = React;

var url = ["https://www.oneclickroot.com/wp-content/uploads/2012/10/contctsplus-tutorial-1.jpg",
          "https://www.oneclickroot.com/wp-content/uploads/2012/10/contctsplus-tutorial-1.jpg",
          "https://www.oneclickroot.com/wp-content/uploads/2012/10/contctsplus-tutorial-1.jpg"];
var TutorialPager = React.createClass({
  displayName: "TutorialPager",
  getInitialState: function() {
    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });
    return {
      dataSource: dataSource.cloneWithPages(url),
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
      <View style={{flex:1}}>
        <ViewPager
          dataSource={this.state.dataSource}
          renderPage={this.renderPage}/>
      </View>
    );
  }
});

module.exports = TutorialPager;
