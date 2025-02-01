import API from "./api"
import {User } from "./endpoint"

export const saveUser = (data)=>{
    return API.post(`${User}`,data)
}
export const updateUser = (data) => {
    return API.put(`${User}`, data)
}


export const getFilterUser = (data) => {
    return API.put(`${User}/questionFilter`, data)
}

export const getSingleUser = (data) => {
    return API.get(`${User}/getSingleUser`, { params:  {_id:data}})
}

export const deleteUser = (data) => {
    return API.delete(`${User}`, { params:  {_id:data}})
}

export const getAllUserList = (data) => {
    return API.get(`${User}/`, data)
}