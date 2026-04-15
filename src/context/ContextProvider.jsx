/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {}
});
export const ContextProvider = ({ children }) => {
    const storedUser = typeof window !== "undefined" ? {
        name: localStorage.getItem('USER_NAME'),
        email: localStorage.getItem('USER_EMAIL'),
        role: localStorage.getItem('USER_ROLE'),
        id: localStorage.getItem('USER_ID'),
        role_id: localStorage.getItem('ROLE_ID'),
    } : {};
    const [user, setUserState] = useState(storedUser);
    const [token, setTokenState] = useState(
        typeof window !== "undefined" ? localStorage.getItem('ACCESS_TOKEN') : null
    );
    useEffect(() => {
        if (user) {
            localStorage.setItem('USER_NAME', user.name);
            localStorage.setItem('USER_EMAIL', user.email);
            localStorage.setItem('USER_ROLE', user.role);
            localStorage.setItem('USER_ID', user.id);
            localStorage.setItem('ROLE_ID', user.role_id);
        } else {
            localStorage.removeItem('USER_NAME');
            localStorage.removeItem('USER_EMAIL');
            localStorage.removeItem('USER_ROLE');
            localStorage.removeItem('USER_ID');
            localStorage.removeItem('ROLE_ID');
        }
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }, [user, token]); 
    const setToken = (newToken) => {
        setTokenState(newToken);
    };
    const setUser = (newUser) => {
        setUserState(newUser);
    };
    return (
        <StateContext.Provider value={{ user, token, setUser, setToken }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
