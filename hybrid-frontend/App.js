import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import BeerList from './screens/BeerList';
import SignUpScreen from './screens/SignUpScreen'; 
import BeerDetailsScreen from './screens/BeerDetailsScreen';
import ReviewScreen from './screens/ReviewScreen'; 
import ReviewListScreen from './screens/ReviewListScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log In' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} /> 
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="BeerSearch" component={BeerList} options={{ title: 'Buscar Cervezas' }} />
        <Stack.Screen name="BeerDetails" component={BeerDetailsScreen} options={{ title: 'Detalles de la Cerveza' }} /> 
        <Stack.Screen name="ReviewScreen" component={ReviewScreen} options={{ title: 'Agregar Reseña' }} />
        <Stack.Screen name="ReviewListScreen" component={ReviewListScreen} options={{ title: 'Ver Reseña' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
