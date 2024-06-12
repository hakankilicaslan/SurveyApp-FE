import { createContext, useEffect, useState } from "react";
import AuthService from "../service/AuthService";

export const AuthContext = createContext()

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({children}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedUser = AuthService.getCurrentUser();
        return storedUser;
    });

    useEffect(() => {
        const storedUser = AuthService.getCurrentUser();
        setIsAuthenticated(storedUser);
    }, []);

    const login = async (email,password) => {
        try {
            const resData = await AuthService.loginService(email,password)
            if(resData.token){
                setIsAuthenticated(AuthService.getCurrentUser())
            }
            return true
        } catch (error) {
            setIsAuthenticated(false)
            throw new Error(error)
        }
    }
    const logout = () => {
        AuthService.logoutService()
        setIsAuthenticated(false)
    }

    return(
        <AuthContext.Provider value={{isAuthenticated,login,logout}}>
            {children}
        </AuthContext.Provider>
    )

}