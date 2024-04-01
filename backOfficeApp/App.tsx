import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBorading from './screens/OnBoarding.tsx';
import Register from './screens/Register.tsx';
import SignIn from './screens/SignIn.tsx';
import Orders from './screens/Orders.tsx';
import Context from './components/Context.tsx';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState('');
  const [RestaurantId, setRestaurantId] = useState('');
  const updateToken = (newToken: string) => {
    setToken(newToken);
  };
  const updateRestaurantId = (newRestaurantId: string) => {
    setRestaurantId(newRestaurantId);
  };

  return (
    <Context.Provider
      value={{token, updateToken, RestaurantId, updateRestaurantId}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="OnBorading" component={OnBorading} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Orders" component={Orders} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
}
