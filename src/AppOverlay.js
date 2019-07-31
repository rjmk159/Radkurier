/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Dimensions,
} from 'react-native';
const {height} = Dimensions.get('window')
import Colors from './utils/color'
class AppOverlay extends React.Component {
    render() {
        return(
    <Fragment>
      <StatusBar  backgroundColor={Colors.select.primary} barStyle="light-content"/>
      <SafeAreaView style={{backgroundColor:'#fff',minHeight:this.props.height?height:'auto'}}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
          {this.props.children}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
};
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.select.white,

  },
  body: {
    backgroundColor: Colors.select.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default AppOverlay;
