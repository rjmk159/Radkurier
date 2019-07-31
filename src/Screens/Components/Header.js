/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet, Image, View, Text, TouchableOpacity
} from 'react-native';

import color from '../../utils/color';
import images from '../../assets/images/images'

class HeaderNav extends React.Component {
  render() {
    return (
    <View style={styles.body}>
      {this.props.back?<TouchableOpacity
        onPress={()=>{this.props.goBack()}}
      >
          <Image style={styles.backButton} source={images.theme1.backIcon} />
      </TouchableOpacity>:<Text/>}
      <Image style={styles.logo} source={images.theme1.miniLogo} />
      <Text/>
    </View>
  );
};
}

const styles = StyleSheet.create({

  body: {
    backgroundColor: color.select.primary,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:20,
    paddingRight:20,
    position:'relative',
    zIndex:9999
  },
  logo:{
      width:130,
      height:50
  },
  backButton:{
    width:20,
    height:15,

  }
});

export default HeaderNav;
