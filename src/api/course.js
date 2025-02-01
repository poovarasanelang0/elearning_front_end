
import API from "./api"
import {Course } from "./endpoint"

export const saveCourse = (data) => {
    return API.post(`${Course}`, data)
}
export const updateCourse = (data) => {
    return API.put(`${Course}`, data)
}


export const getFilterCourse = (data) => {
    return API.put(`${Course}/userFilter`, data)
}

export const getSingleCourse = (data) => {
    return API.get(`${Course}/getSingleCourse`, { params:  {_id:data}})
}

export const deleteCourse = (data) => {
    return API.delete(`${Course}`, { params:  {_id:data}})
}

export const getAllCourseList = (data) => {
    return API.get(`${Course}/`, data)
}