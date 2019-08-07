import React, { Component } from "react";
import { View,Image,TouchableOpacity,Text,PermissionsAndroid,ToastAndroid,Platform,ActivityIndicator,NativeModules} from "react-native";
import images from '../../assets/images/images'
import styles from "./styles";
import AppOverlay from '../../AppOverlay'
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import RadioForm from 'react-native-simple-radio-button';
import { connect } from 'react-redux';
import color from '../../utils/color'
import { Actions} from 'react-native-router-flux';
import api from '../../utils/ApiServices.js';
import Helper from "../../utils/Helper";
import Geolocation from 'react-native-geolocation-service';
import {AsyncStorage} from 'react-native';
import { saveUser,getUserDetails } from '../../actions';
import KeepAwake from 'react-native-keep-awake';
let count = 0;
logout =  () => {
  api.logOut();
}

class RouteScreen extends Component {
  watchId = null;
  constructor(props){
    super(props);
    this.state = {
      modalVisible:false,
      showLoader:false,
      label:'',
      currentStatus:2,
      keepawake:false,
      radio_props : [
        {label: 'Available', value: 0 },
        {label: 'Available on Tour', value: 1 },
        {label: 'Unavailable', value: 2 }
      ],
    }
  }
  componentWillMount(){
    this.setState({showLoader:true})
  }
  componentDidMount(){
    this.getUserDetailsFromlocalStorage();
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
      } else {
        Actions.login();
      }
    } catch (error) {
      Actions.login();
    }
  };
 
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
      <Text style={{width:'20%'}} />
    ),
  };
  setDetails(){
    let details =  this.props.userDetails;
    this.setState({
      token:details.token,
      userId:details.user_id,
      currentStatus:Number(details.currentStatus),
      trackingId:details.trackingId,
      label:this.state.radio_props[details.currentStatus!=''?details.currentStatus:2].label
    })
  }
  componentWillReceiveProps(nextProps){
    let details = nextProps.userDetails;
    this.setState({
      token:details.token,
      userId:details.user_id,
      currentStatus:Number(details.currentStatus!=''?details.currentStatus:2),
      trackingId:details.trackingId,
      label:this.state.radio_props[details.currentStatus!='' ? details.currentStatus:2].label
    })
  }
  toggleModal() {
    this.setState({ modalVisible: true });
  }

  // Location Methods

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  }
  getLocation = async (status) => {
    console.log(status)
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission){
      this.setState({modalVisible:false,showLoader:false});
      return;
    }
    this.setState({
      currentStatus:status,
      modalVisible:false,
      showLoader:true,
      label:this.state.radio_props[status].label},()=>{
      if (this.watchId !== null) {
        Geolocation.clearWatch(this.watchId);
      }
      this.getLocationUpdates(status)
    })
  }
  getLocationUpdates = async (status) => {
    this.setState({keepawake:true},()=>{
      this.changeKeepAwake()
    })
    console.log("sdasdasda",status)
      this.watchId = Geolocation.watchPosition(
         (position) => {
          console.log("HOW MANY TIMES")
          this.availableOrOnTour(position.coords.longitude,position.coords.latitude,status,this.state.trackingId);
        },
        (error) => {
          this.setState({ location: error });
        },
        { enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 2000 }
      );
        this.setState({showLoader:false,})
    }
  removeLocationUpdates = async (status) => {
    this.setState({
      currentStatus:status,
      modalVisible:false,
      showLoader:true,
      label:this.state.radio_props[status].label,
      trackingId:'',
      keepawake:false
    },()=>{
      this.changeKeepAwake();
    })
      if (this.watchId !== null) {
          this.unavailable(this.state.trackingId)
          Geolocation.clearWatch(this.watchId);
      }
      this.setState({showLoader:false})
  }
   availableOrOnTour(longitude, latitude,currentStatus, id){
     console.log(">>>>>>>>>>>>>>",count++)
    let details = this.props.userDetails
    let body = {
      status:'publish',
      user_name:id ? undefined : details.user_nicename,
      user_phone:id ? undefined : details.phone,
      user_email:id ? undefined : details.user_email,
      user_status:currentStatus,
      user_longitude:longitude,
      user_latitude:latitude,
      user_image:id ? undefined : details.avatar
    }
    api.post(`wp-json/wp/v2/biker/${id}`, body, `Bearer ${this.state.token || this.props.token}`)
    .then((response) => {
      if(response.data && response.data.id){
        console.log(response.data)
        this.updatingStatus(currentStatus,response.data.id,true)
      } 
    })
    .catch((error) => {
      this.setState({showLoader:false})
      // Helper.showTopErrorMessage('Something went wrong', 'danger');
    })
  }
   unavailable(id){
    let details = this.props.userDetails
    let _token = details.token;
    try {
    let body = {
      status : 'publish',
      user_name : undefined ,
      user_phone : undefined,
      user_email : undefined,
      user_status : 2,
      user_longitude:undefined,
      user_latitude:undefined,
      user_image:undefined,
    }
      if(id && id!==''){
        let _body = {force:true}
        api.post(`wp-json/wp/v2/biker/${id}`, body, `Bearer ${this.state.token || this.props.token}`)
        .then((response) => {
          if(response.data && response.data.id){
            setTimeout(() => {
            api.delete(`wp-json/wp/v2/biker/${id}`,_body, `Bearer ${_token}`)
            .then((response) => {
              if(response.data){
                this.updatingStatus(2,'')
              } 
             })
            }, 1200);
          } 
        })
        .catch((error) => {
          this.setState({showLoader:false})
              Helper.showTopErrorMessage('Something went wrong', 'danger');
        })
      }
      Helper.showTopErrorMessage('Tracking beendet', 'danger');
    
  } catch (error) {
    Helper.showTopErrorMessage('Something went wrong', 'danger');
    }
  }
  logout(){
    Actions.login();
  }
  updatingStatus(status = undefined,trackingId = undefined){
    let body = {
      currentStatus : status,
      trackingId:trackingId
    }
    api.post(`/wp-json/wp/v2/users/${this.state.userId}`, body, `Bearer ${this.state.token || this.props.token}`)
    .then((response) => {
      if(response.data  && response.status === 200){
        let _obj = {
          user_nicename : response.data.name,
          city :response.data.city,
          phone : response.data.phone,
          user_email :response.data.email,
          avatar:response.data.avatar_urls[96],
          user_id:response.data.id,
          currentStatus:response.data.currentStatus!=='' ? response.data.currentStatus : 2,
          trackingId:response.data.trackingId,
          token:this.state.token || this.props.token,
      }
      this.props.saveUser(_obj)
      } 
    })
    .catch((err) => {
      this.setState({showLoader:false})
      Helper.showTopErrorMessage(err.response.message, 'danger');
    })
  }
  changeKeepAwake = () =>{
    if(this.state.keepawake){
      this.state.keepawake = false;
      KeepAwake.activate();
      console.log('JUNAID')
    }else{
      this.state.keepawake = true;
      KeepAwake.deactivate();
      console.log('khan')
    }
  }
  render() {
    
    console.log(this.props,this.state,NativeModules,'state')
    return (
      <AppOverlay height>
        <Dialog
          visible={this.state.modalVisible && !this.state.showLoader}
          onTouchOutside={() => {
            this.setState({ modalVisible: false });
          }}>
            <DialogContent style={{padding:30}}>
              <RadioForm
                radio_props={this.state.radio_props}
                initial={this.state.currentStatus}
                animation={true}
                onPress={(value) => {
                   value == 2 ? this.removeLocationUpdates(value) : this.getLocation(value); 
                }}
              />
          </DialogContent>
        </Dialog>
        <Dialog
          visible={!this.state.modalVisible && this.state.showLoader}
          onTouchOutside={() => {
            this.setState({ modalVisible: false });
          }}>
            <DialogContent style={{padding:30}}>
              <ActivityIndicator size="large" />
              <Text>Please wait...</Text>
            </DialogContent>
        </Dialog>
        <Image
            accessibilityRole={'image'}
            style={styles.background}
            imageStyle={styles.logo}
            source={images.theme1.servicePageImage} />
          <View style={{flexDirection:'row',justifyContent:'space-around',margin:20,marginTop:100}}>
            <Text style={{position:'absolute',top:-50,textAlign:'center',left:0,right:0,fontWeight:'bold',color:color.primary }}>{this.state.label || 'Unavailable'}</Text>
            <TouchableOpacity 
              onPress={()=>{this.toggleModal(true)}}
              style={styles.ctaContainer}>
              <Image style={styles.ctaImage} source={images.theme1.trackIcon}/>
              <Text style={{fontSize:12,paddingTop:10}}>Tracking Starten</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctaContainer}
              onPress={() => Actions.profile() } 
            >
              <Image style={styles.ctaImageBiker} source={images.theme1.bikerIcon}/>
              <Text style={{fontSize:12,paddingTop:10}}>Profil Bearbeiten</Text>
            </TouchableOpacity>
          </View>
        </AppOverlay>
    );
  }
}
const mapStateToProps = state => ({
  token: state.userDetails.token,
  userDetails:state.userDetails

});
export default connect(mapStateToProps, {saveUser,getUserDetails})(RouteScreen);
