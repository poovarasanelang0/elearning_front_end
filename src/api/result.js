import API from './api';
import { Result } from './endpoint';

// Save answers to a test
export const saveAnswers = (data) => {
  return API.post(`${Result}`, data);
};

// Get result for a specific user and course
export const getResultUser = async (userId) => {
    try {
      const response = await API.get(`${Result}/get-result`, {
        params: { userId: userId }, // Pass userId directly
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching result:", error);
      throw error;
    }
  };


  export const getPassResult = async () => {
    try {
      const response = await API.get(`${Result}/getPassCount`);
      return response.data;
    } catch (error) {
      console.error("Error fetching result:", error.response || error.message);
      throw error;
    }
  };
  export const getCourseQuestion = (data) => {
    return API.get(`${Result}/getCourseQuestion`, { params: {userId: data } });
  };
  
  export const getAllResults = (data) => {
    return API.get(`${Result}/getAllResults`, data)
}
