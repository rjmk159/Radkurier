import React, { Component } from "react";
import { View, Text,TouchableOpacity,FlatList,ActivityIndicator,Dimensions,Alert,ScrollView,Image} from "react-native";
import styles from "./styles";
import { connect } from 'react-redux';
import api from '../../utils/ApiServices.js';
import Helper from "../../utils/Helper";
import { Actions} from 'react-native-router-flux';
const {height} = Dimensions.get('window')
import images from '../../assets/images/images'
import color from '../../utils/color';
import {AsyncStorage} from 'react-native';

logout = async () => {
  try {
    await AsyncStorage.removeItem('MyradkurierAppLoginkey');
    Actions.login();
  }
  catch(exception) {
    Actions.login();
    return false;
  }
}
class AdminScreen extends Component {
  constructor(props){
    super(props);
    this.state = { 
      isloading:true,
      index:-1,
      pullLoader:false
    }
  }
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: color.select.primary,
      paddingBottom:20
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
      <Text style={{width:'20%'}}/>
    ),
  };


  goBack(){
    Actions.login()
  }

  componentDidMount(){
    this.getBikers(false);
  }
  getBikers(pullRefresh = false ){
    if(pullRefresh){
      this.setState({pullLoader:true})
    } else{
      this.setState({isloading:true})
    }
    let _token = this.props.token && this.props.token!=='' ?this.props.token : this.props.navigation.state.params && this.props.navigation.state.params.token ?this.props.navigation.state.params.token:'';
    api.get(`wp-json/wp/v2/users?per_page=2000&context=edit`, `Bearer ${_token}`)
    .then((response) => {
      if(response.data && response.status === 200){
        console.log(response.data,">>>>>>>>")
        let _bikers = response.data.filter((value) => value && value.roles.includes('radBiker') && !value.roles.includes('adminstrator'))
        this.setState({users:_bikers},()=>{
          this.setState({isloading:false, pullLoader:false})
        })
      }
    })
    .catch((err) => {
      Helper.showTopErrorMessage('Something went wrong while fetching data','danger')
          this.setState({isloading:false,pullLoader:false})
    })
  }
  deleteUser(id,trackingId){
    let body = {reassign:1, force:true}
    let _token = this.props.token && this.props.token!=='' ?this.props.token : this.props.navigation.state.params && this.props.navigation.state.params.token ?this.props.navigation.state.params.token:'';
    api.delete(`wp-json/wp/v2/users/${id}`,body, `Bearer ${_token}`)
    .then((response) => {
      if(response.data && response.data.deleted === true){
        let deletedUser = response.data.previous ? response.data.previous.username :'biker' 

        this.unavailable(trackingId,_token)
      } else {
        Helper.showTopErrorMessage('Something went wrong while deleting','danger')
      }
    })
    .catch((err) => {

          this.setState({isloading:false,pullLoader:false})
    })
  }
  unavailable(id,_token){
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
        api.post(`wp-json/wp/v2/biker/${id}`, body, `Bearer ${_token}`)
        .then((response) => {
          if(response.data && response.data.id){
            setTimeout(() => {
            api.delete(`wp-json/wp/v2/biker/${id}`,_body, `Bearer ${_token}`)
            .then((response) => {
              if(response.data){
                Helper.showTopErrorMessage(`Biker deleted successfully`,'success');
              this.getBikers();
              } 
             })
            }, 1200);
          } 
        })
        .catch((error) => {
          this.setState({showLoader:false})
              Helper.showTopErrorMessage('Something went wrong', 'danger');
        })

        this.setState({isloading:false,pullLoader:false})
      } else{
        Helper.showTopErrorMessage(`Biker deleted successfully`,'success');
        this.getBikers();
      }
    
  } catch (error) {
    Helper.showTopErrorMessage('Something went wrong', 'danger');
    }
  }
  showConfirmation(id,trackingId){
    Alert.alert(
      'Are you sure?',
      'you want to delete this biker',
      [
        {
          text: 'No',
          onPress: () => {return},
          style: 'cancel',
        },
        {text: 'Yes', onPress: () =>this.deleteUser(id,trackingId)},
      ],
      {cancelable: false},
    );
  }

  _renderItem(item,index){
   _index = this.state.index
    return(<View key ={index} style={styles.listContainer}>
      <TouchableOpacity onPress={()=>{this.setState({index:_index === index ? -1:index})}}>
        <Text style={[styles.name, index === this.state.index ? { paddingBottom:10 } : {}]}>BIKER "{item.name}"</Text>
       </TouchableOpacity>  
       { index === this.state.index ? <View style={styles.details}>
          <Text style={styles.details}>Name : {item.name}</Text>
          <Text style={styles.details}>Stadt : {item.city ? item.city:'Not updated'}</Text>
          <Text style={styles.details}>Email : {item.email}</Text>
          <Text style={styles.details}>Telefon : {item.phone ? item.phone:'Not updated'}</Text>
          <View style={{flexDirection:'row',justifyContent:'space-between',paddingTop:10}}>
            {/* <TouchableOpacity style={styles.requestPwd}>
              <Text style={styles.requestPwdText}>Neues Passwort anfordern</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.clearCta} onPress={()=>{this.showConfirmation(item.id,item.trackingId)}}>
              <Text style={styles.clearText}>LÖSCHEN</Text>
            </TouchableOpacity>
          </View>
        </View> : null }
    </View>);
  }

  render() {
    console.log('JUNAID',this.props)
    return (
          this.state.isloading?(<View style={{height:height * 0.7,flex:1,alignItems:"center",justifyContent:'center'}}>
            <ActivityIndicator size="large" />
           </View>):
          this.state.users && this.state.users.length > 0 ?
              <View style={{marginBottom:50,minHeight:height - 200}}>
                <FlatList
                  onRefresh={() => this.getBikers(true)}
                  refreshing={this.state.pullLoader}
                  data={this.state.users}
                  keyExtractor={(item) => item.id}
                  removeClippedSubviews
                  renderItem={({item,index})=>this._renderItem(item,index)}
                />
             </View>
              :<View style={{height:height - 80,paddingTop:0,alignItems:'center',justifyContent:'center'}}>
                <TouchableOpacity onPress={()=>{this.getBikers(false)}}>
                <Image style={{opacity:0.7,marginBottom:20}} source={images.theme1.refresh}/> 
                </TouchableOpacity> 
                <Text>No Bikers available</Text>
              </View>

              ) }     
        }

const mapStateToProps = state => ({
  token: state.userDetails.token,
});

export default connect(mapStateToProps, {})(AdminScreen);

