
const React = require('react-native');
import color from '../../utils/color';
import { Dimensions,Platform } from "react-native";
import Sizer from '../../utils/sizer'
const deviceWidth = Dimensions.get('window').width;

export default {
  ctaOuterContainer:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:50,
    marginBottom:50
  },
  ctaContainer:{
    borderRadius: 100,
    borderWidth:1,
    width:110,
    height:110,
    borderColor:'#002b7a',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:30,
    overflow:'hidden'
  },
  textImage:{
    width:15,
    height:15,
    marginTop:10
  },

  textImageEmail:{
    width:18,
    height:13,
    marginTop:10
  },
  textImageUser:{
    width:17,
    height:16,
    marginTop:10
  },
  ctaImageBiker:{
    width:40,
    height:45
  },
  avatar:{
    width:110,
    height:110,
    borderRadius:55,
    overflow:'hidden'
  },
  formControl:{
    borderBottomWidth:1,
    borderBottomColor:color.select.light,
    flexDirection:'row',
    marginTop:10
  },
  input:{
    width:deviceWidth-90,
    color:color.select.black,
   fontSize: Sizer.fontSizer(13),
    paddingTop:10,
    paddingBottom:10,
  },
  form:{
    marginLeft:30,
    marginRight:30,
    marginBottom:100
  },
  submit:{
    marginTop:50, 
    marginBottom:30,
    borderRadius: 5,
    backgroundColor: color.select.blue,
    flexDirection:'row',
    justifyContent:'center',
    alignItem:'center', 
    paddingTop:15,
    paddingBottom:15,
  },
  submitText:{
    color:color.select.white
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
  },
  backButton:{
    width:20,
    height:15,
    marginTop:10,
    marginLeft:20,
  }
 
};
