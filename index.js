/**
 * @format
 */
import React from "react";
import { View } from "react-native";
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import FlashMessage from "react-native-flash-message";
import { Provider } from 'react-redux';
import store from './store';
 class Main extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <View style={{ flex: 1 }}>
              <App/>
            <FlashMessage position="top" /> 
          </View>
        </Provider>
      );
    }
  }
AppRegistry.registerComponent(appName, () => Main);
