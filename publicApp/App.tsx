import React, { useState } from "react"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoarding from "./src/screens/OnBoarding";
import Register from "./src/screens/Register";
import SignIn from "./src/screens/SignIn";
import Home from "./src/screens/Home";
import Restaurant from "./src/screens/Restaurant";
import Context from "./src/Context";
import Orders from "./src/screens/Orders";

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState("");
  const [ClientId, setClientId] = useState("");
  const updateToken = (newToken: string) => {
    setToken(newToken);
  }
  const updateClientId = (newClientId: number) => {
    setClientId(newClientId);
  }
  return (
    <Context.Provider value={{ token, updateToken, ClientId, updateClientId }}>
      <NavigationContainer>
        {token.length === 0 ? (
          <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen
              name="OnBoarding"
              component={OnBoarding}
            />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="SignIn" component={SignIn} />
          </Stack.Navigator>) : (

          <Stack.Navigator screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Restaurant" component={Restaurant} />
            <Stack.Screen name="Orders" component={Orders} />
          </Stack.Navigator>)
        }
      </NavigationContainer>
    </Context.Provider>
  )
}