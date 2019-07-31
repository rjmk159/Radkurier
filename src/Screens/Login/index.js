import React, { Component } from "react";
import { View, Image, TextInput, ImageBackground, TouchableOpacity, Text, ActivityIndicator, KeyboardAvoidingView, Linking} from "react-native";
import images from '../../assets/images/images';
import styles from "./styles";
import { strings} from '../../utils/strings'
import color from '../../utils/color'
import api from '../../utils/ApiServices.js';
import Helper from "../../utils/Helper";
import { saveUser } from '../../actions';
import { connect } from 'react-redux';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Actions} from 'react-native-router-flux';
import {AsyncStorage} from 'react-native';

class Login extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
    super(props);
    this.state = {
      userDetails:'',
      password:'',
      username:'',
      modalVisible:false
    }
  }
  _storeData = async (data) => {
    try { 
      let obj = JSON.stringify(data);
      await AsyncStorage.setItem('MyradkurierAppLoginkey', obj );
    } catch (error) {
   return
    }
  };
  _login(){
    let body = {
      username: this.state.username,
      password:this.state.password
    };
    if(this.state.username ===''){
      Helper.showTopErrorMessage('Email is required field*','danger');
      return;
    } else if(this.state.password===''){
      Helper.showTopErrorMessage('Password is required field','danger');
      return;
    } 
    this.setState({modalVisible:true})
    api.postLogin(`wp-json/jwt-auth/v1/token`, body)
    .then((response) => {
      if(response.data && response.data.token!=='' && response.status===200){
        this.props.saveUser(response.data)
        this.setState({userDetails:response.data},()=>{
          this.setState({modalVisible:false})
        })
        if(response.data.user_role.includes('administrator')){
          this._storeData(response.data)
          Actions.admin({token:response.data.token});
        } else if( response.data.user_role.includes('radBiker')){
          this._storeData(response.data)
          Actions.route();
        } else {
          Helper.showTopErrorMessage('Sorry, you are not allowed to access','danger')
        }
      } else {
        this.setState({modalVisible:false})
        Helper.showTopErrorMessage('Username or Password is incorrect','danger')
      }
    })
    .catch((err) => {
      this.setState({modalVisible:false})
      let result = Helper.cleanString(err.message)
      Helper.showTopErrorMessage(result,'danger')
    })
  }


  resetPassword(){
    Linking.canOpenURL(api.BASE_URL).then(supported => {
      if (supported) {
        Linking.openURL(`${api.BASE_URL}/wp-login.php?action=lostpassword`);
      } else {
        return;
      }
    });
   
  }
  render() {
    return (
    <ImageBackground
      accessibilityRole={'image'}
      source={images.theme1.mainBackground}
      style={styles.background}
      imageStyle={styles.logo}
      >
      <KeyboardAvoidingView style={{flex:1}} behavior={"position"}>

      <Dialog
        visible={this.state.modalVisible}
        onTouchOutside={() => {
          this.setState({ modalVisible: true });
        }}>
      
           <DialogContent style={{padding:30}}>
           <ActivityIndicator size="large" />
              <Text>Please wait...</Text>
          </DialogContent>
        </Dialog>
        
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
                  autoCapitalize = 'none'
                  placeholderTextColor={color.select.white}
                  onChangeText={(text) => this.setState({username:text})}
                />
            </View>
            <View style={styles.formControl}>
                <Image  style={styles.imageIcon} source={images.theme1.passwordIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={strings.LoginPassword}
                  autoCapitalize = 'none'
                  secureTextEntry={true}
                  placeholderTextColor={color.select.white}
                  onChangeText={(text) => this.setState({password:text})}
                />
            </View>
            <View style={styles.formLink}>
              <TouchableOpacity
               onPress={() => this.resetPassword()} 
              ><Text style={styles.formLinkText}>{strings.LoginForgotPassword}</Text></TouchableOpacity>

            </View>
            <View style={styles.formSubmit}>
                <TouchableOpacity style={styles.submit} onPress={()=>{this._login()}}>
                  <Text style={styles.submitText}>{strings.LoginCta}</Text>
                </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
    </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  userDetails:state.userDetails

});

export default connect(mapStateToProps, {saveUser})(Login);

