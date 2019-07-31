
import color from '../../utils/color'
import Sizer from '../../utils/sizer'
import { Dimensions,Platform } from "react-native";
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  background: {
    paddingBottom: 40,
    paddingTop: 60,
    paddingHorizontal: 32,
    backgroundColor: color.select.lighter,
    height:deviceHeight,
    position:'relative'
  },
  logo: {
    overflow: 'visible',
    resizeMode: 'cover',
    flex:1,
    marginLeft: 0,
    marginBottom: -192,
  },
  overlay:{
    position:'absolute',
    background:'red',
  },
  logoIcon:{
    width:210,
    height:120,
    zIndex:Platform.OS === 'ios' ? -1 : 0,
    marginTop:20
  },
  formControl:{
    borderBottomWidth:1,
    borderBottomColor:color.select.white,
    flexDirection:'row',
    marginTop:Platform.OS === 'ios' ? 50 : 25,
  },
  imageIcon:{
    width:20,
    height:20,
    marginBottom:10,
    marginRight:10,
    position:'relative',
    top:Platform.OS === 'ios' ? 0 : 16
  },
  imageIconEmail:{
    width:Platform.OS === 'ios' ? 22 : 23,
    height:Platform.OS === 'ios' ? 16 : 18,
    marginBottom:Platform.OS === 'ios' ? 10 : 0,
    marginRight:10,
    position:'relative',
    top:Platform.OS === 'ios' ? 0 : 16
  },
  input:{
    width:deviceWidth,
    color:color.select.white,
    fontSize: Sizer.fontSizer(15),
    paddingBottom:10,
  },
  formLink:{
    marginTop:30
  },
  formSubmit:{
    marginTop:30,
  },
  formLinkText:{
    textAlign:'right',
    color:color.select.yellow
  },
  submit:{
    borderRadius: 10,
    backgroundColor: color.select.primary,
    flexDirection:'row',
    justifyContent:'center',
    alignItem:'center', 
    paddingTop:20,
    paddingBottom:20
  },
  submitText:{
    color:color.select.white
  },
  dropdown:{
    width:200,  
  }
};
