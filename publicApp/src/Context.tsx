import { createContext } from 'react';

const Context = createContext({
    token: "",
    updateToken: (newToken: string) => { },
    ClientId: /* "945487980946653185" */"949732840014675969",
    updateClientId: (newClientId: string) => { }
});

export default Context;