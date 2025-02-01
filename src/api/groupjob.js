
import API from "./api"
import {Career } from "./endpoint"

export const saveCareer = (data) => {
    return API.post(`${Career}`, data)
}
export const updateJob = (data) => {
    return API.put(`${Career}`, data)
}


export const getFilterJob = (data) => {
    return API.put(`${Career}/getFilterCareer`, data)
}

export const getSingleJob = (data) => {
    return API.get(`${Career}/getSingleCareer`, { params:  {_id:data}})
}

export const deleteJob = (data) => {
    return API.delete(`${Career}`, { params:  {_id:data}})
}

export const getAllJobList = (data) => {
    return API.get(`${Career}/`, data)
}