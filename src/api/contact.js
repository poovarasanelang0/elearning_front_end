import API from "./api"
import { Contact } from "./endpoint"

export const getFilterContactPage = (data) => {
    return API.put(`${Contact}/getFilterContactPage`, data)
}
export const deleteContactPage = (data) => {
    return API.delete(`${Contact}/`, { params:  {_id:data}})
}

export const getSingleContactPage = (data) => {
    return API.get(`${Contact}/getSingleContactPage`, { params:  {_id:data}})
}