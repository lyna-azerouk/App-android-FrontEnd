import { createContext } from 'react';

const Context = createContext({
    token: "",
    updateToken: (newToken: string) => { },
    ClientId: /* "945487980946653185" */"",
    updateClientId: (newClientId: number) => { }
});

export default Context;