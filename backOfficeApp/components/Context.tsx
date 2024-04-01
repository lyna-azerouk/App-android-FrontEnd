import {createContext} from 'react';

const Context = createContext({
  token: '',
  updateToken: (_newToken: string) => {},
  RestaurantId: '158603712',
  updateRestaurantId: (_newRestaurantId: string) => {},
});

export default Context;
