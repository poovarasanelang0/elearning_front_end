
import API from "./api"
import {Sop } from "./endpoint"

export const saveSOP = (data) => {
    return API.post(`${Sop}`, data)
}


// export const updateCourse = (data) => {
//     return API.put(`${Course}`, data)
// }


// export const getFilterCourse = (data) => {
//     return API.put(`${Course}/userFilter`, data)
// }

export const getSingleSop = (sopName) => {
    return API.get(`${Sop}/getSingleSop`,{ params: { sopName } });
};


  

// export const deleteCourse = (data) => {
//     return API.delete(`${Course}`, { params:  {_id:data}})
// }

// export const getAllCourseList = (data) => {
//     return API.get(`${Course}/`, data)
// }