import React from 'react';
import { StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RecordData from './screens/RecordData';
import PastRecords from './screens/PastRecords';
import ZipScreen from './screens/ZipScreen';

import "firebase/database";
import * as Analytics from 'expo-firebase-analytics';

// Gets the current screen from navigation state
const getActiveRouteName = state => {
  const route = state.routes[state.index];
  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }
  return route.name;
};

const Stack = createStackNavigator();

export default function App() {

  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  React.useEffect(() => {
    const state = navigationRef.current.getRootState();

    // Save the initial route name
    routeNameRef.current = getActiveRouteName(state);
  }, []);

  const Stack = createStackNavigator();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
      <NavigationContainer 
        ref={navigationRef}
        onStateChange={(state) => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = getActiveRouteName(state);
          if (previousRouteName !== currentRouteName) {
            Analytics.setCurrentScreen(currentRouteName, currentRouteName);
          }
        }}
      >
          <Stack.Navigator screenOptions={navStyling}>

            <Stack.Screen name="List Data" component={PastRecords} /> 
            <Stack.Screen name="Add Bill" component={RecordData} />
            <Stack.Screen name="Location" component={ZipScreen} />
            
          
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const navStyling = {
  headerStyle: {
    backgroundColor: '#0065A4',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D3D4C5',
    flex: 1,
    justifyContent: 'center',
  },
});
