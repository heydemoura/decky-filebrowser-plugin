import { createContext } from 'react';

export const AppContext = createContext({});

export const AppContextProvider = ({ fileBrowserManager, children }) => {
    return (
        <AppContext.Provider value={{ fileBrowserManager }}>
            {children}
        </AppContext.Provider>
    );
};
