
import color from '../../utils/color';
import { Dimensions,Platform } from "react-native";
import Sizer from '../../utils/sizer'

export default {
  listContainer:{
    padding:20,
    margin:2,
    borderWidth:1,
    backgroundColor:'#fff',
    borderColor:color.select.black
  },
  name:{
    fontSize: Sizer.fontSizer(18),
    fontWeight: '500',
    color: '#404040',
  },
  requestPwd:{
    backgroundColor:color.select.blue,
    padding:10,
    paddingLeft:18,
    paddingRight:18
  },
  requestPwdText:{
    color:color.select.white,
    textAlign:'center'
  },
  clearCta:{
    backgroundColor:color.select.red,
    padding:10,
    paddingLeft:18,
    paddingRight:18
  },
  clearText:{
    color:color.select.white,
    textAlign:'center'
  },
  details:{
    paddingBottom:2
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
container: {
  flex: 1,
  // alignItems: 'center',
  // justifyContent: 'center',
}
};
