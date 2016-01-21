'use strict';

var React = require('react-native');

var ViewPager = require('react-native-viewpager');

var {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} = React;

const IMAGES = [
  require('../assets/WT1bg.png'),
  require('../assets/WT2bg.png'),
  require('../assets/WT3bg.png'),
  require('../assets/WT4bg.png'),
  require('../assets/WT5bg.png'),
  require('../assets/WT6bg.png')
];

var TutorialPager = React.createClass({
  displayName: "TutorialPager",
  getInitialState: function() {
    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });
    return {
      pageNumber: 0,
      dataSource: dataSource.cloneWithPages(IMAGES),
    };
  },
  renderPage: function(data: Object, pageID: number | string,) {
    return (
      <Image
        style={{flex:1, width: undefined, height: undefined}}
        resizeMode={'stretch'}
        source={data}/>
    );
  },
  onChangePage: function(page){
    this.setState({pageNumber: page});
  },
  onNext: function() {
    this.refs.viewPager.goToPage(this.state.pageNumber+1);
  },
  render: function() {
    var rightButton;
    switch(this.state.pageNumber) {
      case 0:
        rightButton = (<TouchableOpacity onPress={this.props.close} style={styles.right}>
          <Text style={styles.rightText}>Skip</Text>
          </TouchableOpacity>);
        break;
      case IMAGES.length-1:
        rightButton = (<TouchableOpacity onPress={this.props.close} style={styles.right}>
          <Text style={[styles.rightText, {fontWeight: 'bold'}]}>START</Text>
          </TouchableOpacity>);
        break;
      default:
        rightButton = (<TouchableOpacity onPress={this.onNext} style={styles.right}>
          <Text style={styles.rightText}>Next</Text>
          </TouchableOpacity>);
    }

    return (
      <View style={styles.container}>
        <ViewPager
          ref="viewPager"
          dataSource={this.state.dataSource}
          renderPage={this.renderPage}
          onChangePage={this.onChangePage}/>
        <TouchableOpacity onPress={this.props.goToSignUp} style={styles.left}>
          <Text style={styles.leftText}>{"New?\nSign Up"}</Text>
          </TouchableOpacity>
        {rightButton}
      </View>
    );
  }
});


var styles = StyleSheet.create({
  container:{
    flex:1,
  },
  left:{
    position: 'absolute',
    top: Dimensions.get('window').height*(Platform.OS == 'ios' ? 0.93 : 0.89),
    left:10,
    backgroundColor:'transparent',
  },
  leftText:{
    color: 'white',
  },
  right:{
    position: 'absolute',
    top: Dimensions.get('window').height*(Platform.OS == 'ios' ? 0.95 : 0.91),
    left:Dimensions.get('window').width*0.85,
    backgroundColor:'transparent',
  },
  rightText:{
    color: 'white',
  }
});

module.exports = TutorialPager;
