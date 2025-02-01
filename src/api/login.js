import API from "./api"
import { Login } from "./endpoint"

export const loginAdmin = (data)=>{
    return API.post(`${Login}`,data)
}

export const forgotPassword = (data) => {
    return API.put(`${Login}/forgotPassword`, data);
  };


  export const resetPassword = (data) => {
    return API.put(`${Login}/resetPassword`, data);
  };

     

  

