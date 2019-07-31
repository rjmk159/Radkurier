import React, { Component } from "react";
import { View, Text,Image,TouchableOpacity,TextInput,KeyboardAvoidingView,ActivityIndicator,Dimensions} from "react-native";
import images from '../../assets/images/images'
import color from '../../utils/color'
import styles from "./styles";
import { strings} from '../../utils/strings';
import AppOverlay from '../../AppOverlay'
import { connect } from 'react-redux';
import Helper from "../../utils/Helper";
import { saveUser,getUserDetails } from '../../actions';
import api from '../../utils/ApiServices.js';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Actions} from 'react-native-router-flux';
let MAIL_FORMAT = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/

import {AsyncStorage} from 'react-native';

logout = () => {
 api.logOut();
}

class ProfileScreen extends Component {
  constructor(props){
    super(props);
    this.state = { 
      username:'',
      city:'',
      phone:'',
      email:'',
      id:-1,
      username:'',
      avatat:'',
      mailEdited:false,
      modalVisible:false
    }
  }

  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: color.select.primary,
      paddingBottom:20,
    },
    headerTintColor: '#fff',
    headerTitle: (
      <Image style={styles.logo} source={images.theme1.miniLogo} />
    ),
    headerRight: (
      <TouchableOpacity
       onPress={()=>{logout()}}>
        <Image style={styles.lgButton} source={images.theme1.logout} />
     </TouchableOpacity>
    ),
    headerLeft: (
      <TouchableOpacity
       onPress={()=>{Actions.route()}}>
        <Image style={styles.backButton} source={images.theme1.backIcon} />
     </TouchableOpacity>
    ),
  };
  goBack(){
    Actions.route()
  }
  componentDidMount(){
    this.getUserDetailsFromlocalStorage();
    let details = this.props.userDetails;
    console.log("PROPS",details)
    this.setState({
      city:details.city,
      phone:details.phone,
      username:details.user_nicename,
      email:details.user_email,
      avatar:details.avatar,
      id:details.user_id
    })
  }
  getUserDetailsFromlocalStorage = async () => {

    try {
      const value = await AsyncStorage.getItem('MyradkurierAppLoginkey');
      let obj = JSON.parse(value);
      if (obj) { 
        this.props.getUserDetails(obj.user_id, obj.token,()=>{
          this.setDetails();
          this.setState({showLoader:false})
        })
      }
    } catch (error) {
    }
  };
  _updateUser(){
    if(this.state.city===''){
            Helper.showTopErrorMessage('City is required field', 'danger');
      return
     } else if(this.state.phone===''){
            Helper.showTopErrorMessage('Phone is required field', 'danger');
        return;
    } else if(this.state.email===''){
            Helper.showTopErrorMessage('Email is required field', 'danger');
      return;
    } else if(this.state.mailEdited && !this.state.email.match(MAIL_FORMAT)){
            Helper.showTopErrorMessage('Email is not valid', 'danger');
      return;
    } else {
      this.setState({modalVisible:true})
      let body = {
        city:this.state.city,
        phone:this.state.phone,
        email:this.state.email,
      }
      let _token = this.state.token || this.props.userDetails.token;
      api.post(`/wp-json/wp/v2/users/${this.props.userDetails.user_id}`, body, `Bearer ${_token}`)
      .then((response) => {
        if(response.data && response.status === 200){
              Helper.showTopErrorMessage('Updated Successfully', 'success');
              let _obj = {
                user_nicename : response.data.name,
                city :response.data.city,
                phone : response.data.phone,
                user_email :response.data.email,
                avatar:response.data.avatar_urls[96],
                user_id:response.data.id,
                currentStatus:response.data.currentStatus!=''?response.data.currentStatus:'',
                trackingId:response.data.trackingId,
                token:_token,
            }

            this.props.saveUser(_obj)
        } else {
              Helper.showTopErrorMessage('Updated unsuccessfully', 'danger');
        }
        this.setState({modalVisible:false})
      })
      .catch((err) => {
            Helper.showTopErrorMessage('Updated unsuccessfully', 'danger');
            this.setState({modalVisible:false})
      })
    }
  }
  logout(){
    Actions.login();
  }
  getUserDetailsFromlocalStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('MyradkurierAppLoginkey');
      let obj = JSON.parse(value);
      if (obj) { 
        this.props.getUserDetails(obj.user_id, obj.token)
      }
    } catch (error) {
      return;
    }
  };
  render() {
    let details = this.state
    return (
        <AppOverlay>
          <KeyboardAvoidingView behavior="position">
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
          <View style={{justifyContent:"center",}}>
          <View style={styles.ctaOuterContainer}>
            <View style={styles.ctaContainer}>
              {this.state.avatar?<Image style={styles.avatar} source={{uri: this.state.avatar}} />:<Image style={styles.ctaImageBiker} source={images.theme1.bikerIcon}/>}
            </View>
            <Text>{strings.ProfileScreenTitle}</Text>
          </View>
         
          <View style={styles.form}>
            <View style={styles.formControl}>   
                    <TextInput
                      style={styles.input}
                      placeholder={strings.ProfileScreenSelect}
                      placeholderTextColor={color.select.dark}
                      defaultValue={details.city}
                      onChangeText={(city) => this.setState({city})}
                    />
                </View>
                <View style={styles.formControl}>
                    <TextInput
                      style={styles.input}
                      placeholder={strings.ProfileScreenNumber}
                      keyboardType={'phone-pad'}
                      placeholderTextColor={color.select.dark}
                      defaultValue={details.phone}
                      onChangeText={(phone) => this.setState({phone})}
                    />
                      <Image style={styles.textImage} source={images.theme1.telBlack}/>
                </View>
                <View style={styles.formControl}>
                    <TextInput
                      style={styles.input}
                      placeholder={strings.ProfileScreenEmail}
                      keyboardType={'email-address'}
                      placeholderTextColor={color.select.dark}
                      defaultValue={details.email}
                      onChangeText={(email) => this.setState({email,mailEdited:true})}
                    />
                      <Image style={styles.textImageEmail} source={images.theme1.emailBlack}/>
                </View>
                <View style={styles.formControl}>
                    <TextInput
                      style={styles.input}
                      placeholder={strings.ProfileScreenUserName}
                      editable = {false}
                      placeholderTextColor={color.select.dark}
                      defaultValue={details.username}
                      onChangeText={(username) => this.setState({username})}
                    />
                        <Image style={styles.textImageUser} source={images.theme1.userBlack}/>
                </View>
                <View style={styles.formSubmit}>
                    <TouchableOpacity style={styles.submit}
                      onPress={() => this._updateUser()} 
                    >
                      <Text style={styles.submitText}>{strings.ProfileScreenCta}</Text>
                      </TouchableOpacity>
                </View>
            </View>
          </View>
          </KeyboardAvoidingView>
        </AppOverlay>

      
    );
  }
}


const mapStateToProps = state => ({
  userDetails:state.userDetails
});



export default connect(mapStateToProps, {saveUser,getUserDetails})(ProfileScreen);