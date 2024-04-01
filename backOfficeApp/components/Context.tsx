import {createContext} from 'react';

const Context = createContext({
  token: '',
  updateToken: (_newToken: string) => {},
  RestaurantId: '',
  updateRestaurantId: (_newRestaurantId: string) => {},
});

export default Context;
