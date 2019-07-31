import { showMessage, hideMessage } from "react-native-flash-message";
let Helper = {};

Helper.showTopErrorMessage=(message,type)=>{
    showMessage({
        message,
        type,
      });
}
Helper.cleanString = (string) => {
  const regex = /(<([^>]+)>)/ig;
  return  string.replace(regex, '').replace('ERROR:', '').replace('Lost your password?','').trim();
}
export default Helper;