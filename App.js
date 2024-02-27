import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import SplashScreen from './src/components/Splash.js';
import LoginScreen from './src/components/Login.js';
import TournamentsScreen from './src/components/Tournaments.js';
import EventsScreen from './src/components/Events.js';
import PhasesScreen from './src/components/Phases.js';
import GroupsScreen from './src/components/Groups.js';
import SetsScreen from './src/components/Sets.js';

const linking = {
  prefixes: ['tournamentmanager://'],
  config: {
    screens: {
      LoginScreen: 'login',
    },
  },
};

export default function App() {
  const MyStack = createNativeStackNavigator();

  return (
    <NavigationContainer linking={linking}>
      <MyStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <MyStack.Screen name="SplashScreen" component={SplashScreen} />
        <MyStack.Screen name="LoginScreen" component={LoginScreen} />
        <MyStack.Screen
          name="TournamentsScreen"
          component={TournamentsScreen}
        />
        <MyStack.Screen name="EventsScreen" component={EventsScreen} />
        <MyStack.Screen name="PhasesScreen" component={PhasesScreen} />
        <MyStack.Screen name="GroupsScreen" component={GroupsScreen} />
        <MyStack.Screen name="SetsScreen" component={SetsScreen} />
      </MyStack.Navigator>
    </NavigationContainer>
  );
}
