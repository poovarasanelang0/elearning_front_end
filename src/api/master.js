import API from "./api"
import { Master } from "./endpoint"

export const saveMaster = (data)=>{
    return API.post(`${Master}`,data)
}