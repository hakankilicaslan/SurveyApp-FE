import axios from 'axios'

const AuthService = {
  
    loginService: async (email, password) => {
        const response = await axios.post("http://localhost:8081/api/v1/auth/login", {
            "email": email,
            "password": password
        })
        if(response.data.token){
            sessionStorage.setItem("user", JSON.stringify(response.data))
        }
        return response.data
    },
  
    logoutService() {
      sessionStorage.removeItem("user")
    },

    getCurrentUser: () => {
        return JSON.parse(sessionStorage.getItem("user"))
    }

};
  
export default AuthService;