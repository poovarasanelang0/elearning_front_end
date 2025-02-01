
import API from "./api"
import {Question } from "./endpoint"

export const saveQuestion = (data) => {
    return API.post(`${Question}`, data)
}
export const updateQuestion = (data) => {
    return API.put(`${Question}`, data)
}


export const getFilterQuestion = (data) => {
    return API.put(`${Question}/questionFilter`, data)
}

export const getSingleQuestion = (data) => {
    return API.get(`${Question}/getSingleUser`, { params:  {_id:data}})
}


export const getCourseQuestion = (data) => {
    return API.get(`${Question}/getCourseQuestion`, { params: {courseId: data } });
  };
export const deleteQuestion = (data) => {
    return API.delete(`${Question}`, { params:  {_id:data}})
}

export const getAllQuestionList = (data) => {
    return API.get(`${Question}/`, data)
}