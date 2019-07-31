import React, { Component } from "react";
import { View, Image,TextInput,ImageBackground,TouchableOpacity,Text} from "react-native";
import images from '../../assets/images/images';
import styles from "./styles";
import { strings} from '../../utils/strings'
import color from '../../utils/color'

class Login extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
    super(props);
    this.state = {
      admin:true
    }
  }
  render() {
    return (
    <ImageBackground
      accessibilityRole={'image'}
      source={images.theme1.mainBackground}
      style={styles.background}
      imageStyle={styles.logo}
      >
      <View style={styles.overlay}/>  
          <View style={{justifyContent:'center',alignItems:'center',marginBottom:50}}>
          <Image source={images.theme1.logo}  style={styles.logoIcon}/>
          </View>
          <View style={styles.formControl}>
                <Image  style={styles.imageIconEmail} source={images.theme1.emailIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={strings.LoginEmail}
                  keyboardType={'email-address'}
                  placeholderTextColor={color.select.white}
                  onChangeText={(text) => this.setState({text})}
                />
            </View>
            <View style={styles.formControl}>
                <Image  style={styles.imageIcon} source={images.theme1.passwordIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={strings.LoginPassword}
                  placeholderTextColor={color.select.white}
                  onChangeText={(text) => this.setState({text})}
                />
            </View>
            <View style={styles.formLink}>
              <TouchableOpacity><Text style={styles.formLinkText}>{strings.LoginForgotPassword}</Text></TouchableOpacity>

            </View>
            <View style={styles.formSubmit}>
                <TouchableOpacity style={styles.submit}
                  onPress={() => this.props.navigation.navigate('AdminScreen')} 
                >
                  <Text style={styles.submitText}>{strings.LoginCta}</Text>
                  </TouchableOpacity>
            </View>
  
    </ImageBackground>

      
    );
  }
}



export default Login;
