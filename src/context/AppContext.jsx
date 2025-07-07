import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setUserInfo = (userData) => setUser(userData);
    const removeUserInfo = () => setUser(null);

    return (
        <AppContext.Provider value={{ user, setUserInfo, removeUserInfo }}>
            {children}
        </AppContext.Provider>
    );
};
