import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import BeerList from './screens/beer/BeerList';
import SignUpScreen from './screens/SignUpScreen'; 
import BeerDetailsScreen from './screens/beer/BeerDetailsScreen';
import ReviewScreen from './screens/review/ReviewScreen'; 
import ReviewListScreen from './screens/review/ReviewListScreen';
import UserList from './screens/user/UserList'; 
import EventList from './screens/event/EventList'; 
import UserDetail from './screens/user/UserDetail';
import EventDetail from './screens/event/EventDetails';
import EventImagesScreen from './screens/event/EventImagesScreen'; 
import Feed from './screens/Feed';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Feed" component={Feed} options={{ title: 'Feed' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Log In' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} /> 
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="BeerSearch" component={BeerList} options={{ title: 'Buscar Cervezas' }} />
        <Stack.Screen name="BeerDetails" component={BeerDetailsScreen} options={{ title: 'Detalles de la Cerveza' }} /> 
        <Stack.Screen name="UserDetails" component={UserDetail} options={{ title: 'Ver amigo' }} />
        <Stack.Screen name="EventImages" component={EventImagesScreen} options={{ title: 'Imagenes Del Evento' }} />
        <Stack.Screen name="ReviewScreen" component={ReviewScreen} options={{ title: 'Agregar Reseña' }} />
        <Stack.Screen name="ReviewListScreen" component={ReviewListScreen} options={{ title: 'Ver Reseña' }} />
        <Stack.Screen name="UserList" component={UserList} />
        <Stack.Screen name="EventList" component={EventList} options={{ title: 'Lista de Eventos' }} />
        <Stack.Screen name="EventDetails" component={EventDetail} options={{ title: 'Detalle Evento' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
