import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';  // Replace with your API's URL

export const fetchData = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.error("There was an error calling the API:", error);
    return null;
  }
};