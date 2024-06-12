import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const UserAPIContext = createContext();

// eslint-disable-next-line react/prop-types
export const UserAPIContextProvider = ({children}) => {

    const [isLoading, setIsLoading] = useState(true);
    const {isAuthenticated} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isAuthenticated.token){
            return navigate("/login")
        }
    }, []);

    // Volkan: backend ve frontend şu anda herkes sadece "kendi" profilinde CRUD işlemleri yapabilir şeklinde çalışıyor. (remove yani hard-delete hariç)
    // Kurgu üzerinde konuşulması lazım, buradaki kodlar geliştirilebilir, arttırılabilir.
    // Aynı zamanda backendde security devreye girince axios interceptors ile headers içinde authorization: bearer token kullanılacak...

    const handleSaveUser = async (email, password, rePassword, namee, surname) => {
        setIsLoading(true);
        const payload = {
            "email": email,
            "password": password,
            "rePassword": rePassword,
            "name": namee,
            "surname": surname,
        };
        try {
            const response = await axios.post("http://localhost:8081/api/v1/user/save", payload)
            if (response.status === 200) {
                console.log("Saving user successful!");
            }    
        } catch (error) {
            console.log("Error on saving user! ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleUpdateUser = async (email, password, namee, surname, token) => {
        setIsLoading(true);
        const payload = {
            "token": token,
            "email": email,
            "password": password,
            "name": namee,
            "surname": surname,
        };
        try {
            const response = await axios.patch("http://localhost:8081/api/v1/user/update", payload)
            if (response.status === 200) {
                console.log("Updating user successful!");
            }    
        } catch (error) {
            console.log("Error on updating user! ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleGetUser = async (token) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8081/api/v1/user/get/${token}`)
        } catch (error) {
            console.log("Error on getting user! ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleGetAllUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("http://localhost:8081/api/v1/user/get-all")
        } catch (error) {
            console.log("Error on getting all users! ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteUser = async (token) => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`http://localhost:8081/api/v1/user/delete/${token}`)
        } catch (error) {
            console.log("Error on deleting user! ", error);
        } finally {
            setIsLoading(false);
        }
    }

    // Volkan: Admin yapabilir sadece, token admin olduğunu kanıtlamak için, uuid hard-delete yapılacak userın uuid'si
    const handleRemoveUser = async (token, uuid) => {
        setIsLoading(true);
        const payload = {
            "token": token,
            "uuid": uuid,
        };
        try {
            const response = await axios.delete("http://localhost:8081/api/v1/user/remove", payload)
        } catch (error) {
            console.log("Error on removing user! ", error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <UserAPIContext.Provider value={{handleSaveUser, handleUpdateUser, handleGetUser, handleGetAllUsers, handleDeleteUser, handleRemoveUser}}>
            {isLoading ? 
            <h1>Loading...</h1>
            : 
            (children)
            }
        </UserAPIContext.Provider>
    )

}