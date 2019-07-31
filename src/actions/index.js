

import api from '../utils/ApiServices';
import {AsyncStorage} from 'react-native';
export const getToken = (token) => ({
    type: 'GET_TOKEN',
    token,
});
export function saveUser(details) {
    return (dispatch) => {
      dispatch(saveUserDetails(details));
    };
}
export function saveUserDetails(details) {
    return {
      type: 'SAVE_USER',
      details
    };
}


  export  function getUserDetails(id = '',token,callback = ()=>{}){
    return (dispatch) => {
        api.get(`wp-json/wp/v2/users${id?"/"+id :''}?context=edit`, `Bearer ${token}`)
            .then((response) => {
                let _obj = {
                    user_nicename : response.data.name,
                    city :response.data.city,
                    phone : response.data.phone,
                    user_email :response.data.email,
                    avatar:response.data.avatar_urls[96],
                    user_id:response.data.id,
                    currentStatus:response.data.currentStatus!==''?response.data.currentStatus : 2,
                    trackingId:response.data.trackingId,
                    token,
                }
                dispatch(saveUserDetails(_obj));
                callback();
            })
        .catch((err) => {
        
        })
    };
  }

