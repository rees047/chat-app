import React, { Component } from 'react';
// import react native gesture handler
import 'react-native-gesture-handler';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator
const Stack = createStackNavigator();

export default class App extends Component {

  render(){
    return (
      <NavigationContainer>
        {/* rest of the code */}
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen name="StartScreen" component={Start} />
          <Stack.Screen name="ChatScreen" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  
}