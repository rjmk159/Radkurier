
const React = require('react-native');
import Colors from '../../utils/color';
import { Dimensions,Platform } from "react-native";
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  background: {
    paddingBottom: 40,
    height: deviceHeight *0.35,
    width:deviceWidth,
    paddingHorizontal: 32,
    backgroundColor: Colors.lighter,
    position:'relative'
  },
  logo: {
    overflow: 'visible',
    resizeMode: 'cover',
    flex:1,
    marginLeft: -10,
    marginBottom:-20,
  },
  ctaContainer:{
    borderRadius: 30,
    borderWidth:1,
    borderColor:'#002b7a',
    padding:30,
    paddingLeft:20,
    paddingRight:20,
    justifyContent:'center',
    alignItems:'center'
  },
  ctaImageBiker:{
    width:40,
    height:45
  },
  ctaImage:{
    width:40,
    height:40
  },
  logo:{
    width:Platform.OS === 'ios' ? 130 : 110,
    height:Platform.OS === 'ios' ? 50 : 40,
    marginTop:Platform.OS === 'ios' ? 0 : 10,
    marginLeft:Platform.OS === 'ios' ? 0 : '27%'
  },
  lgButton:{
    width:23,
    height:23,
    marginRight:20,
    marginTop:10
  }
 
};
