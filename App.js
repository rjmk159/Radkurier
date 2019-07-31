import React from 'react';
import { Scene, Router, Stack } from 'react-native-router-flux';
import Login from './src/Screens/Login/'
import RouterScreen from './src/Screens/RouteScreen'
import AdminScreen from './src/Screens/AdminScreen'
import ProfileScreen from './src/Screens/ProfileScreen'
import {AsyncStorage} from 'react-native';
import { connect, Provider } from 'react-redux';
import store from './store';

const RouterWithRedux = connect()(Router);

class App extends React.Component{
state={ type : -1 }
componentWillMount(){
  this._retrieveData();
}
_retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('MyradkurierAppLoginkey');
    let obj = JSON.parse(value);
    if (value !== null) { 
      if(obj.user_role.includes('administrator')){
        this.setState({type:1,value:obj})
      } else if(obj.user_role.includes('radBiker')){
        this.setState({type:2,value})
      } else{
        this.setState({type:0})
      }
    }
  } catch (error) {
      this.setState({type:0})
  }
};
 render(){
   return(
    <Provider store={store}> 
      <RouterWithRedux>
        <Stack key="root">
          <Scene key="login" component={Login} initial={this.state.type === 0 ? true : false}  title="Register"/>
          <Scene key="admin" component={AdminScreen} initial={this.state.type === 1 ? true : false} token={this.state.value?this.state.value.token:''}  title="Admin"/>
          <Scene key="route" component={RouterScreen} initial={this.state.type === 2 ? true : false} title="Tracking"/>
          <Scene key="profile" component={ProfileScreen}  title="Profile"/>
        </Stack>
      </RouterWithRedux>
    </Provider>
   )
 }

}

export default App;
