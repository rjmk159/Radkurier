import axios from 'axios';
import { Actions} from 'react-native-router-flux';
import { Alert,AsyncStorage} from "react-native";

let api = {};
var BASE_URL = `http://appdev.psdtohubspot.com`;
//  var BASE_URL = `http://localhost/radkurier/index.php`;
api.BASE_URL = BASE_URL;
api.get = (url,token='') => {
  let headers = {
    'Authorization': token
  }
  return new Promise(function (resolve, reject) {
    axios.get(`${BASE_URL}/${url}`,{headers})
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error)
      })
  });
}

api.postLogin = (url,data) => {
  return new Promise(function (resolve, reject) {
    axios.post(`${BASE_URL}/${url}`,data).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error.response.data)
      })
  });
}

api.post = (url,body,token='') => {
  return new Promise(function (resolve, reject) {
    axios.post(`${BASE_URL}/${url}`, body, {headers: {'Accept': 'application/json','Authorization': token || undefined,}})
    .then(function (response) {
      resolve(response)
    })
    .catch(function (error) {
      reject(error)
    });
  });
}

api.delete = (url,body,token) => {
  return new Promise(function (resolve, reject) {
    axios.delete(`${BASE_URL}/${url}`,
      { headers: {
        Authorization: token
      },
      data:body
      }).then((response) =>{ 
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  });
}

api.logOut = async () => { 
  try {
  const id = await AsyncStorage.getItem('radkurierlocation_id');
  const value = await AsyncStorage.getItem('MyradkurierAppLoginkey');
  let obj = JSON.parse(value);
  let _token = obj.token;
  if(id){
    Alert.alert(
      'Are you sure?',
      'you want to stop tracking',
      [
        {
          text: 'No',
          onPress: () => {return;},
          style: 'cancel',
        },
        {text: 'Yes', onPress: () =>{
          Actions.login();
          let body = {
            status: 'publish',
            user_name: undefined,
            user_phone: undefined,
            user_email: undefined,
            user_status:2,
            user_longitude:undefined ,
            user_latitude:undefined,
            user_image: undefined
          }
          let _body = {force:true}
          api.post(`wp-json/wp/v2/biker/${id}`, body, `Bearer ${_token}`)
          .then((response) => {
            if(response.data && response.data.id){
              setTimeout(() => {
              api.delete(`wp-json/wp/v2/biker/${id}`,_body, `Bearer ${_token}`)
              .then((response) => {
                if(response.data){
                  console.log(response)
                } 
              })
              }, 1200);
            } 
          })
          .catch((error) => {
            Actions.login();
          })

        }},
      ],
      {cancelable: false},
    );
  } else{
    Actions.login();
  }
  }
  catch(exception) {
    Actions.login();
  }
  await AsyncStorage.removeItem('MyradkurierAppLoginkey');

}

export default api;
