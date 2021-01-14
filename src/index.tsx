import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './interfaces/navigation';
import MainContextProvider from './store/MainProvider';
import {navigationRef} from './helpers/RootNavigation';
import Entrance from './screens/Entrance';
import Home from './screens/Home';
import Call from './screens/Call';
import Users from './screens/Users';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <MainContextProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator headerMode="none" initialRouteName="Entrance">
          <Stack.Screen name="Entrance" component={Entrance} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Users" component={Users} />
          <Stack.Screen name="Call" component={Call} />
        </Stack.Navigator>
      </NavigationContainer>
    </MainContextProvider>
  );
}
